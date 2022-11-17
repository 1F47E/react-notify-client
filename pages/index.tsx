import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { showNotification } from '@mantine/notifications';

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

// get the url of the websocket server from vercel envs
// NEXT_PUPLIC prefix is required for vercel to expose the env
const socketUrl = process.env.NEXT_PUBLIC_WS_SERVER_URL as string;

const defaultChannels = ['general', 'random', 'test'];

const Home = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  // const [channelInput, setChannelInput] = useState<string>('demo');
  const [channelList, setChannelList] = useState<string[]>(defaultChannels);
  const [connected, setConnected] = useState<boolean>(true);

  // create WS connection
  // const {
  //   sendMessage,
  //   lastMessage,
  //   readyState,
  //   getWebSocket,
  // } = useWebSocket(socketUrl, {
  //   onOpen: () => {
  //     console.log('useWebSocket connected (onOpen)')
  //   },
  //   shouldReconnect: (closeEvent) => true,
  // }, connected);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  // use effect on readyState change to monitor connection status
  // useEffect(() => {
  //   if (readyState === ReadyState.OPEN) {
  //     console.log('useWebSocket connected (useEffect)')
  //     // updateChannels(null)
  //     setIsConnected(true)
  //     // setConnected(true)
  //     logEvent("readyState: connected");
  //     showNotification({
  //       message: 'Connected',
  //       color: 'green',
  //       radius: 'lg'
  //     })
  //   } else if (readyState === ReadyState.CLOSED) {
  //     logEvent("readyState: closed");
  //     setIsConnected(false)
  //     showNotification({
  //       message: 'Disconnected',
  //       color: 'red',
  //       radius: 'lg'
  //     })

  //   } else {
  //     setIsConnected(false)
  //     console.log('useWebSocket disconnected (useEffect')
  //   }
  // }, [readyState])

  // connection status enum to string
  // const connectionStatus = {
  //   [ReadyState.CONNECTING]: 'Connecting',
  //   [ReadyState.OPEN]: 'Open',
  //   [ReadyState.CLOSING]: 'Closing',
  //   [ReadyState.CLOSED]: 'Closed',
  //   [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  // }[readyState];

  // let isConnected = readyState === ReadyState.OPEN;


  // update logs array with datetime + event
  const logEvent = function (val: string) {
    console.log('logging: ' + val)
    setLogs((prev) => [
      `${new Date().toLocaleTimeString()}: ${val} `,
      ...prev,
    ]);
  }

  // handle multiselect on change
  const handleChannelsInput = function (channels: string[]) {
    console.log({ channels })
    updateChannels(channels)
  }

  // handle connect-disconnect button
  const handleConnectButton = function () {
    logEvent(connected ? 'disconnecting...' : 'trying to connect...')
    setConnected(prevValue => !prevValue);
  }

  const updateChannels = function (channels: string[] | null) {
    if (!connected) {
      console.log("cant subscribe, not connected")
      return
    }
    if (channels === null) {
      channels = defaultChannels
    }
    if (channels.length === 0) {
      logEvent('Unsubscribing from all channels');
    } else {
      logEvent(`Subscribing to ${channels.join(', ')}`);
    }
    setChannelList(channels);
    sendMessage(JSON.stringify(channels))
  }

  // update history on new message
  // TODO: make message an object with text and type
  useEffect(() => {
    console.log('useEffect on lastMessage')
    console.log({ lastMessage });
    if (lastMessage !== null) {
      setMessageHistory((prev) => [lastMessage.data, ...prev]);

      // show nitification on new message
      const message = JSON.parse(lastMessage.data);
      showNotification({
        message: message.text,
        color: message.type,
        radius: 'lg'
      })
    }
  }, [lastMessage]);

  // handle connected event
  // useEffect(() => {
  //   // log the event
  //   console.log('useEffect on connectionStatus')
  //   logEvent(connectionStatus);
  //   showNotification({
  //     message: 'connectionStatus:'+connectionStatus,
  //     color: 'green',
  //     radius: 'lg'
  //   })
  // }, [connectionStatus]);


  const theme = useMantineTheme()

  // multiselect
  // const [data, setData] = useState([
  //   { value: 'demo', label: 'demo' },
  //   { value: 'global', label: 'global' },
  // ]);

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

          <Title>Connection. readyState: {readyState}, connectionStatus: {connectionStatus}</Title>
          <Space h="xl" />

          <Paper radius="lg" p="lg" withBorder={true}>
            <Group>

              <Text color={connected ? 'green' : 'red'}>{connectionStatus}</Text>

              <Button
                color="indigo"
                radius="lg"
                size="xs"
                // compact
                onClick={handleConnectButton}
              >
                {connected ? 'Disconnect' : 'Connect'}
              </Button>
            </Group>
          </Paper>

          <Space h="xl" />

          <Paper radius="lg" p="lg" withBorder={true}>
            <Text>Channels</Text>
            <Space h="sm" />
            <MultiSelect
              data={channelList}
              defaultValue={defaultChannels}
              placeholder="Subscribe to some channels here"
              size="sm"
              radius="lg"
              disabled={!connected}
              searchable
              creatable
              icon={<IconStack2 />}
              getCreateLabel={(query) => `Subscribe to [${query}]`}
              onChange={handleChannelsInput}
            />
          </Paper>

          <Space h="xl" />

          <Paper radius="lg" p="lg" withBorder={true}>
            <Text>Logs</Text>
            <Space h="sm" />
            <ScrollArea style={{ height: 250 }} type="auto" offsetScrollbars>
              {logs.map((log, index) => (
                <Text key={index} size="xs">{log}</Text>
              ))}
            </ScrollArea>
          </Paper>
        </Grid.Col>

        <Grid.Col md={6} lg={3}>
          <Title >Message history</Title>
          <Space h="xl" />
          <Paper radius="lg" p="lg" withBorder={true}>
            {messageHistory.length == 0 && <Text>No messages</Text>}

            {messageHistory.map((message: any, idx: number) => (
              <Container key={idx}>

                <Alert
                  // icon={<IconAlertCircle size={16} />}
                  // title="Bummer!"
                  color={JSON.parse(message).type}
                  radius="lg"
                >
                  {message ? JSON.parse(message).text : null}
                </Alert>
                <Space h="md" />
              </Container>
            ))}
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default Home
