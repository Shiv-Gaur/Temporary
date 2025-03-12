// src/pages/Resources.js
import React from 'react';
import '../index.css';

const resources = [
  {
    title: "Data Structures Overview",
    description: "A comprehensive guide to data structures with examples and use cases.",
    link: "https://www.geeksforgeeks.org/data-structures/"
  },
  {
    title: "Algorithms in Depth",
    description: "Learn algorithms with step-by-step explanations and interactive examples.",
    link: "https://www.khanacademy.org/computing/computer-science/algorithms"
  },
  {
    title: "React Documentation",
    description: "Official React documentation, tutorials, and guides.",
    link: "https://reactjs.org/docs/getting-started.html"
  }
];

const Resources = () => (
  <div className="resources-page">
    <h2>Learning Resources & Notes</h2>
    <div className="resources-container">
      {resources.map((res, index) => (
        <div key={index} className="resource-card">
          <h3>{res.title}</h3>
          <p>{res.description}</p>
          <a href={res.link} target="_blank" rel="noopener noreferrer" className="btn">
            Learn More
          </a>
        </div>
      ))}
    </div>
  </div>
);

export default Resources;
