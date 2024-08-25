import { Button, Center, Group, Modal, Space, Text } from '@mantine/core';

interface ConfirmationModalProps {
    isOpen: boolean;
    closeModal: () => void;
    confirmAction: () => void;
    loading: boolean;
}

export default function ConfirmationModal({
                                              isOpen,
                                              closeModal,
                                              confirmAction,
                                              loading,
                                          }: ConfirmationModalProps) {
    return (
        <Modal opened={isOpen} onClose={closeModal} title="确认操作">
            <Center>
                <Text size="lg" fw={700} c="red">确认创建新问卷?</Text>
            </Center>
            <Space h={30} />
            <Center>
                <Group>
                    <Button variant="outline" onClick={closeModal}>
                        取消
                    </Button>
                    <Button color="red" onClick={confirmAction} loading={loading}>
                        确认
                    </Button>
                </Group>
            </Center>
        </Modal>
    );
}
