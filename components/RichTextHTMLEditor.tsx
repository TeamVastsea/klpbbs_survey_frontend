'use client';

import { useEffect, useState } from 'react';
import { IconEdit } from '@tabler/icons-react';
import Highlight from '@tiptap/extension-highlight';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button, Modal, Stack, Textarea } from '@mantine/core';
import { useDisclosure, useFocusWithin } from '@mantine/hooks';
import { Link, RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';

export default function RichTextHTMLEditor(props: RichTextHTMLEditorProps) {
  const save = () => {
    if (editor?.getHTML()) {
      props.setContent(editor?.getHTML());
    }
  };

  const { ref } = useFocusWithin({ onBlur: save });
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
  });

  useEffect(() => {
    editor?.commands.setContent(props.content);
  }, [props.content, editor]);

  return (
    <RichTextEditor editor={editor} content={props.content} ref={ref}>
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.Highlight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <EditHtmlControl onSave={save} />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}

function EditHtmlControl({ onSave }: { onSave: () => void }) {
  const { editor } = useRichTextEditorContext();
  const [content, setContent] = useState<string>('');
  const [opened, { open, close }] = useDisclosure(false);

  function onEdit() {
    editor?.setEditable(false);
    setContent(editor?.getHTML() || '');
    open();
  }

  function saveEdit() {
    close();
    editor?.commands.setContent(content);
    editor?.setEditable(true);
    onSave();
  }

  return (
    <>
      <RichTextEditor.Control onClick={onEdit}>
        <IconEdit stroke={1.5} size="1rem" />
      </RichTextEditor.Control>
      <Modal
        title="编辑HTML"
        opened={opened}
        onClose={() => {
          editor?.setEditable(true);
          close();
        }}
        centered
        withCloseButton={false}
      >
        <Stack>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            resize="vertical"
            mt="mt"
          />
          <Button onClick={saveEdit}>保存</Button>
        </Stack>
      </Modal>
    </>
  );
}

export interface RichTextHTMLEditorProps {
  content: string;
  setContent: (content: string) => void;
}
