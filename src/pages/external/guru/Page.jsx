import React, { useState } from 'react'
import Sidebar from './components/sidebar/Sidebar'
import Chat from './components/chat/Chat'
import './Page.css'

const Page = () => {
    const [messages, setMessages] = useState([])
  return (
    <div className='guru-page'>
      <Sidebar messages={messages} setMessages={setMessages}/>
      <Chat messages={messages} setMessages={setMessages}/>
    </div>
  )
}

export default Page;