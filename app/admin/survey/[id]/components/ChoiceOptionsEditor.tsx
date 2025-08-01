import { useRef } from 'react';
import { Button, Checkbox, Group, Input, Radio } from '@mantine/core';

interface ChoiceOption {
  title: string;
  content: string;
}

export default function ChoiceOptionsEditor({
  type,
  values,
  setValues,
  answer,
  setAnswer,
  handleSave,
}: any) {
  // 使用ref记录上一次的值，避免不必要的onBlur触发
  const prevValuesRef = useRef(JSON.stringify(values));
  // 选项操作
  const handleOptionChange = (idx: number, value: string) => {
    const newValues = [...values];
    newValues[idx] = { ...newValues[idx], title: value };
    setValues(newValues);
  };

  // 只有当值发生变化时才触发onBlur
  const handleOptionBlur = () => {
    const currentValues = JSON.stringify(values);
    if (prevValuesRef.current !== currentValues) {
      prevValuesRef.current = currentValues;
      handleSave();
    }
  };
  const handleContentChange = (idx: number, value: string) => {
    const newValues = [...values];
    newValues[idx] = { ...newValues[idx], content: value };
    setValues(newValues);
  };
  const handleAddOption = () => {
    setValues([...values, { title: '', content: '' }]);
    handleSave();
  };
  const handleRemoveOption = (idx: number) => {
    const idxStr = idx.toString();

    // 过滤掉被删除的选项
    setValues(values.filter((_: ChoiceOption, i: number) => i !== idx));

    // 更新答案索引
    const updateAnswerIndex = (answerValue: string) => {
      const answerNum = parseInt(answerValue, 10);
      return answerNum > idx ? (answerNum - 1).toString() : answerValue;
    };

    // 处理单选答案
    if (type === 'SingleChoice') {
      if (typeof answer === 'string') {
        if (answer === idxStr) {
          setAnswer('');
        } else {
          setAnswer(updateAnswerIndex(answer));
        }
      }
    }
    // 处理多选答案
    else if (type === 'MultipleChoice' && Array.isArray(answer)) {
      // 移除被删除选项的答案并更新索引
      const updatedAnswer = answer.filter((a: string) => a !== idxStr).map(updateAnswerIndex);
      setAnswer(updatedAnswer);
    }

    handleSave();
  };
  const handleSetAnswer = (idx: number) => {
    const idxStr = idx.toString();

    if (type === 'SingleChoice') {
      setAnswer(idxStr);
    } else if (type === 'MultipleChoice') {
      const currentAnswer = Array.isArray(answer) ? answer : [];

      if (currentAnswer.includes(idxStr)) {
        setAnswer(currentAnswer.filter((a: string) => a !== idxStr));
      } else {
        setAnswer([...currentAnswer, idxStr]);
      }
      // 多选题选择后立即保存
      handleSave();
    }
  };
  return (
    <div>
      <Group justify="space-between" align="center" mb={8}>
        <div>选项：</div>
        <Button
          size="xs"
          color="gray"
          variant="outline"
          onClick={() => {
            setAnswer(type === 'MultipleChoice' ? [] : '');
            handleSave();
          }}
        >
          清空选择
        </Button>
      </Group>
      {values.map((opt: ChoiceOption, idx: number) => (
        <div
          key={idx}
          style={{
            marginBottom: 16,
            paddingBottom: 12,
            borderBottom: idx !== values.length - 1 ? '1px solid #eee' : 'none',
          }}
        >
          <Group align="flex-start">
            {type === 'SingleChoice' ? (
              <Radio
                checked={answer === idx.toString()}
                onChange={() => handleSetAnswer(idx)}
                value={idx.toString()}
                style={{ marginRight: 8, marginTop: 8 }}
              />
            ) : (
              <Checkbox
                checked={Array.isArray(answer) && answer.includes(idx.toString())}
                onChange={() => handleSetAnswer(idx)}
                value={idx.toString()}
                style={{ marginRight: 8, marginTop: 8 }}
              />
            )}
            <div style={{ flex: 1 }}>
              <Input
                placeholder="选项标题"
                value={opt.title}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                onBlur={handleOptionBlur}
                style={{ marginBottom: 4 }}
              />
              <Input
                placeholder="选项内容"
                value={opt.content}
                onChange={(e) => handleContentChange(idx, e.target.value)}
                onBlur={handleOptionBlur}
              />
            </div>
            <Button
              color="red"
              size="xs"
              onClick={() => handleRemoveOption(idx)}
              style={{ marginTop: 8 }}
            >
              -
            </Button>
          </Group>
        </div>
      ))}
      <Button size="xs" onClick={handleAddOption} mt={4}>
        添加选项
      </Button>
    </div>
  );
}
