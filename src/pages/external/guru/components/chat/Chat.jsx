import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import { chatWithAI } from '../../../../../api/http';

const defaultAiMessage = `Here's a sample response with **rich formatting**:

# Main Heading
## Sub Heading

This is a paragraph with *italic text* and **bold text**.

- Bullet point 1
- Bullet point 2
- Bullet point 3

1. Numbered item 1
2. Numbered item 2

Here's some \`inline code\` and a code block:

\`\`\`javascript
function example() {
  console.log("Hello, World!");
  return "This is a code block";
}
\`\`\`

You can ask me anything and I'll respond with properly formatted text!`

const Chat = ({ currentChat, setCurrentChat }) => {
//   const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [{ username, userId: userID}] = useState(JSON.parse(localStorage.getItem("user")))

  const handleSendMessage = async (content) => {
    const userMessage = {
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    setCurrentChat(prev => ({
      ...prev,
      messages: [...(prev?.messages || []), userMessage]
    }));

    setIsLoading(true);

    chatWithAI({ userID, userMessage: content})
    .then(([res, err]) => {
      if (err) {
        console.error("Error chatting with AI:", err);
      } else {
        setCurrentChat(prev => ({
          ...prev,
          messages: [...(prev?.messages || []), res]
        }));
      }
      setIsLoading(false);
    })
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        bgcolor: 'grey.50'
      }}
    >
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          AI Chat Assistant
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ask me anything and I'll respond with rich, formatted text
        </Typography>
      </Paper>

      {/* Messages */}
      <MessageList messages={currentChat.messages || []} isLoading={isLoading} />

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </Box>
  );
};

export default Chat;