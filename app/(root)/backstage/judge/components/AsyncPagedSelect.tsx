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
    return (
        <Group>
            <Code>
                {props.id}
            </Code>
            <Stack gap="xs">
                <Text fz="sm" fw={500}>{props.title}</Text>
                <Text fz="xs" opacity={0.6}>{props.description}</Text>
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
            }

            notifications.show({
                message: '获取到一批新的',
                color: 'green',
            });
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
                            aria-label="Clear value"
                          />
                      ) : (
                          <Combobox.Chevron />
                      )
                  }
                  onClick={() => combobox.toggleDropdown()}
                  rightSectionPointerEvents={props.value === '' ? 'none' : 'all'}
                  w={300}
                >
                    {props.value || <Input.Placeholder>Pick value</Input.Placeholder>}
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
