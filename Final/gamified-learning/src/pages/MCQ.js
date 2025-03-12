// src/pages/MCQ.js
import React, { useState, useContext } from 'react';
import { GamificationContext } from '../contexts/GamificationContext';
import '../index.css';

const sampleQuestions = [
  { id: 1, question: "What is the time complexity of Merge Sort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], answer: "O(n log n)" },
  { id: 2, question: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Tree", "Graph"], answer: "Stack" },
  { id: 3, question: "What is the worst-case time complexity for Quick Sort?", options: ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"], answer: "O(n^2)" },
  { id: 4, question: "Which data structure is used for breadth-first search?", options: ["Stack", "Queue", "Linked List", "Tree"], answer: "Queue" },
  { id: 5, question: "Which algorithm is used to find the shortest path in a weighted graph?", options: ["DFS", "BFS", "Dijkstra's Algorithm", "Merge Sort"], answer: "Dijkstra's Algorithm" },
  { id: 6, question: "What is the space complexity of Merge Sort?", options: ["O(1)", "O(n)", "O(n log n)", "O(n^2)"], answer: "O(n)" },
  { id: 7, question: "Which data structure is best for implementing recursion?", options: ["Stack", "Queue", "Graph", "Tree"], answer: "Stack" },
  { id: 8, question: "What is the average-case time complexity of Quick Sort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], answer: "O(n log n)" },
  { id: 9, question: "Which sorting algorithm is stable?", options: ["Merge Sort", "Quick Sort", "Heap Sort", "Selection Sort"], answer: "Merge Sort" },
  { id: 10, question: "Which data structure is used for depth-first search?", options: ["Stack", "Queue", "Heap", "Graph"], answer: "Stack" },
  { id: 11, question: "Which algorithm finds the minimum spanning tree?", options: ["Prim's Algorithm", "Dijkstra's Algorithm", "Kruskal's Algorithm", "Both Prim's and Kruskal's"], answer: "Both Prim's and Kruskal's" },
  { id: 12, question: "Which data structure uses FIFO?", options: ["Stack", "Queue", "Graph", "Tree"], answer: "Queue" },
  { id: 13, question: "What is the worst-case time complexity of Bubble Sort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], answer: "O(n^2)" },
  { id: 14, question: "Which algorithm is used for cycle detection in a linked list?", options: ["Binary Search", "Floyd's Cycle-Finding Algorithm", "Quick Sort", "Merge Sort"], answer: "Floyd's Cycle-Finding Algorithm" },
  { id: 15, question: "What is the best-case time complexity for Insertion Sort?", options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"], answer: "O(n)" }
];

const MCQ = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [attempted, setAttempted] = useState(new Set());
  const [score, setScore] = useState(0);
  const { addPoints } = useContext(GamificationContext);

  const totalQuestions = sampleQuestions.length;

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const recordAttempt = () => {
    // Only record if not attempted already
    if (!attempted.has(currentQuestion)) {
      setAttempted(prev => new Set(prev).add(currentQuestion));
      if (selectedOption === sampleQuestions[currentQuestion].answer) {
        setScore(prev => prev + 1);
        addPoints(10); // Award 10 points for correct answer
      }
    }
  };

  const handleNext = () => {
    recordAttempt();
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      alert(`Quiz complete! Your score: ${score + (selectedOption === sampleQuestions[currentQuestion].answer ? 1 : 0)} / ${totalQuestions}`);
      // Optionally reset quiz
      setCurrentQuestion(0);
      setScore(0);
      setAttempted(new Set());
      setSelectedOption(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
    }
  };

  const handleSkip = () => {
    // Mark current question as attempted (without awarding points)
    if (!attempted.has(currentQuestion)) {
      setAttempted(prev => new Set(prev).add(currentQuestion));
    }
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      alert(`Quiz complete! Your score: ${score} / ${totalQuestions}`);
      setCurrentQuestion(0);
      setScore(0);
      setAttempted(new Set());
      setSelectedOption(null);
    }
  };

  return (
    <div className="mcq-page">
      <h2>DSA MCQ Quiz</h2>
      <div className="question-card">
        <p className="question-text">
          {sampleQuestions[currentQuestion].question}
        </p>
        <div className="options">
          {sampleQuestions[currentQuestion].options.map((option, idx) => (
            <button
              key={idx}
              className={`btn option-btn ${selectedOption === option ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="mcq-footer">
        <div className="progress">
          Question {currentQuestion + 1} / {totalQuestions}
        </div>
        <div className="controls">
          <button className="btn control-btn" onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </button>
          <button className="btn control-btn" onClick={handleSkip}>
            Skip
          </button>
          <button className="btn control-btn" onClick={handleNext}>
            Next
          </button>
        </div>
        <div className="attempted">
          Attempted: {attempted.size} / {totalQuestions}
        </div>
      </div>
    </div>
  );
};

export default MCQ;
