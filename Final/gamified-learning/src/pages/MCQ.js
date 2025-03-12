import React, { useState, useContext } from 'react';
import { GamificationContext } from '../contexts/GamificationContext';

const sampleQuestions = [
  {
    id: 1,
    question: "What is the time complexity of Merge Sort?",
    options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
    answer: "O(n log n)"
  },
  {
    id: 2,
    question: "Which data structure uses LIFO?",
    options: ["Queue", "Stack", "Tree", "Graph"],
    answer: "Stack"
  },
  {
    id: 3,
    question: "What is the worst-case time complexity for Quick Sort?",
    options: ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"],
    answer: "O(n^2)"
  }
];

const MCQ = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const { addPoints } = useContext(GamificationContext);

  const handleAnswer = (option) => {
    if (option === sampleQuestions[currentQuestion].answer) {
      setScore(score + 1);
      addPoints(10); // Award 10 points for a correct answer
    }
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      alert(`Quiz complete! Your score: ${score + 1} / ${sampleQuestions.length}`);
      setCurrentQuestion(0);
      setScore(0);
    }
  };

  const { question, options } = sampleQuestions[currentQuestion];

  return (
    <div className="mcq-page">
      <h2>DSA MCQ Quiz</h2>
      <p>{question}</p>
      <div className="options">
        {options.map((option, idx) => (
          <button key={idx} className="btn" onClick={() => handleAnswer(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MCQ;
