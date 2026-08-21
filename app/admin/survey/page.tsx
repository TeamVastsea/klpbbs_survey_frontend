'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconFilePlus, IconSearch } from '@tabler/icons-react';
import {
  Card,
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
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import SurveyCard from '@/components/SurveyCard';
import SurveyCardEdit from '@/components/SurveyCardEdit';
import { useSurveyList } from '@/data/use-survey';
import SurveyNetwork from '@/network/survey';

const min = (a: number, b: number) => {
  return a > b ? b : a;
};

export default function EditSurveyPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const surveys = useSurveyList(page, 20, debouncedSearch);
  const router = useRouter();
  const [newModalOpened, { open, close }] = useDisclosure(false);

  const confirmDeleteSurvey = (id: number, title: string) => {
    modals.openConfirmModal({
      title: '删除问卷',
      children: (
        <Text size="sm">确定删除“{title}”吗？该问卷的所有页面、问题和已提交答卷都会永久删除。</Text>
      ),
      labels: { confirm: '确认删除', cancel: '取消' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await SurveyNetwork.deleteSurvey(id);
          await surveys.mutate();
          if (surveys.surveyList?.length === 1 && page > 0) {
            setPage(page - 1);
          }
          notifications.show({ title: '删除成功', message: '问卷已删除', color: 'green' });
        } catch {
          notifications.show({ title: '删除失败', message: '无法删除问卷', color: 'red' });
        }
      },
    });
  };

  return (
    <Container>
      <Space h={50} />
      <Center>
        <Title order={1}>编辑问卷</Title>
      </Center>

      <Space h={20} />

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
        mx="auto"
      />

      <Space h={20} />

      <Center>
        <SimpleGrid
          cols={{
            base: 1,
            sm: min(2, (surveys.surveyList?.length || 0) + 1),
            lg: min(3, (surveys.surveyList?.length || 0) + 1),
          }}
        >
          {surveys.surveyList?.map((survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              onEnter={() => router.push(`/admin/survey/${survey.id}`)}
              editable
              onAfterSave={surveys.mutate}
              onDelete={() => confirmDeleteSurvey(survey.id, survey.title)}
            />
          ))}

          <Card withBorder onClick={open} style={{ cursor: 'pointer' }}>
            <Center h="100%">
              <Stack>
                <Title order={2}>新建问卷</Title>
                <Center>
                  <IconFilePlus size={50} />
                </Center>
              </Stack>
              <SurveyCardEdit
                opened={newModalOpened}
                onClose={close}
                survey={{
                  id: 0,
                  title: '',
                  badge: '',
                  description: '',
                  image: 'https://placehold.co/600x400',
                  start_date: new Date().toUTCString(),
                  end_date: new Date().toUTCString(),
                  allow_submit: true,
                  allow_view: true,
                  allow_judge: true,
                  allow_re_submit: false,
                }}
                onAfterSave={surveys.mutate}
              />
            </Center>
          </Card>
        </SimpleGrid>
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
      <LoadingOverlay visible={surveys.isLoading} />
    </Container>
  );
}
