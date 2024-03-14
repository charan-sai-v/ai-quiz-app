import { Button, Card, CardBody } from "@nextui-org/react";
import { useEffect, useState } from "react";

type QuizCardProps = {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  checkAnswer: (id: number, answer: number) => void;
};

export default function QuizCard({
  id,
  question,
  options,
  correct_answer,
  checkAnswer,
}: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswerClick = (answerIndex: number) => {
    checkAnswer(id, answerIndex);
    setSelectedAnswer(answerIndex);
  };

  useEffect(() => {
    setSelectedAnswer(null); // Reset the state when the id prop changes
  }, [id]);

  return (
    <Card className="w-full max-w-2xl">
      <CardBody className="p-10">
        <p>
          {id + 1}. {question}
        </p>
        <div className="flex flex-col gap-5 w-full mt-5">
          {options.map((option, index) => (
            <Button
              key={index}
              id={index.toString()}
              variant="bordered"
              disabled={selectedAnswer !== null}
              className={
                selectedAnswer !== null &&
                selectedAnswer !== correct_answer &&
                selectedAnswer === index
                  ? "bg-red-500"
                  : selectedAnswer === correct_answer &&
                    selectedAnswer === index
                  ? "bg-green-500"
                  : ""
              }
              onClick={() => handleAnswerClick(index)}
            >
              {option}
            </Button>
          ))}
          {selectedAnswer !== null && selectedAnswer !== correct_answer && (
            <p className="text-red-500 mt-3">
              Your answer is incorrect. Correct answer:{" "}
              {options[correct_answer]}
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
