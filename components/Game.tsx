import React, { useState, useEffect } from 'react';

export default function Game({ num = 3 }: { num?: number }) {
  const logic = [...Array(10).keys()].map((i) => {
    return {
      question: `${i + 1} * ${num} = ?`,
      answer: (i + 1) * num,
    };
  });
  const [randomIndex, setRandomIndex] = useState(0);
  const [randomAnswers, setRandomAnswers] = useState([]);
  const [badAnswers, setBadAnswers] = useState([]);
  const [answers, setAnswers] = useState<
    {
      question: string;
      answer: number;
      correct?: boolean;
    }[]
  >([]);

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
