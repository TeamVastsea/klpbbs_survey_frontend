'use client';

import {Badge, Button, Card, Group, Image, Modal, ScrollArea, Space, Switch, TextInput} from "@mantine/core";
import {Survey} from "@/model/survey";
import {useEffect, useState} from "react";
import {DateTimePicker} from "@mantine/dates";
import RichTextHTMLEditor from "@/components/RichTextHTMLEditor";
import SurveyNetwork from "@/network/survey";
import {notifications} from "@mantine/notifications";

export default function SurveyCardEdit(props: SurveyCardEditProps) {
  const [title, setTitle] = useState(props.survey.title);
  const [description, setDescription] = useState(props.survey.description);
  const [image, setImage] = useState(props.survey.image);
  const [badge, setBadge] = useState(props.survey.badge);
  const [startTime, setStartTime] = useState(new Date(props.survey.start_date));
  const [endTime, setEndTime] = useState(new Date(props.survey.end_date));
  const [allowSubmit, setAllowSubmit] = useState(props.survey.allow_submit);
  const [allowView, setAllowView] = useState(props.survey.allow_view);
  const [allowJudge, setAllowJudge] = useState(props.survey.allow_judge);
  const [allowReSubmit, setAllowReSubmit] = useState(props.survey.allow_re_submit);

  useEffect(() => {
    setTitle(props.survey.title);
    setDescription(props.survey.description);
    setImage(props.survey.image);
    setBadge(props.survey.badge);
    setStartTime(new Date(props.survey.start_date));
    setEndTime(new Date(props.survey.end_date));
    setAllowSubmit(props.survey.allow_submit);
    setAllowView(props.survey.allow_view);
    setAllowJudge(props.survey.allow_judge);
    setAllowReSubmit(props.survey.allow_re_submit);
  }, [props.opened]);

  const save = () => {
    SurveyNetwork.saveSurvey({
      allow_judge: allowJudge,
      allow_re_submit: allowReSubmit,
      allow_submit: allowSubmit,
      allow_view: allowView,
      badge,
      description,
      end_date: endTime.toISOString(),
      id: props.survey.id,
      image,
      start_date: startTime.toISOString(),
      title,
    }, props.survey.id === 0)
      .then(() => {
        notifications.show({
          title: '保存成功',
          message: '问卷已保存',
          color: 'teal',
        });
        if (props.onAfterSave) {
          props.onAfterSave();
        }
      })
  }

  return (
    <Modal opened={props.opened} onClose={() => {
      setTimeout(props.onClose, 0);
    }} mah="70%" title={`编辑问卷 ${props.survey.title}`} withCloseButton={false} centered>
      <ScrollArea>
        <Card withBorder radius="md">
          <Card.Section withBorder inheritPadding py="xs">
            <TextInput
              label="标题"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </Card.Section>
          <Card.Section withBorder inheritPadding py="xs">
            <RichTextHTMLEditor content={description} setContent={setDescription}/>
          </Card.Section>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between" align="center">
              <TextInput
                label="图章"
                value={badge}
                onChange={(e) => setBadge(e.currentTarget.value)}
              />
              {badge.trim() !== '' && <Badge>{badge}</Badge>}
            </Group>
          </Card.Section>
          <Card.Section withBorder inheritPadding py="xs">
            <TextInput
              label="图片url"
              value={image}
              onChange={(e) => setImage(e.currentTarget.value)}
            />
            <Space h={20}/>
            <Image src={image} h={200.5}/>
          </Card.Section>
          <Card.Section withBorder inheritPadding py="xs">
            <DateTimePicker label="起始日期" value={startTime}
                            onChange={(e) => setStartTime(new Date(e?.toLocaleString() || ''))}
                            valueFormat="YYYY/MM/DD HH:mm"/>
          </Card.Section>
          <Card.Section withBorder inheritPadding py="xs">
            <DateTimePicker label="截止日期" value={endTime}
                            onChange={(e) => setEndTime(new Date(e?.toLocaleString() || ''))}
                            valueFormat="YYYY/MM/DD HH:mm"/>
          </Card.Section>
          <Card.Section withBorder inheritPadding py="xs">
            <Group>
              <Switch
                checked={allowSubmit}
                onChange={(e) => setAllowSubmit(e.currentTarget.checked)}
                label="允许提交"
              />
              <Switch
                checked={allowView}
                onChange={(e) => setAllowView(e.currentTarget.checked)}
                label="允许查看"
              />
              <Switch
                checked={allowJudge}
                onChange={(e) => setAllowJudge(e.currentTarget.checked)}
                label="允许评判"
              />
              <Switch
                checked={allowReSubmit}
                onChange={(e) => setAllowReSubmit(e.currentTarget.checked)}
                label="允许重新提交"
              />
            </Group>
          </Card.Section>
        </Card>
      </ScrollArea>
      <Space h={20}/>
      <Group grow>
        <Button variant="outline" onClick={() => {
          setTimeout(props.onClose, 0);
        }}>取消</Button>
        <Button onClick={() => {
          save();
          setTimeout(props.onClose, 0);
        }}>保存</Button>
      </Group>
    </Modal>
  );
}

export interface SurveyCardEditProps {
  survey: Survey;
  opened: boolean;
  onClose: () => void;
  onAfterSave?: () => void;
}
