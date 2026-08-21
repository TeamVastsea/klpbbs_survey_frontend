'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IconCheck, IconInfoCircle, IconX } from '@tabler/icons-react';
import {
  Alert,
  Button,
  ButtonGroup,
  Center,
  Container,
  Group,
  LoadingOverlay,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Question from '@/components/Question/Question';
import SafeHTML from '@/components/SafeHTML';
import { usePageByIndex } from '@/data/use-page';
import { useQuestionByPage } from '@/data/use-question';
import { useScoreById } from '@/data/use-score';
import { ScoreNetwork } from '@/network/score';
import UserNetwork from '@/network/user';

export default function ScoreDetailPage() {
  const router = useRouter();
  const params = useParams();
  const scoreId = Number(params.id);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [judgeName, setJudgeName] = useState('');
  const score = useScoreById(scoreId);
  const page = usePageByIndex(score.score?.survey, pageIndex);
  const questions = useQuestionByPage(page.page?.data.id);

  const answers = useMemo(
    () =>
      new Map<number, string>(
        Object.entries(JSON.parse(score.score?.answer || '{}')).map(([key, value]) => [
          Number(key),
          String(value),
        ])
      ),
    [score.score?.answer]
  );
  const scores = useMemo(
    () =>
      new Map<number, number>(
        Object.entries(JSON.parse(score.score?.scores || '{}')).map(([key, value]) => [
          Number(key),
          Number(value),
        ])
      ),
    [score.score?.scores]
  );
  const confirmed = score.score?.judge !== undefined && score.score?.judge !== null;

  useEffect(() => {
    if (!score.score?.judge) {
      setJudgeName('');
      return;
    }

    UserNetwork.fetchUserById(score.score.judge)()
      .then((user) => setJudgeName(user.username))
      .catch(() => setJudgeName('未知用户'));
  }, [score.score?.judge]);

  const confirmScore = async () => {
    setLoading(true);
    try {
      await ScoreNetwork.confirmScore(scoreId);
      await score.mutate();
      notifications.show({ title: '确认成功', message: '阅卷结果已确认', color: 'green' });
    } catch {
      notifications.show({ title: '确认失败', message: '无法确认阅卷结果', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const rejudgeScore = async () => {
    setLoading(true);
    try {
      const result = await ScoreNetwork.rejudgeScore(scoreId);
      await score.mutate(result, { revalidate: false });
      notifications.show({ title: '重新判题成功', message: '分数已重新计算', color: 'green' });
    } catch {
      notifications.show({ title: '重新判题失败', message: '无法重新计算分数', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container w="80%">
      <LoadingOverlay
        visible={score.isLoading || page.isLoading || questions.isLoading || loading}
      />

      <Center mb="md">
        <Stack gap="xs">
          <Text size="sm" c="dimmed">
            选择题颜色说明
          </Text>
          <Group gap="md" justify="center">
            <ColorLegend color="rgba(255, 0, 0, 0.3)" label="用户选择但错误" />
            <ColorLegend color="rgba(0, 0, 255, 0.3)" label="用户选择且正确" />
            <ColorLegend color="rgba(0, 255, 0, 0.3)" label="用户未选择但正确" />
          </Group>
        </Stack>
      </Center>

      <Center mb="xl">
        <Alert
          variant="light"
          color={confirmed ? 'green' : 'blue'}
          title={
            <Group gap={5}>
              {confirmed ? <IconCheck /> : <IconInfoCircle />}
              <Text>当前提交状态</Text>
            </Group>
          }
          w={420}
        >
          <Stack gap={4}>
            <Text>提交 ID：{scoreId}</Text>
            <Text>
              用户得分：{score.score?.user_scores ?? 0} / {score.score?.full_scores ?? 0}
            </Text>
            <Group gap={4} c={confirmed ? 'green' : 'red'}>
              {confirmed ? <IconCheck size={16} /> : <IconX size={16} />}
              <Text>{confirmed ? '已确认' : '待确认'}</Text>
            </Group>
            <Text>
              阅卷人：{judgeName || '尚未确认'}
              {score.score?.judge ? `（UID: ${score.score.judge}）` : ''}
            </Text>
            <Text>判题时间：{score.score?.judge_time || '暂无'}</Text>
            <Text>
              填写用户：{' '}
              <Text
                component="a"
                href={`https://klpbbs.com/home.php?mod=space&uid=${score.score?.user || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                c="blue"
                td="underline"
              >
                {score.score?.user || '未知'}
              </Text>
            </Text>
          </Stack>
        </Alert>
      </Center>

      <Center>
        <SafeHTML content={page.page?.data.title || ''} />
      </Center>

      <Stack gap="xl">
        {questions.questionList?.map((question) => (
          <Question
            key={question.id}
            question={question}
            value={answers.get(question.id) || ''}
            setValue={() => {}}
            disabled
            showCorrectAnswer
            score={scores.get(question.id)}
          />
        ))}
      </Stack>

      <Space h="lg" />

      <Stack>
        <ButtonGroup>
          <Button onClick={() => setPageIndex(pageIndex - 1)} fullWidth disabled={pageIndex === 0}>
            上一页
          </Button>
          <Button
            onClick={() => setPageIndex(pageIndex + 1)}
            fullWidth
            disabled={pageIndex + 1 >= (page.page?.total || 0)}
          >
            下一页
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button onClick={confirmScore} fullWidth color="green" disabled={confirmed}>
            确认结果
          </Button>
          <Button onClick={rejudgeScore} fullWidth disabled={confirmed}>
            重新判题
          </Button>
          <Button onClick={() => router.push('/admin/score')} fullWidth>
            返回提交目录
          </Button>
        </ButtonGroup>
      </Stack>
    </Container>
  );
}

function ColorLegend({ color, label }: { color: string; label: string }) {
  return (
    <Group gap={5}>
      <div
        style={{ width: 16, height: 16, backgroundColor: color, border: `1px solid ${color}` }}
      />
      <Text size="sm">{label}</Text>
    </Group>
  );
}
