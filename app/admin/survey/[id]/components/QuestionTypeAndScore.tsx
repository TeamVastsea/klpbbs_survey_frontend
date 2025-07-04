import { Group, Select, Input } from '@mantine/core';
import { useRef } from 'react';

const QUESTION_TYPES = [
  {label: '文本题', value: 'Text'},
  {label: '单选题', value: 'SingleChoice'},
  {label: '多选题', value: 'MultipleChoice'},
];

export default function QuestionTypeAndScore({type, setType, allPoints, setAllPoints, subPoints, setSubPoints}: any) {
  // 添加一个onSave属性
  const onSave = () => {
    // 这里不做任何操作，因为类型变化会直接触发组件重新渲染
    // 分数变化会在Input的onBlur中处理
  };
  
  // 使用ref记录上一次的值
  const prevAllPointsRef = useRef(allPoints);
  const prevSubPointsRef = useRef(subPoints);
  
  // 处理分数变化的onBlur事件
  const handleAllPointsBlur = () => {
    if (prevAllPointsRef.current !== allPoints) {
      prevAllPointsRef.current = allPoints;
      onSave();
    }
  };
  
  const handleSubPointsBlur = () => {
    if (prevSubPointsRef.current !== subPoints) {
      prevSubPointsRef.current = subPoints;
      onSave();
    }
  };
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
            onBlur={handleAllPointsBlur}
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
            onBlur={handleSubPointsBlur}
            min={0}
            step={1}
            style={{minWidth: 80}}
          />
        </div>
      )}
    </Group>
  );
}
