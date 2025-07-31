import { Condition, ConditionInner, Question } from '@/model/question';

type Answers = Map<number, string> | Record<number, string>;
type Questions = Question[];

/**
 * 检查问题是否应该显示
 * @param answers 用户回答，可以是Map或普通对象
 * @param questions 问题列表
 * @returns 布尔值数组，表示每个问题是否应该显示
 */
export function checkVisibility(answers: Answers, questions: Questions): boolean[] {
  // 将answers转换为统一格式(Map)
  const answersMap = answers instanceof Map ? answers : new Map(Object.entries(answers).map(([key, value]) => [Number(key), value]));
  
  // 返回每个问题的可见性
  return questions.map(question => {
    // 如果问题没有条件，则始终显示
    if (!question.condition || question.condition.length === 0) {
      return true;
    }
    
    // 检查所有条件组，任一条件组满足即可显示
    return question.condition.some(conditionGroup => {
      return evaluateConditionGroup(conditionGroup, answersMap, questions);
    });
  });
}

/**
 * 评估条件组
 * @param conditionGroup 条件组
 * @param answers 用户回答
 * @param questions 问题列表，用于获取问题类型
 * @returns 条件组是否满足
 */
function evaluateConditionGroup(conditionGroup: Condition, answers: Map<number, string>, questions: Questions): boolean {
  // 如果条件组内没有条件，则默认为true
  if (!conditionGroup.conditions || conditionGroup.conditions.length === 0) {
    return true;
  }
  
  // 根据条件组类型评估条件
  switch (conditionGroup.type) {
    case 'and':
      // 所有条件都必须满足
      return conditionGroup.conditions.every(condition => 
        evaluateCondition(condition, answers, questions)
      );
    case 'or':
      // 任一条件满足即可
      return conditionGroup.conditions.some(condition => 
        evaluateCondition(condition, answers, questions)
      );
    case 'not':
      // 所有条件都不满足
      return !conditionGroup.conditions.some(condition => 
        evaluateCondition(condition, answers, questions)
      );
    default:
      return false;
  }
}

/**
 * 评估单个条件
 * @param condition 条件
 * @param answers 用户回答
 * @param questions 问题列表，用于获取问题类型
 * @returns 条件是否满足
 */
function evaluateCondition(condition: ConditionInner, answers: Map<number, string>, questions: Questions): boolean {
  const { id, value } = condition;
  const answer = answers.get(id);
  
  // 如果条件值为"answered"，检查问题是否已回答
  if (value === 'answered') {
    return answer !== undefined && answer !== '';
  }
  
  // 如果条件值为"unanswered"，检查问题是否未回答
  if (value === 'unanswered') {
    return answer === undefined || answer === '';
  }
  
  // 如果没有答案，条件不满足
  if (answer === undefined || answer === '') {
    return false;
  }
  
  // 获取问题类型
  const question = questions.find(q => q.id === id);
  if (!question) {
    return false;
  }
  
  // 根据问题类型评估条件
  switch (question.type) {
    case 'SingleChoice':
      // 单选题：检查选择的选项是否匹配
      return answer === value;
    case 'MultipleChoice':
      // 多选题：检查选择的选项是否包含条件值
      try {
        const selectedOptions = JSON.parse(answer);
        if (Array.isArray(selectedOptions)) {
          // 如果条件值是数组，检查是否有交集
          if (Array.isArray(value)) {
            return value.some(v => selectedOptions.includes(v));
          }
          // 如果条件值是单个值，检查是否包含
          return selectedOptions.includes(value);
        }
      } catch (e) {
        // 解析错误，条件不满足
        return false;
      }
      return false;
    case 'Text':
      // 文本题：检查文本是否匹配
      return answer === value;
    default:
      return false;
  }
}