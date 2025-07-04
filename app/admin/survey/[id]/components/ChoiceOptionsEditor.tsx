import { Button, Checkbox, Group, Input, Radio } from '@mantine/core';
import { useRef } from 'react';

export default function ChoiceOptionsEditor({type, values, setValues, answer, setAnswer, handleSave}: any) {
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
    // 添加选项后立即保存
    handleSave();
  };
  const handleRemoveOption = (idx: number) => {
    const idxStr = idx.toString();
    setValues(values.filter((_: any, i: number) => i !== idx));
    if (type === 'SingleChoice' && answer === idxStr) setAnswer('');
    if (type === 'MultipleChoice' && Array.isArray(answer)) setAnswer(answer.filter((a: string) => a !== idxStr));
    
    // 更新索引大于被删除选项的答案
    if (type === 'MultipleChoice' && Array.isArray(answer)) {
      setAnswer(answer.map((a: string) => {
        const aNum = parseInt(a);
        return aNum > idx ? (aNum - 1).toString() : a;
      }));
    } else if (type === 'SingleChoice' && answer !== '') {
      const answerNum = parseInt(answer);
      if (answerNum > idx) {
        setAnswer((answerNum - 1).toString());
      }
    }
    
    // 删除选项后立即保存
    handleSave();
  };
  const handleSetAnswer = (idx: number) => {
    const idxStr = idx.toString();
    if (type === 'SingleChoice') {
      setAnswer(idxStr);
      // 单选题选择后立即保存
      handleSave();
    }
    else if (type === 'MultipleChoice') {
      if (!Array.isArray(answer)) return;
      if (answer.includes(idxStr)) {
        setAnswer(answer.filter((a: string) => a !== idxStr));
      } else {
        setAnswer([...answer, idxStr]);
      }
      // 多选题选择后立即保存
      handleSave();
    }
  };
  return (
    <div>
      <Group justify="space-between" align="center" mb={8}>
        <div>选项：</div>
        <Button size="xs" color="gray" variant="outline" onClick={() => {
          setAnswer(type === 'MultipleChoice' ? [] : '');
          // 清空选择后立即保存
          handleSave();
        }}>
          清空选择
        </Button>
      </Group>
      {values.map((opt: any, idx: number) => (
        <div key={idx} style={{marginBottom: 16, paddingBottom: 12, borderBottom: idx !== values.length - 1 ? '1px solid #eee' : 'none'}}>
          <Group align="flex-start">
            {type === 'SingleChoice' ? (
              <Radio
                checked={answer === idx.toString()}
                onChange={() => handleSetAnswer(idx)}
                value={idx.toString()}
                style={{marginRight: 8, marginTop: 8}}
              />
            ) : (
              <Checkbox
                checked={Array.isArray(answer) && answer.includes(idx.toString())}
                onChange={() => handleSetAnswer(idx)}
                value={idx.toString()}
                style={{marginRight: 8, marginTop: 8}}
              />
            )}
            <div style={{flex: 1}}>
              <Input
                placeholder="选项标题"
                value={opt.title}
                onChange={e => handleOptionChange(idx, e.target.value)}
                onBlur={handleOptionBlur}
                style={{marginBottom: 4}}
              />
              <Input
                placeholder="选项内容"
                value={opt.content}
                onChange={e => handleContentChange(idx, e.target.value)}
                onBlur={handleOptionBlur}
              />
            </div>
            <Button color="red" size="xs" onClick={() => handleRemoveOption(idx)} style={{marginTop: 8}}>-</Button>
          </Group>
        </div>
      ))}
      <Button size="xs" onClick={handleAddOption} mt={4}>添加选项</Button>
    </div>
  );
}