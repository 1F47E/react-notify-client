import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

// get from env
const socketUrl = 'ws://localhost:8081/ws';

const Home: NextPage = () => {
  const [messageHistory, setMessageHistory] = useState([]);
  const [channel, setChannel] = useState('demo');
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);


  // subscribe on load
  useEffect(() => {
    sendMessage('["' + channel + '"]')
  }, []);

  // update history
  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  // handlers
  const handleClickSendMessage = useCallback(() => sendMessage('["' + channel + '"]'), []);

  const handleChannelChange = function(e: { target: { name: any; value: any; type: any; checked: any; }; }) {
    const { name, value, type, checked } = e.target
    console.log(value)
    setChannel(value)
  }


  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];
  return (
    <div>

      <input type="text" placeholder='channel name' value={channel} onChange={handleChannelChange} />
      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        subscribe
      </button>
      <h2>Connection: [{connectionStatus}]</h2>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <div>
        {messageHistory.map((message, idx) => (
          <div key={idx}>{message ? message.data : null}</div>
        ))}
      </div>
    </div>
  )
}

export default Home
