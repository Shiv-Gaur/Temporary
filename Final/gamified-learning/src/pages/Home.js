// src/pages/Home.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { GamificationContext } from '../contexts/GamificationContext';
import '../index.css';

const Home = () => {
  const { points, badges } = useContext(GamificationContext);

  return (
    <>
      {/* Dashboard Section */}
      <section className="dashboard">
        <h2>Your Dashboard</h2>
        <p>Points: {points}</p>
        <p>Badges: {badges.length > 0 ? badges.join(', ') : 'None'}</p>
      </section>

      {/* How It Works Section (INLINE BACKGROUND) */}
      <section
        className="how-it-works"
        style={{
          backgroundImage: "url('/assets/pexels-imvitordiniz-31103742.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          color: 'white'
        }}
      >
        <h2>What we have?</h2>
        <div className="steps">
          <div className="step">
            <img src="/assets/interactive.png" alt="Interactive Learning" />
            <h3>Learn & Engage</h3>
            <p>Take interactive lessons and games.</p>
          </div>
          <div className="step">
            <img src="/assets/rewards.png" alt="Gamification" />
            <h3>Earn & Compete</h3>
            <p>Gain points, badges, and rewards.</p>
          </div>
          <div className="step">
            <img src="/assets/ai.png" alt="AI-Powered Personalization" />
            <h3>Adapt & Improve</h3>
            <p>AI customizes content based on your progress.</p>
          </div>
          <div className="step">
            <img src="/assets/community.png" alt="Community Support" />
            <h3>Track & Achieve</h3>
            <p>Monitor progress and climb leaderboards.</p>
          </div>
        </div>
      </section>

      {/* Features Section (INLINE BACKGROUND) */}
      <section
        className="features"
        style={{
          backgroundImage: "url('/assets/pexels-mayday-1365795.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          color: 'white'
        }}
      >
        <div className="features-container">
          <div className="feature">
            <h3>Interactive Learning</h3>
            <p>Engage with coding challenges and quizzes to reinforce your skills.</p>
          </div>
          <div className="feature">
            <h3>AI-Powered Personalization</h3>
            <p>Adaptive difficulty levels based on your learning progress.</p>
          </div>
          <div className="feature">
            <h3>Gamification</h3>
            <p>Earn badges, level up, and compete on leaderboards.</p>
          </div>
          <div className="feature">
            <h3>Community Support</h3>
            <p>Collaborate and learn with a vibrant coding community.</p>
          </div>
        </div>
      </section>

      {/* Coding Challenges Section */}
      <section className="coding-challenges">
        <h2>Coding Challenges</h2>
        <p>Put your coding skills to the test with our weekly challenges!</p>
        <div className="challenges-container">
          <div className="challenge-card">
            <h3>Build a Calculator</h3>
            <p>Create a fully functional calculator using JavaScript.</p>
            <Link to="/challenge/1" className="btn">Start Challenge</Link>
          </div>
          <div className="challenge-card">
            <h3>Todo App</h3>
            <p>Develop a simple todo application to manage tasks.</p>
            <Link to="/challenge/2" className="btn">Start Challenge</Link>
          </div>
          <div className="challenge-card">
            <h3>Portfolio Website</h3>
            <p>Design a personal portfolio website using React.</p>
            <Link to="/challenge/3" className="btn">Start Challenge</Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Join the Revolution</h2>
        <p>Start your gamified learning journey today!</p>
        <Link to="/signup" className="btn">Sign Up Now</Link>
      </section>
    </>
  );
};

export default Home;
