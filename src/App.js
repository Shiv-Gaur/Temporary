// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // Session states using sessionStorage for per‑tab sessions.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [user, setUser] = useState(null);

  // Form states
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '', password: '', email: '', mobile: '',
    cardNumber: '', expiry: '', cvv: ''
  });
  const [transactionData, setTransactionData] = useState({ recipientUsername: '', amount: '' });
  const [location, setLocation] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [logoutHover, setLogoutHover] = useState(false);

  // Updated container style: full viewport with a fixed background image and scrollable content if needed.
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundImage: "url('background.jpg')", // Ensure background.jpg is in your public folder.
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    overflowY: 'auto',
    padding: '20px'
  };

  const headerStyle = {
    textAlign: 'center',
    padding: '20px',
    color: '#fff',
    fontFamily: "'Moon Dance', cursive", // Make sure to include the Google Fonts link in public/index.html
    fontSize: '3rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.6)'
  };

  // Glass morphism card style for content cards.
  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '15px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '20px',
    margin: '20px',
    width: '100%',
    maxWidth: '500px'
  };

  const formGroupStyle = { marginBottom: '15px' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' };
  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    outline: 'none',
    marginBottom: '5px'
  };
  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: 'rgba(74, 144, 226, 0.8)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };
  const toggleButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#fff',
    textDecoration: 'underline',
    cursor: 'pointer',
    padding: '0'
  };

  // Logout button style with hover animation.
  const logoutButtonStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: logoutHover ? 'translateX(-50%) scale(1.05)' : 'translateX(-50%)',
    padding: '10px 20px',
    backgroundColor: logoutHover ? 'rgba(74,144,226,1)' : 'rgba(74,144,226,0.8)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'transform 0.3s, background-color 0.3s'
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      axios.get(`http://localhost:5000/api/user/${parsedUser._id}`)
        .then(res => {
          setUser(res.data.user);
          setIsLoggedIn(true);
          sessionStorage.setItem('user', JSON.stringify(res.data.user));
          fetchTransactions(res.data.user._id);
        })
        .catch(err => console.error(err));
    }
  }, []);

  const handleLoginChange = e => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleRegisterChange = e => setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  const handleTransactionChange = e => setTransactionData({ ...transactionData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', loginData);
      setUser(res.data.user);
      setIsLoggedIn(true);
      sessionStorage.setItem('user', JSON.stringify(res.data.user));
      fetchTransactions(res.data.user._id);
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', {
        username: registerData.username,
        password: registerData.password,
        email: registerData.email,
        mobile: registerData.mobile,
        cardDetails: {
          cardNumber: registerData.cardNumber,
          expiry: registerData.expiry,
          cvv: registerData.cvv
        }
      });
      alert('Registration successful. Please login.');
      setIsRegister(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  // Get location using Geolocation API.
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        error => alert("Error getting location: " + error.message)
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      alert("Please obtain your location first.");
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/transaction', {
        senderId: user._id,
        recipientUsername: transactionData.recipientUsername,
        amount: parseFloat(transactionData.amount),
        location // { lat, lng }
      });
      alert('Transaction successful');
      fetchTransactions(user._id);
      axios.get(`http://localhost:5000/api/user/${user._id}`)
        .then(res => {
          setUser(res.data.user);
          sessionStorage.setItem('user', JSON.stringify(res.data.user));
        });
      setTransactionData({ recipientUsername: '', amount: '' });
      setLocation(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Transaction failed');
    }
  };

  const fetchTransactions = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/transactions/${userId}`);
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    sessionStorage.removeItem('user');
  };

  if (!isLoggedIn) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}><h1>PayBuzz</h1></div>
        <div style={cardStyle}>
          {isRegister ? (
            <div>
              <h2 style={{ textAlign: 'center', color: '#fff' }}>Register</h2>
              <form onSubmit={handleRegisterSubmit}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Username:</label>
                  <input type="text" name="username" value={registerData.username} onChange={handleRegisterChange} style={inputStyle} required />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Password:</label>
                  <input type="password" name="password" value={registerData.password} onChange={handleRegisterChange} style={inputStyle} required />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Email:</label>
                  <input type="email" name="email" value={registerData.email} onChange={handleRegisterChange} style={inputStyle} required />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Mobile (e.g., +919876543210):</label>
                  <input type="text" name="mobile" value={registerData.mobile} onChange={handleRegisterChange} style={inputStyle} required />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Card Number:</label>
                  <input type="text" name="cardNumber" value={registerData.cardNumber} onChange={handleRegisterChange} style={inputStyle} required />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Expiry (MM/YY):</label>
                  <input type="text" name="expiry" value={registerData.expiry} onChange={handleRegisterChange} style={inputStyle} required />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>CVV:</label>
                  <input type="password" name="cvv" value={registerData.cvv} onChange={handleRegisterChange} style={inputStyle} required />
                </div>
                <button type="submit" style={buttonStyle}>Register</button>
                <p style={{ textAlign: 'center', marginTop: '10px', color: '#fff' }}>
                  Already have an account? <button type="button" style={toggleButtonStyle} onClick={() => setIsRegister(false)}>Login</button>
                </p>
              </form>
            </div>
          ) : (
            <div>
              <h2 style={{ textAlign: 'center', color: '#fff' }}>Login</h2>
              <form onSubmit={handleLoginSubmit}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Username:</label>
                  <input type="text" name="username" value={loginData.username} onChange={handleLoginChange} style={inputStyle} required />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Password:</label>
                  <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} style={inputStyle} required />
                </div>
                <div style={formGroupStyle}>
                  <input type="checkbox" id="humanCheck" defaultChecked />
                  <label htmlFor="humanCheck" style={{ color: '#fff' }}> I am not a robot</label>
                </div>
                <button type="submit" style={buttonStyle}>Login</button>
                <p style={{ textAlign: 'center', marginTop: '10px', color: '#fff' }}>
                  Don't have an account? <button type="button" style={toggleButtonStyle} onClick={() => setIsRegister(true)}>Register</button>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main UI for logged-in user.
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>PayBuzz</h1>
      </div>
      <div style={cardStyle}>
        <h2 style={{ color: '#fff' }}>Welcome, {user.username}!</h2>
        <p style={{ fontSize: '18px', color: '#fff' }}><strong>Your Balance:</strong> ${user.balance}</p>
      </div>
      <div style={cardStyle}>
        <h3 style={{ textAlign: 'center', color: '#fff' }}>Make a Transaction</h3>
        <form onSubmit={handleTransactionSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Recipient Username:</label>
            <input type="text" name="recipientUsername" value={transactionData.recipientUsername} onChange={handleTransactionChange} style={inputStyle} required />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Amount:</label>
            <input type="number" name="amount" value={transactionData.amount} onChange={handleTransactionChange} style={inputStyle} required />
          </div>
          <div style={formGroupStyle}>
            <button type="button" onClick={getLocation} style={buttonStyle}>Get Location</button>
            {location && (
              <p style={{ textAlign: 'center', marginTop: '10px', color: '#fff' }}>
                Location: Fetching name...
              </p>
            )}
          </div>
          <button type="submit" style={buttonStyle}>Send Money</button>
        </form>
      </div>
      <div style={cardStyle}>
        <h3 style={{ textAlign: 'center', color: '#fff' }}>Transaction History</h3>
        {transactions.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
                <th style={{ padding: '8px', textAlign: 'left', color: '#fff' }}>Date</th>
                <th style={{ padding: '8px', textAlign: 'left', color: '#fff' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
                  <td style={{ padding: '8px', color: '#fff' }}>{new Date(tx.date).toLocaleString()}</td>
                  <td style={{ padding: '8px', color: '#fff' }}>
                    {tx.from._id.toString() === user._id
                      ? `Sent $${tx.amount} to ${tx.to.username} from ${tx.location || 'Unknown Location'}`
                      : `Received $${tx.amount} from ${tx.from.username}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center', color: '#fff' }}>No transactions found.</p>
        )}
      </div>
      <button
        onClick={handleLogout}
        style={logoutButtonStyle}
        onMouseEnter={() => setLogoutHover(true)}
        onMouseLeave={() => setLogoutHover(false)}
      >
        Logout
      </button>
    </div>
  );
}

export default App;
