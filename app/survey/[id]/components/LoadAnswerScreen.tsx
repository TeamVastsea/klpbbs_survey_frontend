import {useState} from "react";
import {Button, Group, Modal, Radio, Stack} from "@mantine/core";

export default function LoadAnswerScreen(props: LoadAnswerScreenProps) {
  const [use, setUse] = useState("");

  return (
    <>
      <Modal opened={props.opened} onClose={props.onClose} title="检测到未提交的答卷，是否加载？">
        <Stack>
          <Radio.Group value={use} onChange={setUse}>
            {props.records.map((answer, index) => (
              <Radio key={answer.id} value={index.toString()} label={`${index} - 最后修改${answer.update_time}`}/>
            ))}
          </Radio.Group>
          <Group grow>
            <Button onClick={props.onClose} variant="light">取消</Button>
            <Button onClick={() => {
              if (use === "") {
                props.onClose();
                return;
              }

              props.onLoad(Number(use));
              props.onClose();
            }}>加载</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}

export interface LoadAnswerScreenProps {
  opened: boolean;
  records: {id: number, answer: string, update_time: string}[];
  onLoad: (id: number) => void;
  onClose: () => void;
}
