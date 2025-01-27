import {ActionIcon, Badge, Button, Card, Group, Image, ScrollArea, Space, Text} from "@mantine/core";
import Survey from "@/model/survey";
import {IconSettings2} from "@tabler/icons-react";
import SafeHTML from "@/components/SafeHTML";

export default function SurveyCard(props: SurveyCardProps) {
  return (
    <Card withBorder w={292.5}>
      <Card.Section h={150}>
        <Image src={props.survey.image} alt={props.survey.title} h={150} w={292.5} />
      </Card.Section>

      {props.editable && (
        <ActionIcon
          // onClick={handleEdit}
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
          {/*{getValidBadge()}*/}
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
        // color={checkValid() === ValidResult.InValid ? 'red' : 'blue'}
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
}
