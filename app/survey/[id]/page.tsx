'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {Button, ButtonGroup, Center, Container, LoadingOverlay, Space, Stack,} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {notifications} from '@mantine/notifications';
import LoadAnswerScreen from '@/app/survey/[id]/components/LoadAnswerScreen';
import {checkNecessaryQuestions} from '@/app/survey/utils/validate';
import {checkVisibility} from '@/app/survey/utils/visibility';
import Question from '@/components/Question/Question';
import SafeHTML from '@/components/SafeHTML';
import {usePageByIndex} from '@/data/use-page';
import {useQuestionByPage} from '@/data/use-question';
import {ScoreNetwork} from '@/network/score';

export default function Survey() {
  const router = useRouter();
  const params = useParams();
  const survey = JSON.parse((params.id as string) || '0') as number;
  const [pageIndex, setPageIndex] = useState(0);
  const [answers, setAnswers] = useState(new Map());
  const [scoreId, setScoreId] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [loadable, setLoadable] = useState<{ id: number; answer: string; update_time: string }[]>(
    []
  );
  const [loadableOpened, { open, close }] = useDisclosure(false);
  const page = usePageByIndex(survey, pageIndex);
  const questions = useQuestionByPage(page.page?.data.id || 0);

  // 验证相关状态
  const [unansweredQuestions, setUnansweredQuestions] = useState<any[]>([]);
  const questionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // 计算问题可见性
  const visibleQuestions = useMemo(() => {
    if (!questions.questionList) {
      return [];
    }
    const visibility = checkVisibility(answers, questions.questionList);
    return questions.questionList.filter((_, index) => visibility[index]);
  }, [questions.questionList, answers]);

  const updateAnswer = (id: number, answer: string) => {
    setAnswers((prevAnswers) => {
      const newAnswers = new Map(prevAnswers);
      newAnswers.set(id, answer);
      return newAnswers;
    });
  };

  const loadAnswer = (answer: number) => {
    const answers = Object.entries(JSON.parse(loadable[answer].answer));
    const answerMap = new Map(answers.map(([key, value]) => [Number(key), value]));
    setAnswers(answerMap);
    setScoreId(loadable[answer].id);
  };

  useEffect(() => {
    if (pageIndex !== 0 || answers.size !== 0 || scoreId !== undefined) {
      return;
    }

    ScoreNetwork.fetchUnfinishedAnswer(survey)().then((res) => {
      if (res.length === 0) {
        return;
      }

      setLoadable(res);
      open();
    });
  }, []);

  useEffect(() => {
    if (answers.size === 0) {
      return;
    }

    ScoreNetwork.submitAnswer(survey, Object.fromEntries(answers), scoreId)().then((res) => {
      setScoreId(res);
    });
    notifications.show({ title: '保存成功', message: '当前的内容已保存', color: 'teal' });
  }, [pageIndex]);

  // 验证逻辑：当页面或答案变化时检查必填题
  useEffect(() => {
    if (!questions.questionList) {
      return;
    }

    const unanswered = checkNecessaryQuestions(answers, questions.questionList);

    setUnansweredQuestions(unanswered);
  }, [answers, questions.questionList, pageIndex]);

  // 处理页面切换，检查当前页面是否有未回答的必填题
  const handlePageChange = (newPageIndex: number) => {
    if (!questions.questionList) {
      setPageIndex(newPageIndex);
      return;
    }

    // 如果是最后一页（提交），检查所有页面的必填题
    if (newPageIndex >= (page.page?.total || 0)) {
      const unanswered = checkNecessaryQuestions(answers, questions.questionList);
      if (unanswered.length > 0) {
        // 找到第一个未回答的必填题
        const firstUnanswered = unanswered[0];

        notifications.show({
          title: '还有必填题未完成',
          message: `请先完成"${firstUnanswered.title}"再提交`,
          color: 'orange',
        });

        // 延迟滚动到问题
        setTimeout(() => {
          const questionElement = questionRefs.current[firstUnanswered.id];
          if (questionElement) {
            questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            questionElement.classList.add('highlight-unanswered');
            setTimeout(() => {
              questionElement.classList.remove('highlight-unanswered');
            }, 3000);
          }
        }, 300);

        return;
      }
      handleFinish();
      return;
    }

    // 检查当前页面的必填题
    const currentUnanswered = checkNecessaryQuestions(answers, visibleQuestions);

    if (currentUnanswered.length > 0) {
      const firstUnanswered = currentUnanswered[0];
      notifications.show({
        title: '当前页面还有必填题未完成',
        message: `请先完成"${firstUnanswered.title}"再进入下一页`,
        color: 'orange',
      });

      // 滚动到第一个未回答的问题
      setTimeout(() => {
        const questionElement = questionRefs.current[firstUnanswered.id];
        if (questionElement) {
          questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          questionElement.classList.add('highlight-unanswered');
          setTimeout(() => {
            questionElement.classList.remove('highlight-unanswered');
          }, 3000);
        }
      }, 100);

      return;
    }

    setPageIndex(newPageIndex);
  };

  const handleFinish = () => {
    if (scoreId === undefined) {
      return;
    }

    setLoading(true);

    ScoreNetwork.finishAnswer(scoreId)()
      .then(() => {
        notifications.show({ title: '提交成功', message: '您已经成功提交问卷', color: 'teal' });
        router.push(`/survey/${survey}/finished`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container w="80%">
      <LoadingOverlay visible={page.isLoading || questions.isLoading} />
      <LoadAnswerScreen
        opened={loadableOpened}
        records={loadable}
        onLoad={loadAnswer}
        onClose={close}
      />

      <Center>
        <SafeHTML content={page.page?.data.title || ''} />
      </Center>

      <Stack gap="xl">
        {visibleQuestions.map((question) => (
          <div
            key={question.id}
            ref={(el) => {
              if (el) {
                questionRefs.current[question.id] = el;
              }
            }}
            className={
              unansweredQuestions.some((q) => q.id === question.id) ? 'unanswered-question' : ''
            }
          >
            <Question
              question={question}
              value={answers.get(question.id) || ''}
              setValue={(answer) => updateAnswer(question.id, answer)}
            />
          </div>
        ))}
      </Stack>

      <Space h="lg" />
      <ButtonGroup>
        <Button onClick={() => setPageIndex(pageIndex - 1)} fullWidth disabled={pageIndex === 0}>
          上一页
        </Button>
        <Button
          onClick={() => handlePageChange(pageIndex + 1)}
          fullWidth
          color={pageIndex + 1 >= (page.page?.total || 0) ? 'green' : 'blue'}
          loading={loading}
        >
          {pageIndex + 1 >= (page.page?.total || 0) ? '提交' : '下一页'}
        </Button>
      </ButtonGroup>
    </Container>
  );
}
