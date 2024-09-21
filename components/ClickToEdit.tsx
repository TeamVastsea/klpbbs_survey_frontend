'use client';

import { Link, RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { useDisclosure, useFocusWithin } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import { useState } from 'react';
import { Button, Modal, Stack, Textarea } from '@mantine/core';

function EditHtmlControl() {
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
    }

    return (
        <>
            <RichTextEditor.Control
              onClick={onEdit}
            >
                <IconEdit stroke={1.5} size="1rem" />
            </RichTextEditor.Control>
            <Modal title="编辑HTML" opened={opened} onClose={() => { editor?.setEditable(true); close(); }} centered withCloseButton={false}>
                <Stack>
                    <Textarea value={content} onChange={(e) => setContent(e.target.value)} resize="vertical" mt="mt" />
                    <Button onClick={saveEdit}>保存</Button>
                </Stack>
            </Modal>
        </>
    );
}

export default function ClickToEdit(props: ClickToEditProps) {
    const { ref, focused } = useFocusWithin({ onBlur: save });
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
        content: props.content,
    });

    function save() {
        if (editor == null) {
            return;
        }
        props.onSave(editor.getHTML());
    }

    function shouldShowBar() {
        return props.alwaysShowBar || focused;
    }

    return (
        <>
            <RichTextEditor editor={editor} w={props.w} ref={ref}>
                {shouldShowBar() && (
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
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                        </RichTextEditor.ControlsGroup>

                        {props.alwaysShowBar && (
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Link />
                                <RichTextEditor.Unlink />
                            </RichTextEditor.ControlsGroup>
                        )}

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
                            <EditHtmlControl />
                        </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>
                )}
                <RichTextEditor.Content />
            </RichTextEditor>
        </>
    );
}

export interface ClickToEditProps {
    content: string;
    onSave: (content: string) => void;
    w?: number;
    alwaysShowBar?: boolean;
}
