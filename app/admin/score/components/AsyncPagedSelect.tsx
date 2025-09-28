import {
  ActionIcon,
  Code,
  Combobox,
  Group,
  Input,
  InputBase,
  ScrollArea,
  Stack,
  Text,
  useCombobox,
} from '@mantine/core';
import {useEffect, useState} from 'react';
import {notifications} from '@mantine/notifications';
import {IconDownload, IconX} from '@tabler/icons-react';
import {Survey} from "@/model/survey";
import SurveyNetwork from "@/network/survey";
import {ScoreNetwork} from "@/network/score";

function Options(props: Survey) {
  function removeTags(input: string): string {
    return input.replace(/<[^>]*>/g, '');
  }

  function cutStringByLength(input: string, length: number): string {
    return input.length > length ? `${input.substring(0, length)}...` : input;
  }

  return (
    <Group>
      <Code>
        {props.id}
      </Code>
      <Stack gap="xs">
        <Text fz="sm" fw={500}>{props.title}</Text>
        <Text fz="xs" opacity={0.6}>{cutStringByLength(removeTags(props.description), 20)}</Text>
      </Stack>
    </Group>
  );
}

export default function AsyncPagedSelect(props: SelectProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [fullLoaded, setFullLoaded] = useState(false);
  const [search, setSearch] = useState('');

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const filteredOptions = surveys.filter((item: Survey) =>
    item.title.toLowerCase().includes(search.toLowerCase().trim())) ?? [];

  const options = filteredOptions.map((item: Survey) => (
    <Combobox.Option value={item.id.toString()} key={item.id}>
      <Options {...item} />
    </Combobox.Option>
  ));

  function loadMore() {
    if (fullLoaded) {
      notifications.show({
        message: '没有更多了',
        color: 'red',
      });
      return;
    }

    SurveyNetwork.fetchSurveyList(currentPage, 10)()
      .then((res) => {
        setSurveys([...surveys, ...res]);
        setCurrentPage(currentPage + 1);

        if (res.length === 0) {
          setFullLoaded(true);
          notifications.show({
            message: '没有更多了',
            color: 'red',
          });
        } else {
          notifications.show({
            message: '获取到一批新的问卷',
            color: 'green',
          });
        }
      })
  }

  const exportAnswer = () => {
    if (props.value === undefined) {
      return;
    }

    ScoreNetwork.exportAnswer(props.value)
      .then((result) => {
        // 添加UTF-8 BOM解决Excel中文乱码问题
        const BOM = '\uFEFF';
        const csvData = BOM + result;

        // 创建Blob对象
        const blob = new Blob([csvData], {
          type: 'text/csv;charset=utf-8',
        });

        // 创建下载链接
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        // 设置下载属性
        link.href = url;
        link.download = `Survey ${props.value}.csv`;

        // 触发下载
        document.body.appendChild(link);
        link.click();

        // 清理资源
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      })
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        props.onChange(Number(optionValue));
        combobox.closeDropdown();
      }}
      store={combobox}
      withinPortal={false}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          leftSection={
            props.value !== undefined ? (
              <ActionIcon
                size="sm"
                variant="subtle"
                color="gray"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => exportAnswer()}
              >
                <IconDownload/>
              </ActionIcon>
            ) : <></>
          }
          rightSection={
            props.value !== undefined ? (
              <ActionIcon
                size="sm"
                variant="subtle"
                color="gray"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => props.onChange(undefined)}
              >
                <IconX/>
              </ActionIcon>
            ) : (
              <Combobox.Chevron/>
            )
          }
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents={props.value === undefined ? 'none' : 'all'}
          w={300}
        >
          {(props.value && surveys.find((a) => a.id === props.value)?.title) ||
              <Input.Placeholder>选择问卷</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="搜索标题"
        />

        <Combobox.Options>
          <ScrollArea.Autosize onBottomReached={loadMore}>
            {options.length === 0 ?
              <Combobox.Empty>没有可选目标</Combobox.Empty> : options}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export interface SelectProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}