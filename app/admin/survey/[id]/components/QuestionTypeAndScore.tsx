import { Group, Select, Input } from '@mantine/core';

const QUESTION_TYPES = [
  {label: '文本题', value: 'Text'},
  {label: '单选题', value: 'SingleChoice'},
  {label: '多选题', value: 'MultipleChoice'},
];

export default function QuestionTypeAndScore({type, setType, allPoints, setAllPoints, subPoints, setSubPoints}: any) {
  return (
    <Group align="end" mb={0} gap={16}>
      <div>
        <div style={{marginBottom: 4}}>题目类型</div>
        <Select
          data={QUESTION_TYPES}
          value={type}
          onChange={setType}
          style={{maxWidth: 120, minWidth: 100}}
        />
      </div>
      {(type === 'SingleChoice' || type === 'MultipleChoice') && (
        <div style={{minWidth: 90}}>
          <div style={{marginBottom: 4}}>满分</div>
          <Input
            type="number"
            value={allPoints}
            onChange={e => setAllPoints(e.target.value)}
            min={0}
            step={1}
            style={{minWidth: 80}}
          />
        </div>
      )}
      {type === 'MultipleChoice' && (
        <div style={{minWidth: 90}}>
          <div style={{marginBottom: 4}}>半分</div>
          <Input
            type="number"
            value={subPoints}
            onChange={e => setSubPoints(e.target.value)}
            min={0}
            step={1}
            style={{minWidth: 80}}
          />
        </div>
      )}
    </Group>
  );
}
