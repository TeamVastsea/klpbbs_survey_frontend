'use client';

import {useRef, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {Button, ButtonGroup, Center, Container, LoadingOverlay, Space, Stack,} from '@mantine/core';
import Question from '@/components/Question/Question';
import SafeHTML from '@/components/SafeHTML';
import {usePageByIndex} from '@/data/use-page';
import {useQuestionByPage} from '@/data/use-question';
import {useScoreById} from "@/data/use-score";
import {ScoreNetwork} from "@/network/score";

export default function Survey() {
  const router = useRouter();
  const params = useParams();
  const scoreId = JSON.parse((params.id as string) || '0') as number;
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const score = useScoreById(scoreId);
  const page = usePageByIndex(score.score?.survey || 0, pageIndex);
  const questions = useQuestionByPage(page.page?.data.id || 0);
  const answers = new Map<string, string>(Object.entries(JSON.parse(score.score?.answer || "[]")))

  // 验证相关状态
  const questionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // 处理页面切换，检查当前页面是否有未回答的必填题
  const handlePageChange = (newPageIndex: number) => {
    if (!questions.questionList) {
      setPageIndex(newPageIndex);
      return;
    }

    setPageIndex(newPageIndex);
  };

  const handleFinish = () => {
    console.log(answers)
  };

  return (
    <Container w="80%">
      <LoadingOverlay visible={page.isLoading || questions.isLoading}/>

      <Center>
        <SafeHTML content={page.page?.data.title || ''}/>
      </Center>

      <Stack gap="xl">
        {questions.questionList?.map((question) => (
          <div key={question.id}>
            <Question
              question={question}
              value={answers.get(question.id.toString()) || ""}
              // value = ""
              setValue={() => {
              }}
            />
          </div>
        ))}
      </Stack>

      <Space h="lg"/>

      <Stack>
        <ButtonGroup>
          <Button onClick={() => setPageIndex(pageIndex - 1)} fullWidth disabled={pageIndex === 0}>
            上一页
          </Button>
          <Button
            onClick={() => handlePageChange(pageIndex + 1)}
            fullWidth
            disabled={pageIndex + 1 >= (page.page?.total || 0)}
            loading={loading}
          >
            下一页
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button onClick={() => ScoreNetwork.confirmScore(score.score?.survey || 0)} fullWidth
                  color="green">确认结果</Button>
          <Button onClick={() => ScoreNetwork.rejudgeScore(score.score?.survey || 0)} fullWidth>重新判题</Button>
          <Button onClick={() => router.push("/admin/score")} fullWidth>返回提交目录</Button>
        </ButtonGroup>
      </Stack>
    </Container>
  );
}

// function convertArrayToMap(arr: Array<any>): Map<number, string> {
//
// }