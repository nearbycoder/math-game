import React, { useState, useEffect } from 'react';
import Confetti from 'react-dom-confetti';

const config = {
  angle: 180,
  spread: 360,
  startVelocity: 40,
  elementCount: 120,
  dragFriction: 0.12,
  duration: 3000,
  stagger: 3,
  width: '10px',
  height: '10px',
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6'],
};

const operators = [
  { symbol: '+', name: 'add' },
  { symbol: '-', name: 'subtract' },
  { symbol: '×', name: 'multiply' },
  { symbol: '÷', name: 'divide' },
];

export default function Game({
  num,
  operator,
}: {
  num: number;
  operator: string;
}) {
  const op = operators.find((op) => operator === op.name);

  const logic = [...Array(10).keys()].map((i) => {
    const index = i + 1;
    switch (op?.name) {
      case 'add':
        return {
          question: `${index} + ${num} = ?`,
          answer: index + num,
        };

      case 'subtract':
        return {
          question: `${index} - ${num} = ?`,
          answer: index - num,
        };
      case 'multiply':
        return {
          question: `${index} × ${num} = ?`,
          answer: index * num,
        };
      case 'divide':
        return {
          question: `${index} ÷ ${num} = ?`,
          answer: Math.round((index / num) * 100) / 100,
        };
      default:
        return {
          question: `${index} + ${num} = ?`,
          answer: index + num,
        };
    }
  });
  const [randomIndex, setRandomIndex] = useState<number>(0);
  const [randomAnswers, setRandomAnswers] = useState<number[]>([]);
  const [badAnswers, setBadAnswers] = useState<number[]>([]);
  const [answers, setAnswers] = useState<
    {
      question: string;
      answer: number;
      correct?: boolean;
    }[]
  >([]);
  const [confetti, setConfetti] = useState<boolean>(false);

  const getRandomIndex = () => Math.floor(Math.random() * 10);

  const resetQuestion = () => {
    setBadAnswers([]);
    setRandomIndex(getRandomIndex());
    setRandomAnswers(
      logic.map(({ answer }) => answer).sort(() => Math.random() - 0.5)
    );
  };

  useEffect(() => {
    resetQuestion();
  }, []);

  const currentQuestion = logic[randomIndex];

  return (
    <div className="font-mono">
      <div className="flex justify-around flex-col text-center md:flex-row">
        <div>
          Correct Answers: {answers.filter((answer) => answer?.correct).length}
        </div>
        <div>
          Wrong Answers: {answers.filter((answer) => !answer?.correct).length}
        </div>
      </div>
      <div className="text-4xl md:text-9xl text-center p-4">
        {currentQuestion.question}
        <div className="flex justify-center items-center">
          <Confetti active={confetti} config={config} />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-8">
        {randomAnswers.map((answer) => (
          <button
            onClick={() => {
              const correct = answer === currentQuestion.answer;
              if (badAnswers.includes(answer)) {
                return;
              }

              if (correct) {
                resetQuestion();

                setConfetti(true);
                setTimeout(() => {
                  setConfetti(false);
                }, 500);
              } else {
                setBadAnswers((badAnswers) => [...badAnswers, answer]);
              }

              setAnswers((answers) => [
                ...answers,
                {
                  ...currentQuestion,
                  correct,
                },
              ]);
            }}
            className={`border rounded text-md md:text-5xl p-4 ${
              badAnswers.includes(answer) ? 'bg-red-400' : ''
            }`}
            key={answer}>
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
}
