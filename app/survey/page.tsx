'use client';

import {useSurveyList} from "@/data/use-survey";
import {Center, Container, LoadingOverlay, SimpleGrid, Space, Stack, Text, Title} from "@mantine/core";
import SurveyCard from "@/components/SurveyCard";
import {useRouter} from "next/navigation";

const min = (a: number, b: number) => {
  return a > b ? b : a
};

export default function SurveyListPage() {
  const surveys = useSurveyList();
  const router = useRouter();

  return (
    <Container w="100%">
      <Stack>
        <Space h="lg"/>
        <Center>
          <Title>问卷列表</Title>
        </Center>
        <Center>
          <SimpleGrid
            cols={{
              base: 1,
              sm: min(2, surveys.surveyList?.length || 1),
              lg: min(3, surveys.surveyList?.length || 1),
            }}>
            {surveys.surveyList?.map((survey) => (
              <SurveyCard key={survey.id} survey={survey} editable={false} onEnter={() => router.push(`/survey/${survey.id}`)}/>
            ))}
          </SimpleGrid>
        </Center>
      </Stack>
      <LoadingOverlay visible={surveys.isLoading}/>
    </Container>
  )
}
