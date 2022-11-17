import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

// styling

import {
  createStyles,
  Image,
  Card,
  Grid,
  Text,
  Group,
  Button,
  Badge,
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
  useMantineTheme
} from "@mantine/core";

import {
  IconAlertCircle,
  IconX,
  IconStack2
} from "@tabler/icons"


// import { CssVarsProvider } from '@mui/joy/styles';
// import { Sheet, Box, Chip, ChipDelete, Alert, Typography, Divider } from '@mui/joy';
// import FormControl from '@mui/joy/FormControl';
// import { TextField, Button, Input, FormHelperText, FormLabel } from '@mui/joy';

// get the url of the websocket server from vercel envs
// NEXT_PUPLIC prefix is required for vercel to expose the env
const socketUrl = process.env.NEXT_PUBLIC_WS_SERVER_URL as string;

const Home = () => {
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [channelInput, setChannelInput] = useState<string>('demo');
  const [channelList, setChannelList] = useState<string[]>([]);
  const [connected, setConnected] = useState<boolean>(true);

  // create WS connection
  const {
    sendMessage,
    lastMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    shouldReconnect: (closeEvent) => true,
  }, connected);

  // subscribe to the list of channels on page first load
  useEffect(() => {
    doSubscribe()
  }, []);

  // update history on new message
  // TODO: make message an object with text and type
  useEffect(() => {
    console.log('useEffect on lastMessage')
    console.log({ lastMessage });
    if (lastMessage !== null) {
      setMessageHistory((prev) => [...prev, lastMessage.data]);
    }
  }, [lastMessage]);



  // form handlers
  const handleSubscribe = function () {
    doSubscribe()
  }

  const handleConnect = function () {
    setConnected(prevValue => !prevValue);
  }

  const handleChannelInput = function (e: { target: { value: string; }; }) {
    setChannelInput(e.target.value)
  }

  const handleChannelUnsubscribe = function (index: number) {
    console.log('unsubscribe', index)
    const newChannelList = channelList.filter(chan => chan !== channelList[index])
    setChannelList(newChannelList)
    setChannelInput(newChannelList.join(', '))
    doSubscribe(newChannelList)
  }

  const doSubscribe = function (channels?: string[]) {
    if (!channels) {
      channels = channelInput.split(',')
    }
    setChannelList(channels);
    sendMessage(JSON.stringify(channels))
  }

  // connection status
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const isConnected = readyState === ReadyState.OPEN;

  const theme = useMantineTheme()

  // multiselect
  const [data, setData] = useState([
    { value: 'demo', label: 'Demo' },
    { value: 'global', label: 'Global' },
  ]);

  return (
    <Container
      sx={{
        // width: "100%",
        // maxWidth: '600px',
        // border: '1px solid',
        // borderColor: theme.colors.gray[4],
        // borderRadius: 20,
        padding: 20,
        marginTop: 20
      }}
    >
      <Grid grow gutter="xl">
        {/* ========== LEFT COL ========== */}
        <Grid.Col md={6} lg={3}>

          <Title>Connection</Title>
          <Space h="xl" />

          <Paper radius="lg" p="lg" withBorder={true}>
            <Group>

              <Text color={isConnected ? 'green' : 'red'}>{connectionStatus}</Text>
              {/* <Button
              onClick={handleConnect}
              size="sm"
              color={isConnected ? 'danger' : 'primary'}
            >{isConnected ? 'Disconnect' : 'Connect'}</Button> */}
              <Button
                color="indigo"
                radius="lg"
                size="xs"
                // compact
                onClick={handleConnect}
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
              // label="Channels"
              data={data}
              defaultValue={['demo', 'global']}
              placeholder="Subscribe to some channels here"
              size="sm"
              radius="lg"
              disabled={!isConnected}
              searchable
              creatable
              icon={<IconStack2 />}
              getCreateLabel={(query) => `Subscribe to [${query}]`}
              onCreate={(query) => {
                const item = { value: query, label: query };
                setData((current) => [...current, item]);
                return item;
              }}
            />

            {/* <Space h="xl" /> */}
            {/* <Paper radius="lg" p="lg" withBorder={true}> */}
            {/* {channelList.map((channel: string, index: number) => (
              <Button
                key={index}
                color="green"
                variant='outline'
                radius="lg"
                size="xs"
                rightIcon={<IconX size={12} color="white" />}
                >channel</Button>
            ))} */}
            {/* </Paper> */}
          </Paper>
          {/* <Group sx={{ p: 1, m: 1 }}>
            {channelList.map((channel: string, index: number) => (
              <Button
                key={index}
                size="md"
                // variant="outlined"
                color="primary"
              // endDecorator={<ChipDelete onClick={() => handleChannelUnsubscribe(index)} />}
              >{channel}</Button>
            ))}
          </Group> */}

        </Grid.Col>
        <Grid.Col md={6} lg={3}>

          <Title >Messages</Title>
          <Space h="xl" />
          <Paper radius="lg" p="lg" withBorder={true}>
            {messageHistory.length == 0 && <Text>No messages</Text>}

            {messageHistory.map((message: any, idx: number) => (
              <Container key={idx}>

                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Bummer!"
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
