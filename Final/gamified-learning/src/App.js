import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MCQ from './pages/MCQ';
import Resources from './pages/Resources';
import { GamificationProvider } from './contexts/GamificationContext';

function App() {
  return (
    <GamificationProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mcq" element={<MCQ />} />
          <Route path="/resources" element={<Resources />} />
          {/* Additional routes (e.g., for coding challenges) can be added here */}
        </Routes>
        <Footer />
      </Router>
    </GamificationProvider>
  );
}

export default App;
