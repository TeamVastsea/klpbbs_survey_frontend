'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconSearch } from '@tabler/icons-react';
import {
  Center,
  Container,
  LoadingOverlay,
  Pagination,
  SimpleGrid,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import SurveyCard from '@/components/SurveyCard';
import { useSurveyList } from '@/data/use-survey';

const min = (a: number, b: number) => {
  return a > b ? b : a;
};

export default function SurveyListPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);

  const surveys = useSurveyList(page, 10, debouncedSearch);
  const router = useRouter();

  return (
    <Container w="100%">
      <Stack>
        <Space h="lg" />
        <Center>
          <Title>问卷列表</Title>
        </Center>
        <TextInput
          value={search}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            setPage(0);
          }}
          leftSection={<IconSearch size={16} />}
          placeholder="搜索问卷标题"
          aria-label="搜索问卷标题"
          maw={500}
          w="100%"
          mx="auto"
        />
        <Center>
          {surveys.surveyList?.length === 0 ? (
            <Text c="dimmed">没有找到问卷</Text>
          ) : (
            <SimpleGrid
              cols={{
                base: 1,
                sm: min(2, surveys.surveyList?.length || 1),
                lg: min(3, surveys.surveyList?.length || 1),
              }}
            >
              {surveys.surveyList?.map((survey) => (
                <SurveyCard
                  key={survey.id}
                  survey={survey}
                  editable={false}
                  onEnter={() => router.push(`/survey/${survey.id}`)}
                />
              ))}
            </SimpleGrid>
          )}
        </Center>
        <Space h="md" />
        <Center>
          <Pagination
            total={page + (surveys.hasNextPage ? 2 : 1)}
            value={page + 1}
            onChange={(value) => setPage(value - 1)}
            hideWithOnePage
          />
        </Center>
      </Stack>
      <LoadingOverlay visible={surveys.isLoading} />
    </Container>
  );
}
