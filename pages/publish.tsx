import React, { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { showNotification } from '@mantine/notifications';
import { useLocalStorage } from '@mantine/hooks';

// styling
import {
    Grid,
    Text,
    Group,
    Button,
    Container,
    Space,
    Title,
    Center,
    Divider,
    Input,
    Radio,
    Popover,
    Tooltip,
    TextInput,
    Indicator,
    Select,
    CloseButton,
    Modal,
    Transition,
    Alert,
    Paper,
    Chip,
    MultiSelect,
    ScrollArea,
    Textarea,
    createStyles,
    useMantineTheme
} from "@mantine/core";

import {
    IconAlertCircle,
    IconX,
    IconStack2
} from "@tabler/icons"

const useStyles = createStyles((theme) => ({
    wrapper: {
        minHeight: 400,
        boxSizing: 'border-box',
        backgroundImage: `linear-gradient(-60deg, ${theme.colors[theme.primaryColor][4]} 0%, ${theme.colors[theme.primaryColor][7]
            } 100%)`,
        borderRadius: theme.radius.md,
        padding: theme.spacing.xl * 2.5,

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            padding: theme.spacing.xl * 1.5,
        },
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        color: theme.white,
        lineHeight: 1,
    },

    description: {
        color: theme.colors[theme.primaryColor][0],
        maxWidth: 300,

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            maxWidth: '100%',
        },
    },

    form: {
        backgroundColor: theme.white,
        padding: theme.spacing.xl,
        borderRadius: theme.radius.md,
        boxShadow: theme.shadows.lg,
    },

    social: {
        color: theme.white,

        '&:hover': {
            color: theme.colors[theme.primaryColor][1],
        },
    },

    input: {
        backgroundColor: theme.white,
        borderColor: theme.colors.gray[4],
        color: theme.black,

        '&::placeholder': {
            color: theme.colors.gray[5],
        },
    },

    inputLabel: {
        color: theme.black,
    },

    control: {
        backgroundColor: theme.colors[theme.primaryColor][6],
    },
}));




const PublishPage = () => {
    const { classes } = useStyles();
    return (
        <Container>
            <div>
                <TextInput
                    label="Channel or channels"
                    value="global"
                    placeholder="global"
                    required
                />

                <Select
                    label="Notification type"
                    placeholder="Pick one"
                    required
                    data={[
                        { value: 'info', label: 'Info' },
                        { value: 'warning', label: 'Warning' },
                        { value: 'error', label: 'Error' },
                        { value: 'success', label: 'Success' },
                    ]}
                />

                <Textarea
                    required
                    label="Notifiaction message"
                    placeholder="Message text"
                    minRows={4}
                    mt="md"
                />

                <Group position="right" mt="md">
                    <Button>Send notification</Button>
                </Group>
            </div>
        </Container>
    )
}
export default PublishPage