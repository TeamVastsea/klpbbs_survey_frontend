'use client';

import {ActionIcon, Badge, Button, Card, Group, Image, ScrollArea, Space, Text} from "@mantine/core";
import {Survey} from "@/model/survey";
import {IconSettings2} from "@tabler/icons-react";
import SafeHTML from "@/components/SafeHTML";
import SurveyCardEdit from "@/components/SurveyCardEdit";
import {useDisclosure} from "@mantine/hooks";

export default function SurveyCard(props: SurveyCardProps) {
  const [modalOpened, { open, close }] = useDisclosure(false);

  enum ValidResult {
    Valid,
    NoReSubmit,
    InValid,
  }

  const checkValid = () => {
    const startDate = Date.parse(props.survey.start_date);
    const endDate = Date.parse(props.survey.end_date);
    const now = Date.now();

    if (startDate > now || endDate < now) {
      return ValidResult.InValid;
    }
    if (!props.survey.allow_re_submit) {
      return ValidResult.NoReSubmit;
    }

    return ValidResult.Valid;
  };


  return (
    <Card withBorder w={292.5}>
      <Card.Section h={150}>
        <Image src={props.survey.image} alt={props.survey.title} h={150} w={292.5} />
      </Card.Section>

      <SurveyCardEdit opened={modalOpened} onClose={close} survey={props.survey} onAfterSave={props.onAfterSave} />

      {props.editable && (
        <ActionIcon
          onClick={open}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
          }}
          size="lg"
        >
          <IconSettings2 />
        </ActionIcon>
      )}

      <Space h="md" />

      <Group justify="space-between">
        <Text size="25px" fw={700}>
          {props.survey.title}
        </Text>

        <Group>
          {props.survey.badge === '          ' ? <></> : <Badge variant="light">{props.survey.badge}</Badge>}
          {checkValid() === ValidResult.InValid
            ? <Badge variant="light" color="red">已结束</Badge>
            : checkValid() === ValidResult.NoReSubmit
              ? <Badge variant="light" color="yellow">不可重复提交</Badge>
              : <Badge variant="light" color="blue">进行中</Badge>}
        </Group>
      </Group>

      <Space h="md" />

      <ScrollArea h={150}>
        <SafeHTML content={props.survey.description} />
      </ScrollArea>

      <Button
        fullWidth
        mt="md"
        radius="md"
        color={checkValid() === ValidResult.InValid ? 'red' : 'blue'}
        onClick={props.onEnter}
      >
        进入
      </Button>
    </Card>
  )
}

export interface SurveyCardProps {
  survey: Survey,
  editable: boolean,
  onEnter: () => void,
  onAfterSave?: () => void,
}
