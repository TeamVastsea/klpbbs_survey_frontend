'use client';

import {Card, Center, Container, SimpleGrid, Space, Stack, Title} from "@mantine/core";
import SurveyCard from "@/components/SurveyCard";
import {useSurveyList} from "@/data/use-survey";
import {useRouter} from "next/navigation";
import {IconFilePlus} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import SurveyCardEdit from "@/components/SurveyCardEdit";

const min = (a: number, b: number) => {
  return a > b ? b : a
};

export default function EditSurveyPage() {
  const surveys = useSurveyList();
  const router = useRouter();
  const [newModalOpened, {open, close}] = useDisclosure(false);

  return (
    <Container>

      <Space h={50}/>
      <Center>
        <Title order={1}>编辑问卷</Title>
      </Center>

      <Space h={20}/>

      <Center>
        <SimpleGrid
          cols={{
            base: 1,
            sm: min(2, (surveys.surveyList?.length || 0) + 1),
            lg: min(3, (surveys.surveyList?.length || 0) + 1),
          }}>
          {surveys.surveyList?.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} onEnter={() => router.push(`/admin/survey/${survey.id}`)}
                        editable onAfterSave={surveys.mutate}/>
          ))}

          <Card withBorder onClick={open} style={{cursor: "pointer"}}>
            <Center h="100%">
              <Stack>
                <Title order={2}>新建问卷</Title>
                <Center>
                  <IconFilePlus size={50}/>
                </Center>
              </Stack>
              <SurveyCardEdit opened={newModalOpened} onClose={close} survey={{
                id: 0, title: "", badge: "", description: "", image: "https://placehold.co/600x400",
                start_date: new Date().toUTCString(), end_date: new Date().toUTCString(), allow_submit: true,
                allow_view: true, allow_judge: true, allow_re_submit: false
              }} onAfterSave={surveys.mutate}/>
            </Center>
          </Card>
        </SimpleGrid>
      </Center>

    </Container>
  );
}
