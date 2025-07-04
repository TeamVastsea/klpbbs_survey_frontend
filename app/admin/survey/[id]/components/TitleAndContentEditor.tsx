import { Input, Textarea } from '@mantine/core';
import { useRef } from 'react';

export default function TitleAndContentEditor({title, setTitle, content, setContent, onBlur}: any) {
  // 使用ref记录上一次的值，避免不必要的onBlur触发
  const prevTitleRef = useRef(title);
  const prevContentRef = useRef(content);
  
  // 只有当值发生变化时才触发onBlur
  const handleTitleBlur = () => {
    if (prevTitleRef.current !== title) {
      prevTitleRef.current = title;
      onBlur();
    }
  };
  
  const handleContentBlur = () => {
    if (prevContentRef.current !== content) {
      prevContentRef.current = content;
      onBlur();
    }
  };
  
  return (
    <>
      <div>
        <div style={{marginBottom: 4}}>题目标题</div>
        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
        />
      </div>
      <div>
        <div style={{marginBottom: 4}}>题目描述</div>
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          onBlur={handleContentBlur}
        />
      </div>
    </>
  );
}