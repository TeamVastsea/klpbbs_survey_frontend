import {
    Code,
    Combobox,
    Group,
    InputBase,
    ScrollArea,
    Stack,
    Text,
    Input,
    useCombobox,
    CloseButton,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import SurveyApi, { SurveyInfo } from '@/api/SurveyApi';

function Options(props: SurveyInfo) {
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
    const [surveys, setSurveys] = useState<SurveyInfo[]>([]);
    const [fullLoaded, setFullLoaded] = useState(false);
    const [search, setSearch] = useState('');

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    // const shouldFilterOptions = !surveys.some((item: SurveyInfo) => item.id.toString() === value);
    const filteredOptions = surveys.filter((item: SurveyInfo) =>
        item.title.toLowerCase().includes(search.toLowerCase().trim()));

    const options = filteredOptions.map((item: SurveyInfo) => (
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

        SurveyApi.getList(currentPage, 10, '').then((res) => {
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
        });
    }

    useEffect(() => {
        loadMore();
    }, []);

    return (
        <Combobox
          onOptionSubmit={(optionValue) => {
                props.onChange(optionValue);
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
                  rightSection={
                      props.value !== '' ? (
                          <CloseButton
                            size="sm"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => props.onChange('')}
                            aria-label="清空搜索"
                          />
                      ) : (
                          <Combobox.Chevron />
                      )
                  }
                  onClick={() => combobox.toggleDropdown()}
                  rightSectionPointerEvents={props.value === '' ? 'none' : 'all'}
                  w={300}
                >
                    {props.value || <Input.Placeholder>选择问卷</Input.Placeholder>}
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
    value: string;
    onChange: (value: string) => void;
}
