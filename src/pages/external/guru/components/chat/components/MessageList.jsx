import React, { useRef, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import ChatMessage from './ChatMessage';

const MessageList = ({ messages, isLoading = false }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'text.secondary'
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Start a conversation
        </Typography>
        <Typography variant="body2">
          Ask me anything and I'll help you out!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={message}
          isUser={message.role === 'user'}
        />
      ))}
      
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            mb: 2,
            gap: 1
          }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <CircularProgress size={16} />
            <Typography variant="body2" color="text.secondary">
              Thinking...
            </Typography>
          </Box>
        </Box>
      )}
      
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList;


