import React, { useState } from "react";
import OpenAi from "openai";
import { Button, Input, Link } from "@nextui-org/react";
import QuizCard from "./components/QuizCard";

const openai = new OpenAi({
  apiKey: import.meta.env.VITE_OPEN_API_KEY,
  dangerouslyAllowBrowser: true,
});

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
}

const QuizApp = () => {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [countCorrects, setCountCorrect] = useState(0);
  const [countIncorrect, setCountIncorrect] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);

  const generateQuiz = async () => {
    setQuiz([]);
    setCountCorrect(0);
    try {
      const prompt = `Generate a JSON array of 10 multiple-choice questions with 4 options and 1 correct answer based on the following topic: ${topic} use this format 
        [
          {
            "question": "",
            "options": [
              "",
              "",
              "",
              ""
            ],
            "correct_answer": 0 // index of the correct answer option
          }
        ]
      `;

      const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt,
        max_tokens: 2048,
        n: 1,
        stop: null,
        temperature: 0.7,
      });
      console.log(response);
      const data: QuizQuestion[] = JSON.parse(response.choices[0].text);
      setQuiz(data);
    } catch (error) {
      console.error("Error generating quiz:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    generateQuiz();
  };

  const checkAnswer = (id: number, answer: number) => {
    // check
    if (quiz.length > 0 && quiz[id].correct_answer === answer) {
      setCountCorrect(countCorrects + 1);
    } else {
      setCountIncorrect(countIncorrect + 1);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-3xl font-bold text-center mb-3">AI Quiz Generator</h1>
      {quiz.length === 0 && (
        <form onSubmit={handleSubmit} className=" px-10 w-full">
          <p className="mb-4 text-center">Enter the topics and get questions</p>
          <div className="flex justify-center items-center w-full ">
            <Input
              isClearable
              size="lg"
              className="mr-2 max-w-xl"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onClear={() => setTopic("")}
              type="text"
              isRequired
              minLength={5}
              maxLength={100}
              placeholder="Enter the topic"
            />
            <Button isIconOnly color="primary" type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </Button>
          </div>
          <p className="text-center mt-3">
            Made by{" "}
            <Link
              underline="always"
              href="https://github.com/charan-sai-v"
              target="_blank"
            >
              Charan Sai
            </Link>
          </p>
        </form>
      )}
      {quiz.length > 0 && (
        <p className="text-center mb-3">
          Total Questions: {quiz.length}, Correct Answers: {countCorrects},
          Incorrect Answers: {countIncorrect}
        </p>
      )}
      <div className="flex flex-col items-center justify-center">
        {quiz.length > 0 && (
          <>
            <QuizCard
              question={quiz[questionNumber].question}
              correct_answer={quiz[questionNumber].correct_answer}
              id={questionNumber}
              options={quiz[questionNumber].options}
              checkAnswer={checkAnswer}
            />
            <div
              className={`${
                questionNumber === 9 ? "invisible" : ""
              }  flex justify-end mt-5`}
            >
              <Button onClick={() => setQuestionNumber(questionNumber + 1)}>
                Next
              </Button>
            </div>
            {questionNumber === 9 && (
              <div className="mt-5">
                <Button onClick={() => document.location.reload()}>
                  Try Another
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      {/* {quiz.length > 0 && (
        <div>
          <h2>Quiz</h2>
          {quiz.map((question, index) => (
            <div key={index}>
              <p>{question.question}</p>
              <ul>
                {question.options.map((option, optionIndex) => (
                  <li key={optionIndex}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={optionIndex}
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default QuizApp;
