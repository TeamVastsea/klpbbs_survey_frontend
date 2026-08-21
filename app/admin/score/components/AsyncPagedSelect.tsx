import { useEffect, useRef, useState } from 'react';
import { IconDownload, IconX } from '@tabler/icons-react';
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
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Survey } from '@/model/survey';
import { ScoreNetwork } from '@/network/score';
import SurveyNetwork from '@/network/survey';

const PAGE_SIZE = 10;

function Options(props: Survey) {
  function removeTags(input: string): string {
    return input.replace(/<[^>]*>/g, '');
  }

  function cutStringByLength(input: string, length: number): string {
    return input.length > length ? `${input.substring(0, length)}...` : input;
  }

  return (
    <Group>
      <Code>{props.id}</Code>
      <Stack gap="xs">
        <Text fz="sm" fw={500}>
          {props.title}
        </Text>
        <Text fz="xs" opacity={0.6}>
          {cutStringByLength(removeTags(props.description), 20)}
        </Text>
      </Stack>
    </Group>
  );
}

export default function AsyncPagedSelect(props: SelectProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [fullLoaded, setFullLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [isLoading, setIsLoading] = useState(false);
  const requestGeneration = useRef(0);
  const loading = useRef(false);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = surveys.map((item: Survey) => (
    <Combobox.Option value={item.id.toString()} key={item.id}>
      <Options {...item} />
    </Combobox.Option>
  ));

  async function loadMore() {
    if (fullLoaded || loading.current || search !== debouncedSearch) {
      return;
    }

    const generation = requestGeneration.current;
    const requestedPage = currentPage;
    loading.current = true;
    setIsLoading(true);

    try {
      const result = await SurveyNetwork.fetchSurveyList(
        requestedPage,
        PAGE_SIZE,
        debouncedSearch
      )();
      if (generation !== requestGeneration.current) {
        return;
      }

      setSurveys((previous) => [...previous, ...result]);
      setCurrentPage(requestedPage + 1);
      setFullLoaded(result.length < PAGE_SIZE);
    } catch {
      if (generation === requestGeneration.current) {
        notifications.show({ message: '问卷加载失败', color: 'red' });
      }
    } finally {
      if (generation === requestGeneration.current) {
        loading.current = false;
        setIsLoading(false);
      }
    }
  }

  const exportAnswer = () => {
    if (props.value === undefined) {
      return;
    }

    ScoreNetwork.exportAnswer(props.value).then((result) => {
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
    });
  };

  useEffect(() => {
    const generation = requestGeneration.current + 1;
    requestGeneration.current = generation;
    loading.current = true;
    setIsLoading(true);
    setSurveys([]);
    setCurrentPage(0);
    setFullLoaded(false);

    SurveyNetwork.fetchSurveyList(0, PAGE_SIZE, debouncedSearch)()
      .then((result) => {
        if (generation !== requestGeneration.current) {
          return;
        }
        setSurveys(result);
        setCurrentPage(1);
        setFullLoaded(result.length < PAGE_SIZE);
      })
      .catch(() => {
        if (generation === requestGeneration.current) {
          notifications.show({ message: '问卷加载失败', color: 'red' });
        }
      })
      .finally(() => {
        if (generation === requestGeneration.current) {
          loading.current = false;
          setIsLoading(false);
        }
      });

    return () => {
      if (generation === requestGeneration.current) {
        requestGeneration.current += 1;
        loading.current = false;
      }
    };
  }, [debouncedSearch]);

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
                <IconDownload />
              </ActionIcon>
            ) : null
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
                <IconX />
              </ActionIcon>
            ) : (
              <Combobox.Chevron />
            )
          }
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents={props.value === undefined ? 'none' : 'all'}
          w={300}
        >
          {(props.value && surveys.find((a) => a.id === props.value)?.title) || (
            <Input.Placeholder>选择问卷</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          value={search}
          onChange={(event) => {
            requestGeneration.current += 1;
            loading.current = false;
            setSearch(event.currentTarget.value);
            setSurveys([]);
            setCurrentPage(0);
            setFullLoaded(false);
            setIsLoading(false);
          }}
          placeholder="搜索标题"
        />

        <Combobox.Options>
          <ScrollArea.Autosize onBottomReached={loadMore}>
            {options.length === 0 ? (
              <Combobox.Empty>
                {isLoading || search !== debouncedSearch ? '加载中...' : '没有可选目标'}
              </Combobox.Empty>
            ) : (
              options
            )}
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
