import { Button, Group, Modal, Radio, Space, Stack } from '@mantine/core';
import React, { useState } from 'react';
import { ScorePrompt } from '@/api/ScoreApi';

export default function Submits(props: SubmitsProps) {
    const [use, serUse] = useState(0);

    return (
        <>
            <Modal
              opened={props.opened}
              onClose={() => {
                  props.onClose(false, props.submits[use]);
              }}
              title="检测到未完成的提交，是否加载？"
              centered
              closeOnEscape={false}
              closeOnClickOutside={false}
              withCloseButton={false}
            >
                <Space h={10} />
                <Radio.Group
                  value={use.toString()}
                  onChange={(value) => {
                      serUse(Number(value));
                  }}>
                    <Stack>
                        {props.submits.map((value, index) => (
                            <Radio
                              value={index.toString()}
                              label={`${index} - 最后修改：${value.update_time}`}
                              key={index} />
                            ))}
                    </Stack>
                </Radio.Group>
                <Space h={30} />
                <Group>
                    <Button
                      onClick={() => { props.onClose(true, props.submits[use]); }}
                    >
                        加载
                    </Button>
                    <Button
                      onClick={() => { props.onClose(false, props.submits[use]); }}
                    >
                        取消
                    </Button>
                </Group>
            </Modal>
        </>
    );
}

export interface SubmitsProps {
    submits: ScorePrompt[];
    opened: boolean;
    onClose: (load: boolean, use: ScorePrompt) => void;
}
