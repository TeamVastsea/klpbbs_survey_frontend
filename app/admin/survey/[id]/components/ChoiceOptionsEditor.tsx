import { Button, Checkbox, Group, Input, Radio } from '@mantine/core';

export default function ChoiceOptionsEditor({type, values, setValues, answer, setAnswer, handleSave}: any) {
  // 选项操作
  const handleOptionChange = (idx: number, value: string) => {
    const newValues = [...values];
    newValues[idx] = { ...newValues[idx], title: value };
    setValues(newValues);
  };
  const handleContentChange = (idx: number, value: string) => {
    const newValues = [...values];
    newValues[idx] = { ...newValues[idx], content: value };
    setValues(newValues);
  };
  const handleAddOption = () => {
    setValues([...values, { title: '', content: '' }]);
  };
  const handleRemoveOption = (idx: number) => {
    const removed = values[idx]?.title;
    setValues(values.filter((_: any, i: number) => i !== idx));
    if (type === 'SingleChoice' && answer === removed) setAnswer('');
    if (type === 'MultipleChoice' && Array.isArray(answer)) setAnswer(answer.filter((a: string) => a !== removed));
  };
  const handleSetAnswer = (idx: number) => {
    const opt = values[idx]?.title;
    if (!opt) return;
    if (type === 'SingleChoice') setAnswer(opt);
    else if (type === 'MultipleChoice') {
      if (!Array.isArray(answer)) return;
      if (answer.includes(opt)) setAnswer(answer.filter((a: string) => a !== opt));
      else setAnswer([...answer, opt]);
    }
  };
  return (
    <div>
      <Group justify="space-between" align="center" mb={8}>
        <div>选项：</div>
        <Button size="xs" color="gray" variant="outline" onClick={() => setAnswer(type === 'MultipleChoice' ? [] : '')}>
          清空选择
        </Button>
      </Group>
      {values.map((opt: any, idx: number) => (
        <div key={idx} style={{marginBottom: 16, paddingBottom: 12, borderBottom: idx !== values.length - 1 ? '1px solid #eee' : 'none'}}>
          <Group align="flex-start">
            {type === 'SingleChoice' ? (
              <Radio
                checked={answer === opt.title}
                onChange={() => handleSetAnswer(idx)}
                value={opt.title}
                style={{marginRight: 8, marginTop: 8}}
              />
            ) : (
              <Checkbox
                checked={Array.isArray(answer) && answer.includes(opt.title)}
                onChange={() => handleSetAnswer(idx)}
                value={opt.title}
                style={{marginRight: 8, marginTop: 8}}
              />
            )}
            <div style={{flex: 1}}>
              <Input
                placeholder="选项标题"
                value={opt.title}
                onChange={e => handleOptionChange(idx, e.target.value)}
                onBlur={handleSave}
                style={{marginBottom: 4}}
              />
              <Input
                placeholder="选项内容"
                value={opt.content}
                onChange={e => handleContentChange(idx, e.target.value)}
                onBlur={handleSave}
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