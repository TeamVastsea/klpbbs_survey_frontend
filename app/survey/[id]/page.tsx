'use client';

import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {usePageByIndex} from "@/data/use-page";
import {Button, ButtonGroup, Center, Container, LoadingOverlay, Space, Stack} from "@mantine/core";
import SafeHTML from "@/components/SafeHTML";
import {useQuestionByPage} from "@/data/use-question";
import Question from "@/components/Question/Question";
import {ScoreNetwork} from "@/network/score";
import {notifications} from "@mantine/notifications";

export default function Survey() {
  const router = useRouter();
  const params = useParams();
  const survey = JSON.parse(params.id as string || '0') as number;
  const [pageIndex, setPageIndex] = useState(0);
  const page = usePageByIndex(survey, pageIndex);
  const questions = useQuestionByPage(page.page?.data.id || 0);
  const [answers, setAnswers] = useState(new Map());
  const [scoreId, setScoreId] = useState<number>();
  const [loading, setLoading] = useState(false);

  const updateAnswer = (id: number, answer: string) => {
    setAnswers(prevAnswers => {
      const newAnswers = new Map(prevAnswers);
      newAnswers.set(id, answer);
      return newAnswers;
    });
  };

  useEffect(() => {
    if (answers.size === 0) {
      return;
    }

    ScoreNetwork.submitAnswer(survey, Object.fromEntries(answers), scoreId)()
      .then((res) => {setScoreId(res)});
      notifications.show({title: '保存成功', message: '当前的内容已保存', color: 'teal'});
  }, [pageIndex]);

  const handleFinish = () => {
    if (scoreId === undefined) {
      return
    }

    setLoading(true);

    ScoreNetwork.finishAnswer(scoreId)()
      .then(() => {
        notifications.show({title: '提交成功', message: '您已经成功提交问卷', color: 'teal'});
        router.push(`/survey/${survey}/finished`);
      })
      .finally(() => setLoading(false));
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
                fullWidth color={pageIndex + 1 >= (page.page?.total || 0) ? "green" : "blue"} loading={loading}>
          {pageIndex + 1 >= (page.page?.total || 0) ? "提交" : "下一页"}
        </Button>
      </ButtonGroup>
    </Container>
  );
}
