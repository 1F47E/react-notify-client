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
  useMantineTheme
} from "@mantine/core";

import {
  IconAlertCircle,
  IconX,
  IconStack2
} from "@tabler/icons"

import HowTo from '../components/howto';

// get the url of the websocket server from vercel envs
// NEXT_PUPLIC prefix is required for vercel to expose the env
const socketUrl = process.env.NEXT_PUBLIC_WS_SERVER_URL as string;

const defaultChannels = ['global', 'random', 'demo'];
const localStorageKey = 'saved_channels'

const Home = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [doConnect, setDoConnect] = useState<boolean>(true);

  // if localStorage is not available or value at given key does not exist
  // 'channels' will be assigned to defaultChannels
  const [channels, setChannels] = useLocalStorage(
    {
      key: localStorageKey,
      defaultValue: defaultChannels
    });

  // create WS connection
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    socketUrl, {
    shouldReconnect: (closeEvent) => true,
  }, doConnect);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  // convert readyState to string status
  const stateToString = (state: number) => {
    switch (state) {
      case ReadyState.UNINSTANTIATED:
        return 'UNINSTANTIATED';
      case ReadyState.CONNECTING:
        return 'CONNECTING';
      case ReadyState.OPEN:
        return 'OPEN';
      case ReadyState.CLOSING:
        return 'CLOSING';
      case ReadyState.CLOSED:
        return 'CLOSED';
      default:
        return 'UNKNOWN';
    }
  }

  // convert message type to color string value
  const messageTypeToColor = function (type: string): string {
    switch (type) {
      case 'info':
        return 'blue';
      case 'error':
        return 'red';
      case 'success':
        return 'green';
      case 'warning':
        return 'yellow';
      default:
        return 'gray';
    }
  }

  // show nitification wrapper
  const notify = function (message: string, color: string) {
    showNotification({
      message: message,
      color: color,
      radius: 'lg'
    })
  }


  // handle readyState changes
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      setIsConnected(true);
      console.log('useWebSocket connected (useEffect)')
      logEvent("Connected");
      notify("Connected", "green")
      console.log('re-subscribing to channels: ', channels)
      // send list of channels to subscribe to
      sendMessage(JSON.stringify(channels))

    } else if (readyState === ReadyState.CLOSED) {
      setIsConnected(false);
      logEvent("Disconnected");
      notify("Disconnected", "red")

    } else {
      setIsConnected(false);
      const statusStr = stateToString(readyState)
      console.log(`useWebSocket state: ${statusStr} (useEffect)`)
      logEvent('connection: ' + statusStr);
    }
  }, [readyState]);


  // update on new incoming ws message
  // TODO: make message an object with text and type
  useEffect(() => {
    console.log('useEffect on lastMessage')
    console.log({ lastMessage });
    if (lastMessage !== null) {
      setMessageHistory((prev) => [lastMessage.data, ...prev]);

      const message = JSON.parse(lastMessage.data);
      const color = messageTypeToColor(message.type);

      // show nitification on new message
      notify(message.text, color);
    }
  }, [lastMessage]);

  // handle channels change
  // subscribe to new list of channels
  useEffect(() => {
    if (channels.length == 0) {
      logEvent('Unsubscribed from all channels');
    } else {
      logEvent(`Subscribed to: ${channels}`);
    }
    sendMessage(JSON.stringify(channels))
  }, [channels, sendMessage]);


  // update logs array with datetime + event
  const logEvent = function (val: string) {
    console.log('logging: ' + val)
    setLogs((prev) => [
      `${new Date().toLocaleTimeString()}: ${val} `,
      ...prev,
    ]);
  }

  // handle multiselect on change
  const handleChannelsInput = function (vars: string[]) {
    setChannels(vars);
  }

  const handleConnectButton = function () {
    logEvent(isConnected ? 'disconnecting...' : 'connecting...')
    setDoConnect(prevValue => !prevValue);
  }

  return (
    <Container
      sx={{
        padding: 20,
        marginTop: 20
      }}
    >

      <Grid grow gutter="xl">
        {/* ========== LEFT COL ========== */}
        <Grid.Col md={6} lg={3}>

          <Paper radius="lg" p="lg" withBorder={true}>
            <Group>

              <Text color={isConnected ? 'green' : 'red'}>{connectionStatus}</Text>

              <Button
                color="indigo"
                radius="lg"
                size="xs"
                // compact
                onClick={handleConnectButton}
                disabled={readyState === ReadyState.CONNECTING}
              >
                {isConnected ? 'Disconnect' : 'Connect'}
              </Button>
            </Group>
          </Paper>

          <Space h="xl" />

          <Paper radius="lg" p="lg" withBorder={true}>
            <Text>Channels</Text>
            <Space h="sm" />
            <MultiSelect
              data={channels}
              value={channels}
              placeholder="Subscribe to some channels here"
              size="sm"
              radius="lg"
              disabled={!isConnected}
              searchable
              creatable
              icon={<IconStack2 />}
              getCreateLabel={(query) => `Subscribe to [${query}]`}
              onChange={handleChannelsInput}
            />
          </Paper>

          <Space h="xl" />

          <Paper radius="lg" p="lg" withBorder={true}>
            <Space h="sm" />
            <ScrollArea style={{ height: 250 }} type="auto" offsetScrollbars>
              {logs.map((log, index) => (
                <Text key={index} size="xs">{log}</Text>
              ))}
            </ScrollArea>
          </Paper>
        </Grid.Col>

        <Grid.Col md={6} lg={3}>
          <Container sx={{ maxWidth: '500px'}} >
            <Text>To publish a message run the folowing request</Text>
            <Space h="sm" />
            <HowTo/>
          </Container>

          <Space h="xl" />

          {messageHistory.length > 0 && (
            <Paper radius="lg" p="lg" withBorder={true}>
              {messageHistory.map((message: any, idx: number) => (
                <Container key={idx}>
                  <Alert
                    color={messageTypeToColor(JSON.parse(message).type)}
                    radius="lg"
                  >
                    {message ? JSON.parse(message).text : null}
                  </Alert>
                  <Space h="md" />
                </Container>
              ))}
            </Paper>
          )}
        </Grid.Col>
      </Grid>

    </Container>
  )
}

export default Home
