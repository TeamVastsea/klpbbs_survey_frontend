'use client';

import { useState } from 'react';
import { IconLogout, IconSearch, IconShield, IconUserCancel } from '@tabler/icons-react';
import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Group,
  LoadingOverlay,
  Pagination,
  Space,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useManagedUsers, useUser } from '@/data/use-user';
import { ManagedUser } from '@/model/user';
import UserNetwork from '@/network/user';

const PAGE_SIZE = 20;

export default function EditUserPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [updatingUid, setUpdatingUid] = useState<string>();
  const currentUser = useUser();
  const managedUsers = useManagedUsers(page, PAGE_SIZE, debouncedSearch);

  const updateUser = async (
    user: ManagedUser,
    update: { admin?: boolean; disabled?: boolean },
    message: string
  ) => {
    setUpdatingUid(user.uid);
    try {
      await UserNetwork.updateManagedUser(user.uid, update);
      await managedUsers.mutate();
      notifications.show({ title: '操作成功', message, color: 'green' });
    } catch {
      notifications.show({ title: '操作失败', message: '用户状态未修改', color: 'red' });
    } finally {
      setUpdatingUid(undefined);
    }
  };

  const toggleDisabled = (user: ManagedUser) => {
    if (user.disabled) {
      updateUser(user, { disabled: false }, '用户已解除封禁');
      return;
    }

    modals.openConfirmModal({
      title: '封禁用户',
      children: <Text size="sm">确定封禁“{user.username}”吗？该用户的所有登录会立即失效。</Text>,
      labels: { confirm: '确认封禁', cancel: '取消' },
      confirmProps: { color: 'red' },
      onConfirm: () => updateUser(user, { disabled: true }, '用户已封禁'),
    });
  };

  const toggleAdmin = (user: ManagedUser) => {
    const nextAdmin = !user.admin;
    modals.openConfirmModal({
      title: nextAdmin ? '授予管理员权限' : '取消管理员权限',
      children: (
        <Text size="sm">
          确定{nextAdmin ? '将' : '不再将'}“{user.username}”设为管理员吗？
        </Text>
      ),
      labels: { confirm: '确认', cancel: '取消' },
      confirmProps: { color: nextAdmin ? 'blue' : 'red' },
      onConfirm: () =>
        updateUser(user, { admin: nextAdmin }, nextAdmin ? '已设为管理员' : '已取消管理员权限'),
    });
  };

  const invalidateSessions = (user: ManagedUser) => {
    modals.openConfirmModal({
      title: '退出所有登录',
      children: <Text size="sm">确定让“{user.username}”退出所有登录吗？</Text>,
      labels: { confirm: '确认退出', cancel: '取消' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        setUpdatingUid(user.uid);
        try {
          await UserNetwork.invalidateUserSessions(user.uid);
          await managedUsers.mutate();
          notifications.show({ title: '操作成功', message: '用户已退出所有登录', color: 'green' });
        } catch {
          notifications.show({ title: '操作失败', message: '无法退出用户登录', color: 'red' });
        } finally {
          setUpdatingUid(undefined);
        }
      },
    });
  };

  return (
    <Container size="xl" py="xl">
      <Center>
        <Title order={1}>用户管理</Title>
      </Center>
      <Space h="lg" />
      <TextInput
        value={search}
        onChange={(event) => {
          setSearch(event.currentTarget.value);
          setPage(0);
        }}
        leftSection={<IconSearch size={16} />}
        placeholder="搜索用户名或 UID"
        aria-label="搜索用户名或 UID"
        maw={500}
        mx="auto"
      />
      <Space h="lg" />

      <Box pos="relative">
        <Table.ScrollContainer minWidth={900}>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>用户</Table.Th>
                <Table.Th>UID</Table.Th>
                <Table.Th>权限</Table.Th>
                <Table.Th>状态</Table.Th>
                <Table.Th>登录状态</Table.Th>
                <Table.Th>操作</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {managedUsers.users?.data.map((user) => {
                const isSelf = user.uid === currentUser.user?.uid;
                const isUpdating = updatingUid === user.uid;
                return (
                  <Table.Tr key={user.uid}>
                    <Table.Td>
                      <Group gap="xs" wrap="nowrap">
                        <Text fw={500}>{user.username}</Text>
                        {isSelf && <Badge variant="light">当前用户</Badge>}
                      </Group>
                    </Table.Td>
                    <Table.Td>{user.uid}</Table.Td>
                    <Table.Td>
                      <Badge color={user.admin ? 'blue' : 'gray'}>
                        {user.admin ? '管理员' : '普通用户'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={user.disabled ? 'red' : 'green'}>
                        {user.disabled ? '已封禁' : '正常'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={user.logged_in ? 'green' : 'gray'}>
                        {user.logged_in ? '已登录' : '未登录'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" wrap="nowrap">
                        <Button
                          size="xs"
                          variant="light"
                          color={user.disabled ? 'green' : 'red'}
                          leftSection={<IconUserCancel size={14} />}
                          disabled={isSelf || isUpdating}
                          onClick={() => toggleDisabled(user)}
                        >
                          {user.disabled ? '解封' : '封禁'}
                        </Button>
                        <Button
                          size="xs"
                          variant="light"
                          color={user.admin ? 'red' : 'blue'}
                          leftSection={<IconShield size={14} />}
                          disabled={isSelf || isUpdating}
                          onClick={() => toggleAdmin(user)}
                        >
                          {user.admin ? '取消管理员' : '设为管理员'}
                        </Button>
                        <Button
                          size="xs"
                          variant="light"
                          color="orange"
                          leftSection={<IconLogout size={14} />}
                          disabled={isSelf || !user.logged_in || isUpdating}
                          onClick={() => invalidateSessions(user)}
                        >
                          退出所有登录
                        </Button>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {managedUsers.users?.data.length === 0 && (
          <Center py="xl">
            <Text c="dimmed">没有找到用户</Text>
          </Center>
        )}
        {managedUsers.isError && (
          <Center py="xl">
            <Text c="red">用户列表加载失败</Text>
          </Center>
        )}
        <LoadingOverlay visible={managedUsers.isLoading} />
      </Box>

      <Center mt="lg">
        <Pagination
          total={managedUsers.users?.total || 1}
          value={page + 1}
          onChange={(value) => setPage(value - 1)}
          hideWithOnePage
        />
      </Center>
    </Container>
  );
}
