'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Center,
  Checkbox,
  Group,
  LoadingOverlay,
  Pagination,
  Space,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import AsyncPagedSelect from '@/app/admin/score/components/AsyncPagedSelect';
import { useSearchedScore } from '@/data/use-score';

export default function SurveyPage() {
  const [surveySearch, setSurveySearch] = useState<number | undefined>(undefined);
  const [unconfirmedOnly, setUnconfirmedOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const { answers, isLoading, isError } = useSearchedScore(
    page,
    20,
    surveySearch,
    undefined,
    unconfirmedOnly
  );
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('scorePageState');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setSurveySearch(state.surveySearch ?? undefined);
        setUnconfirmedOnly(state.unconfirmedOnly ?? false);
        setPage(state.page ?? 0);
      } catch {
        localStorage.removeItem('scorePageState');
      }
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    localStorage.setItem('scorePageState', JSON.stringify({ surveySearch, unconfirmedOnly, page }));
  }, [initialized, page, surveySearch, unconfirmedOnly]);

  return (
    <Center>
      <Stack w="90%">
        <Center>
          <Title>阅卷系统</Title>
        </Center>
        <Center h="100%">
          <Stack>
            <Stack>
              <Box pos="relative">
                <Group>
                  <Text>筛选问卷</Text>
                  <AsyncPagedSelect value={surveySearch} onChange={setSurveySearch} />
                  <Checkbox
                    checked={unconfirmedOnly}
                    onChange={(e) => setUnconfirmedOnly(e.currentTarget.checked)}
                    label="仅显示未确认的问卷"
                  />
                </Group>
              </Box>
              <Center>
                <Box pos="relative">
                  <Stack>
                    <Space h={10} />
                    <Table highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>提交ID</Table.Th>
                          <Table.Th>问卷ID</Table.Th>
                          <Table.Th>用户ID</Table.Th>
                          <Table.Th>提交时间</Table.Th>
                          <Table.Th>分数</Table.Th>
                          <Table.Th>问卷状态</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {answers === undefined ? (
                          <></>
                        ) : (
                          answers.data.map((element) => (
                            <Table.Tr
                              key={element.id}
                              onClick={() => router.push(`/admin/score/${element.id}`)}
                              style={{ cursor: 'pointer' }}
                            >
                              <Table.Td>{element.id}</Table.Td>
                              <Table.Td>{element.survey}</Table.Td>
                              <Table.Td>{element.user}</Table.Td>
                              <Table.Td>{element.update_time}</Table.Td>
                              <Table.Td>
                                {element.user_scores ?? 0}/{element.full_scores ?? 0}
                              </Table.Td>
                              <Table.Td>{element.completed ? '已确认' : '待确认'}</Table.Td>
                            </Table.Tr>
                          ))
                        )}
                      </Table.Tbody>
                    </Table>
                    <Center>
                      <Pagination
                        total={answers?.total ?? 1}
                        value={page + 1}
                        onChange={(e) => setPage(e - 1)}
                      />
                    </Center>
                    <Space h={10} />
                  </Stack>
                  <LoadingOverlay
                    visible={isLoading || isError}
                    zIndex={10}
                    overlayProps={{
                      radius: 'sm',
                      blur: 2,
                    }}
                  />
                </Box>
              </Center>
            </Stack>
          </Stack>
        </Center>
      </Stack>
    </Center>
  );
}
