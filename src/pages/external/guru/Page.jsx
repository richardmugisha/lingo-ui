import React, { useState } from 'react'
import Sidebar from './components/sidebar/Sidebar'
import Chat from './components/chat/Chat'
import './Page.css'

const Page = () => {
    const [currentChat, setCurrentChat] = useState(null)
  return (
    <div className='guru-page'>
      <Sidebar currentChat={currentChat} setCurrentChat={setCurrentChat}/>
      {
        currentChat &&
          <Chat currentChat={currentChat} setCurrentChat={setCurrentChat}/>
      }
    </div>
  )
}

export default Page;