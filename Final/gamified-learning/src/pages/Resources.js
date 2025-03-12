import React from 'react';

const resources = [
  { title: "Data Structures Overview", link: "https://www.geeksforgeeks.org/data-structures/" },
  { title: "Algorithms in Depth", link: "https://www.khanacademy.org/computing/computer-science/algorithms" },
  { title: "React Documentation", link: "https://reactjs.org/docs/getting-started.html" }
];

const Resources = () => (
  <div className="resources-page">
    <h2>Learning Resources & Notes</h2>
    <ul>
      {resources.map((res, index) => (
        <li key={index}>
          <a href={res.link} target="_blank" rel="noopener noreferrer">
            {res.title}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default Resources;
