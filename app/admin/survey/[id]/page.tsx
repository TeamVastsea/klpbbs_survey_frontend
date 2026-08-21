'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { IconGripVertical, IconTrash } from '@tabler/icons-react';
import {
  Button,
  Center,
  Container,
  Group,
  Pagination,
  Space,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import QuestionEditor from '@/app/admin/survey/[id]/components/QuestionEditor';
import RichTextHTMLEditor from '@/components/RichTextHTMLEditor';
import { usePageByIndex } from '@/data/use-page';
import { useQuestionByPage } from '@/data/use-question';
import { Question } from '@/model/question';
import { PageNetwork } from '@/network/page';
import { QuestionNetwork } from '@/network/question';
import classes from './components/DndQuestions.module.css';

export default function EditSurveyPage() {
  const params = useParams();
  const survey = JSON.parse((params.id as string) || '0') as number;
  const [pageIndex, setPageIndex] = useState(0);
  const page = usePageByIndex(survey, pageIndex);
  const questions = useQuestionByPage(page.page?.data.id);

  const refreshQuestions = () => questions.mutate(undefined, { revalidate: true });

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !questions.questionList) {
      return;
    }

    const { source, destination } = result;
    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    if (sourceIndex === destinationIndex) {
      return;
    }

    const pageId = page.page?.data.id || 0;
    // 立即更新本地数据，提供更好的用户体验
    if (questions.questionList) {
      const newQuestionList = [...questions.questionList];
      const [removed] = newQuestionList.splice(sourceIndex, 1);
      newQuestionList.splice(destinationIndex, 0, removed);

      // 先用本地数据更新UI
      questions.mutate(newQuestionList, false);

      try {
        await QuestionNetwork.swapQuestion(pageId, sourceIndex, destinationIndex)();
      } catch {
        await questions.mutate(undefined, { revalidate: true });
        notifications.show({ title: '排序失败', message: '问题顺序未保存', color: 'red' });
      }
    }
  };

  const addPage = async () => {
    try {
      await PageNetwork.newPage('新页面', survey, pageIndex);
      await page.mutate();
      setPageIndex(pageIndex + 1);
      notifications.show({ title: '创建成功', message: '已添加新页面', color: 'green' });
    } catch {
      notifications.show({ title: '创建失败', message: '无法添加页面', color: 'red' });
    }
  };

  const confirmDeletePage = () => {
    if (!page.page || page.page.total <= 1) {
      return;
    }

    const pageId = page.page.data.id;
    const pageTitle = page.page.data.title.replace(/<[^>]*>/g, '');
    modals.openConfirmModal({
      title: '删除页面',
      children: <Text size="sm">确定删除“{pageTitle}”吗？该页面内的所有问题都会永久删除。</Text>,
      labels: { confirm: '确认删除', cancel: '取消' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await PageNetwork.deletePage(pageId);
          const nextIndex = Math.min(pageIndex, page.page!.total - 2);
          if (nextIndex === pageIndex) {
            await page.mutate();
          } else {
            setPageIndex(nextIndex);
          }
          notifications.show({ title: '删除成功', message: '页面已删除', color: 'green' });
        } catch {
          notifications.show({ title: '删除失败', message: '无法删除页面', color: 'red' });
        }
      },
    });
  };

  const confirmDeleteQuestion = (question: Question) => {
    modals.openConfirmModal({
      title: '删除问题',
      children: <Text size="sm">确定删除“{question.content.title}”吗？此操作无法撤销。</Text>,
      labels: { confirm: '确认删除', cancel: '取消' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        const previousQuestions = questions.questionList;
        questions.mutate(
          previousQuestions?.filter((item) => item.id !== question.id),
          false
        );
        try {
          await QuestionNetwork.deleteQuestion(question.id);
          notifications.show({ title: '删除成功', message: '问题已删除', color: 'green' });
        } catch {
          await questions.mutate(previousQuestions, false);
          notifications.show({ title: '删除失败', message: '无法删除问题', color: 'red' });
        }
      },
    });
  };

  return (
    <div>
      <Container w="80%">
        <Space h={50} />
        {page.page && (
          <Stack>
            <RichTextHTMLEditor
              content={page.page.data.title}
              setContent={(content) => {
                if (page.page) {
                  PageNetwork.savePage({
                    ...page.page.data,
                    title: content,
                  }).then(() => {
                    // 刷新页面数据，强制重新验证
                    return page.mutate(undefined, { revalidate: true });
                  });
                }
              }}
            />
            <Group justify="flex-end">
              <Tooltip label={page.page.total <= 1 ? '问卷至少需要保留一个页面' : '删除当前页面'}>
                <div>
                  <Button
                    color="red"
                    variant="light"
                    leftSection={<IconTrash size={16} />}
                    onClick={confirmDeletePage}
                    disabled={page.page.total <= 1}
                  >
                    删除页面
                  </Button>
                </div>
              </Tooltip>
            </Group>
          </Stack>
        )}

        <Space h={20} />
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="questions-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {questions.questionList?.map((question, index) => (
                  <Draggable
                    key={`${question.id.toString()}-${index}`}
                    index={index}
                    draggableId={question.id.toString()}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${classes.item} ${snapshot.isDragging ? classes.itemDragging : ''}`}
                      >
                        <QuestionEditor
                          question={question}
                          key={`editor-${question.id}-${index}`}
                          dragHandle={
                            <div {...provided.dragHandleProps} className={classes.dragHandle}>
                              <IconGripVertical size={18} />
                            </div>
                          }
                          availableQuestions={
                            questions.questionList
                              ? questions.questionList
                                  .filter((q) => q.id !== question.id) // 排除当前问题
                                  .map((q) => ({
                                    id: q.id,
                                    title: q.content.title,
                                    type: q.type,
                                    values: q.values,
                                  }))
                              : []
                          }
                          onSave={(updatedQuestion) => {
                            // 使用本地更新优化用户体验
                            if (questions.questionList) {
                              const newQuestionList = [...questions.questionList];
                              const index = newQuestionList.findIndex(
                                (q) => q.id === updatedQuestion.id
                              );
                              if (index !== -1) {
                                newQuestionList[index] = updatedQuestion;
                                // 先用本地数据更新UI，不触发重新验证
                                questions.mutate(newQuestionList, false);
                              }
                            }

                            // 发送网络请求，但不强制刷新UI
                            QuestionNetwork.modifyQuestion(updatedQuestion)();
                          }}
                          onDelete={() => confirmDeleteQuestion(question)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Stack gap="xl">
          <Group grow>
            <Button
              onClick={() => {
                const newQuestion: Question = {
                  page: page.page?.data.id || 0,
                  id: 0,
                  content: { title: '新问题', content: '' },
                  type: 'Text',
                  values: [],
                  condition: undefined,
                  required: true,
                  answer: undefined,
                };
                QuestionNetwork.newQuestion(newQuestion)()
                  .then(() => refreshQuestions())
                  .catch(() => {
                    notifications.show({
                      title: '创建失败',
                      message: '无法添加问题',
                      color: 'red',
                    });
                  });
              }}
              disabled={!page.page?.data.id}
            >
              添加问题
            </Button>
            <Button variant="light" onClick={addPage} disabled={!page.page?.data.id}>
              添加页面
            </Button>
          </Group>
          <Center>
            <Pagination
              total={page.page?.total || 0}
              value={pageIndex + 1}
              onChange={(num) => setPageIndex(num - 1)}
            />
          </Center>
        </Stack>
      </Container>
    </div>
  );
}
