# 问卷显示条件验证工具

## 概述

本工具提供了一个函数 `checkVisibility`，用于根据用户的回答和问题列表判断每个问题是否应该显示。

## 使用方法

```typescript
import { checkVisibility } from '@/app/survey/utils/visibility';

// 用户回答（可以是Map或普通对象）
const answers = new Map<number, string>();
answers.set(1, '用户回答'); // 问题1的回答
answers.set(2, '0');        // 问题2选择了第一个选项

// 或者使用对象形式
const answersObj = {
  1: '用户回答',
  2: '0'
};

// 问题列表
const questions = [...]; // 从API获取的问题列表

// 检查每个问题是否应该显示
const visibility = checkVisibility(answers, questions);

// 在渲染问题时使用visibility数组
questions.forEach((question, index) => {
  if (visibility[index]) {
    // 显示问题
    renderQuestion(question);
  }
});
```

## 在问卷页面中的集成示例

```tsx
// 在Survey组件中
import { checkVisibility } from '@/app/survey/utils/visibility';

export default function Survey() {
  const [answers, setAnswers] = useState(new Map());
  const questions = useQuestionByPage(page.page?.data.id || 0);
  
  // 计算问题可见性
  const visibility = useMemo(() => {
    if (!questions.questionList) return [];
    return checkVisibility(answers, questions.questionList);
  }, [answers, questions.questionList]);
  
  // 更新回答
  const updateAnswer = (id: number, answer: string) => {
    setAnswers((prevAnswers) => {
      const newAnswers = new Map(prevAnswers);
      newAnswers.set(id, answer);
      return newAnswers;
    });
  };
  
  return (
    <Stack gap="xl">
      {questions.questionList?.map((question, index) => (
        // 只渲染应该显示的问题
        visibility[index] && (
          <Question
            question={question}
            key={question.id}
            value={answers.get(question.id) || ''}
            setValue={(answer) => updateAnswer(question.id, answer)}
          />
        )
      ))}
    </Stack>
  );
}
```

## 条件类型

函数支持以下类型的条件：

1. **已回答/未回答**：检查问题是否已回答或未回答
   ```typescript
   { id: 1, value: 'answered' }   // 问题1已回答
   { id: 1, value: 'unanswered' } // 问题1未回答
   ```

2. **单选题**：检查选择的选项是否匹配
   ```typescript
   { id: 2, value: '0' } // 问题2选择了第一个选项
   ```

3. **多选题**：检查选择的选项是否包含条件值
   ```typescript
   { id: 3, value: '0' } // 问题3选择了第一个选项
   ```

4. **文本题**：检查文本是否匹配
   ```typescript
   { id: 4, value: '特定文本' } // 问题4的回答是"特定文本"
   ```

## 条件组合

条件可以通过以下逻辑组合：

1. **AND**：所有条件都必须满足
   ```typescript
   {
     type: 'and',
     conditions: [{ id: 1, value: 'answered' }, { id: 2, value: '0' }]
   }
   ```

2. **OR**：任一条件满足即可
   ```typescript
   {
     type: 'or',
     conditions: [{ id: 3, value: '0' }, { id: 3, value: '1' }]
   }
   ```

3. **NOT**：所有条件都不满足
   ```typescript
   {
     type: 'not',
     conditions: [{ id: 2, value: '0' }]
   }
   ```

多个条件组之间是OR关系，即任一条件组满足即可显示问题。