import { Question } from '@/model/question';
import { checkVisibility } from './visibility';

type Answers = Map<number, string> | Record<number, string>;
type Questions = Question[];

export interface UnansweredQuestion {
  id: number;
  title: string;
  reason: 'required' | 'visible';
}

/**
 * 检查必要的题目是否都已回答
 * @param answers 用户回答，可以是Map或普通对象
 * @param questions 问题列表
 * @returns 未回答的必要题目列表
 */
export function checkNecessaryQuestions(
  answers: Answers,
  questions: Questions
): UnansweredQuestion[] {
  // 将answers转换为统一格式(Map)
  const answersMap =
    answers instanceof Map
      ? answers
      : new Map(Object.entries(answers).map(([key, value]) => [Number(key), value]));

  // 计算问题可见性
  const visibility = checkVisibility(answers, questions);

  // 找出未回答的必要题目
  const unanswered: UnansweredQuestion[] = [];

  questions.forEach((question, index) => {
    // 检查问题是否可见
    const isVisible = visibility[index];

    // 如果问题不可见，跳过检查
    if (!isVisible) {
      return;
    }

    // 检查问题是否已回答
    const answer = answersMap.get(question.id);
    const isAnswered = answer !== undefined && answer !== '';

    // 如果问题可见但未回答，且是必填题，则记录
    if (!isAnswered && question.required) {
      unanswered.push({
        id: question.id,
        title: question.content.title,
        reason: 'required',
      });
    }
  });

  return unanswered;
}

/**
 * 检查是否所有必要的题目都已回答
 * @param answers 用户回答，可以是Map或普通对象
 * @param questions 问题列表
 * @returns 是否所有必要的题目都已回答
 */
export function areAllNecessaryQuestionsAnswered(answers: Answers, questions: Questions): boolean {
  const unanswered = checkNecessaryQuestions(answers, questions);
  return unanswered.length === 0;
}

/**
 * 获取所有可见但未回答的问题
 * @param answers 用户回答，可以是Map或普通对象
 * @param questions 问题列表
 * @returns 可见但未回答的问题列表
 */
export function getVisibleUnansweredQuestions(
  answers: Answers,
  questions: Questions
): UnansweredQuestion[] {
  // 将answers转换为统一格式(Map)
  const answersMap =
    answers instanceof Map
      ? answers
      : new Map(Object.entries(answers).map(([key, value]) => [Number(key), value]));

  // 计算问题可见性
  const visibility = checkVisibility(answers, questions);

  // 找出可见但未回答的问题
  const unanswered: UnansweredQuestion[] = [];

  questions.forEach((question, index) => {
    // 检查问题是否可见
    const isVisible = visibility[index];

    // 如果问题不可见，跳过检查
    if (!isVisible) {
      return;
    }

    // 检查问题是否已回答
    const answer = answersMap.get(question.id);
    const isAnswered = answer !== undefined && answer !== '';

    // 如果问题可见但未回答，则记录
    if (!isAnswered) {
      unanswered.push({
        id: question.id,
        title: question.content.title,
        reason: 'visible',
      });
    }
  });

  return unanswered;
}
