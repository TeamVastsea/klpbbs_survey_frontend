'use client';

import {useParams, useRouter} from "next/navigation";
import {useState} from "react";
import {usePageByIndex} from "@/data/use-page";
import {useQuestionByPage} from "@/data/use-question";
import {Center, Container, Pagination, Space, Stack} from "@mantine/core";
import RichTextHTMLEditor from "@/components/RichTextHTMLEditor";
import {PageNetwork} from "@/network/page";
import QuestionEditor from "@/app/admin/survey/[id]/components/QuestionEditor";

export default function EditSurveyPage() {
  const router = useRouter();
  const params = useParams();
  const survey = JSON.parse(params.id as string || '0') as number;
  const [pageIndex, setPageIndex] = useState(0);
  const page = usePageByIndex(survey, pageIndex);
  const questions = useQuestionByPage(page.page?.data.id || 0);


  return (
    <div>
      <Container w="80%">
        <Space h={50}/>
        {page.page?.data.title &&
            <RichTextHTMLEditor content={page.page?.data.title} setContent={(content) => {
              if (page.page) {
                PageNetwork.savePage({
                  ...page.page.data,
                  title: content,
                })
              }
            }}/>
        }

        <Space h={20}/>
        <Stack gap="xl">
          {questions.questionList?.map((question) => (
            <QuestionEditor question={question} key={question.id} onSave={console.log}/>
          ))}
          <Center>
            <Pagination total={page.page?.total || 0} value={pageIndex + 1} onChange={(num) => setPageIndex(num - 1)}/>
          </Center>
        </Stack>
      </Container>
    </div>
  )

}
