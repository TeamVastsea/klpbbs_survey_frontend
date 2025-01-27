import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

export default function SafeHTML(props: SafeHTMLProps) {
  const [sanitised, setSanitised] = useState('<div>正在处理html...</div>');

  useEffect(() => {
    setSanitised(DOMPurify.sanitize(props.content));
  }, [props.content]);
  return (
    <div dangerouslySetInnerHTML={{ __html: sanitised }} />
  );
}

export interface SafeHTMLProps {
  content: string;
}
