import { Input, Textarea } from '@mantine/core';

export default function TitleAndContentEditor({title, setTitle, content, setContent, onBlur}: any) {
  return (
    <>
      <div>
        <div style={{marginBottom: 4}}>题目标题</div>
        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={onBlur}
        />
      </div>
      <div>
        <div style={{marginBottom: 4}}>题目描述</div>
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          onBlur={onBlur}
        />
      </div>
    </>
  );
} 