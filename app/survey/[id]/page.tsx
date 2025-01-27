'use client';

import {useParams} from "next/navigation";
import {useRef, useState} from "react";
import {usePageByIndex} from "@/data/use-page";
import {Button, ButtonGroup, Center, Container, LoadingOverlay, Space, Stack} from "@mantine/core";
import SafeHTML from "@/components/SafeHTML";
import {useQuestionByPage} from "@/data/use-question";
import Question from "@/components/Question/Question";

export default function Survey() {
  const params = useParams();
  const survey = (params.id || 0) as number;
  const [pageIndex, setPageIndex] = useState(0);
  const page = usePageByIndex(survey, pageIndex);
  const questions = useQuestionByPage(page.page?.data.id || 0);
  const [answers, setAnswers] = useState(new Map());

  const updateAnswer = (id: number, answer: string) => {
    setAnswers(prevAnswers => {
      const newAnswers = new Map(prevAnswers);
      newAnswers.set(id, answer);
      return newAnswers;
    });
  };

  const handleFinish = () => {
    console.log(answers);
  }

  return (
    <Container w="80%">
      <Center>
        <SafeHTML content={page.page?.data.title || ""}/>
      </Center>
      <LoadingOverlay visible={page.isLoading || questions.isLoading}/>
      <Stack gap="xl">
        {questions.questionList?.map((question) => (
          <Question question={question} key={question.id} value={answers.get(question.id) || ''}
                    setValue={(answer) => updateAnswer(question.id, answer)}/>
        ))}
      </Stack>
      <Space h="lg"/>
      <ButtonGroup>
        <Button onClick={() => setPageIndex(pageIndex - 1)} fullWidth disabled={pageIndex === 0}>上一页</Button>
        <Button onClick={() => pageIndex + 1 >= (page.page?.total || 0) ? handleFinish() : setPageIndex(pageIndex + 1)}
                fullWidth
                color={pageIndex + 1 >= (page.page?.total || 0) ? "green" : "blue"}>下一页</Button>
      </ButtonGroup>
    </Container>
  );
}
