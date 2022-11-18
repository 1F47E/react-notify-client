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

// get the url of the websocket server from vercel envs
// NEXT_PUPLIC prefix is required for vercel to expose the env
const publishUrl = process.env.NEXT_PUBLIC_PUBLISH_SERVER_URL as string;


const Publish = () => {

    const [formData, setFormData] = useState({
        channel: 'global',
        type: 'info',
        text: '',
    });

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('form data', formData);

        // send post request
        const headers = {
            'Content-Type': 'application/json',
            'channels': formData.channel
        }
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ type: formData.type, text: formData.text })
        };
        fetch(publishUrl, requestOptions)
            .then(response => { 
                console.log(response.json()) 
            })
            .then(data => { 
                console.log('response:', data) 
            });
        event.currentTarget.reset();
    }

    const handleChannel = (e: any) => {
        const val = e.target.value;
        setFormData({ ...formData, channel: val });
    }
    const handleType = (val: string) => {
        setFormData({ ...formData, type: val })
    }
    const handleText = (e: any) => {
        const val = e.target.value;
        setFormData({ ...formData, text: val });
    }

    return (
        <>
            <form onSubmit={handleFormSubmit}>

                <TextInput
                    label="Channel or channels"
                    placeholder="global"
                    required
                    value={formData.channel}
                    onChange={handleChannel}
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
                    onChange={handleType}
                />

                <Textarea
                    required
                    label="Notifiaction message"
                    placeholder="Message text"
                    minRows={4}
                    mt="md"
                    onChange={handleText}
                />


                <Group position="right" mt="md">
                    <Button type="submit">Send notification</Button>
                </Group>
            </form>
        </>
    )
}
export default Publish