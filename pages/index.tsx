import type { NextPage } from 'next'
import Head from 'next/head'

import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { json } from 'stream/consumers';
import { CssVarsProvider } from '@mui/joy/styles';
import { Sheet, Box, Chip, ChipDelete, Alert, Typography, Divider } from '@mui/joy';
import FormControl from '@mui/joy/FormControl';
import { TextField, Button, Input, FormHelperText, FormLabel } from '@mui/joy';


// TODO get from env
const socketUrl = 'ws://localhost:8081/ws';

function App() {
  return
}
const Home = () => {
  const defaultEmptyArrayOfStrings : string[] = [];
  const [messageHistory, setMessageHistory] = useState<any | null>(null);
  const [channel, setChannel] = useState('demo');
  const [channelList, setChannelList] = useState<any | null>(null);
  const [connected, setConnected] = useState(true);

  // create connection
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
    console.log(channel);
    const channels = channel.split(',')
    setChannelList(channels);
    sendMessage(JSON.stringify(channels))
  }, []);

  // update history on new message
  useEffect(() => {
    if (lastMessage !== null) {
      // message types
      // primary | neutral | info | success | warning | danger
      // TODO unpack json message and check message type 
      // if not found default to neutral
      // setMessageHistory((prev) => prev.concat(lastMessage));
      // setMessageHistory((prev) => [...prev, lastMessage]);
      const newHistory = [...messageHistory, lastMessage];
      setMessageHistory(newHistory);
    }
  }, [lastMessage, setMessageHistory]);

  // form handlers
  const handleSubscribe = function () {
    console.log(channel);
    let channels = channel.split(',')
    setChannelList(channels);
    sendMessage(JSON.stringify(channels))
  }

  const handleConnect = function () {
    setConnected(prevValue => !prevValue);
  }

  const handleChannelInput = function (e: { target: { name: any; value: any; type: any; checked: any; }; }) {
    const { name, value, type, checked } = e.target
    setChannel(value)
  }

  const handleChannelUnsubscribe = function() {
    alert('unsubscribed');
  }

  // connection status
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <CssVarsProvider>
      <Sheet sx={{
        maxWidth: 500,
        mx: 'auto',
        my: 4, 
        py: 3, 
        px: 2, 
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRadius: 'sm',
        backgroundColor: 'white'
      }}>
        <Divider component="div" role="presentation">
          <Typography sx={{ p: 1 }}>Connection {connectionStatus} </Typography>
          <Button
            onClick={handleConnect}
            variant="outlined" size="sm"
            color={connected ? 'danger' : 'primary'}
          >{connected ? 'Disconnect' : 'Connect'}</Button>
        </Divider>



        <FormControl>
          <Input type="text"
            placeholder="channel"
            name="channel"
            onChange={handleChannelInput}
            value={channel}
            variant="soft"
            size="lg" />
          <FormHelperText>One or more channels, Ex: demo, notify, global.</FormHelperText>
        </FormControl>

        <Button
          onClick={handleSubscribe}
          disabled={readyState !== ReadyState.OPEN}
          color="primary" variant="solid" size="lg"
        >Subscribe</Button>
        <Divider component="div" role="presentation">
          <Typography >Channels</Typography>
        </Divider>
        <Box sx={{ p: 1, m: 1 }}>
          {channelList.map((channel: string, index: number) => (
            <Chip
              key={index}
              size="md"
              variant="outlined"
              color="primary"
              endDecorator={<ChipDelete onClick={handleChannelUnsubscribe} />}
            >{channel}</Chip>
          ))}
        </Box>


        <Divider component="div" role="presentation">
          <Typography >Messages</Typography>
        </Divider>

        <Box sx={{ display: 'flex', gap: 2, width: '100%', flexDirection: 'column' }}>
          {messageHistory.map((message: any, idx: number) => (
            <Alert key={idx} variant="soft" color={JSON.parse(message.data).type}>
              {message ? JSON.parse(message.data).text : null}
            </Alert>
          ))}
        </Box>
      </Sheet>
    </CssVarsProvider>
  )
}

export default Home
