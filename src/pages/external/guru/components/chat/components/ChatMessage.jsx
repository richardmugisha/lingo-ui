import React from 'react';
import { Box, Avatar, Paper, Typography } from '@mui/material';
import { Person, SmartToy } from '@mui/icons-material';
import RichTextRenderer from './TextRender';

const ChatMessage = ({ message, isUser = false }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        // justifyContent: isUser ? 'flex-end' : '',
        textAlign: "justify",
        mb: 2,
        gap: 1,
        ml: isUser ? "auto" : 0,
      }}
    >
      {!isUser && (
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 32,
            height: 32
          }}
        >
          <SmartToy />
        </Avatar>
      )}
      
      <Paper
        elevation={1}
        sx={{
          p: 2,
          maxWidth: '70%',
          backgroundColor: isUser ? '#3f3f3f' : '#2c2d2d',
          color: '#fff',
          border: 'none',
          boxShadow: 'none',
          borderRadius: 2,
          position: 'relative'
        }}
      >
        <RichTextRenderer content={message.content} isUser={isUser} />
        
        <Typography
          variant="caption"
          sx={{
            color: '#fff',
            mt: 1,
            display: 'block',
            textAlign: isUser ? 'right' : 'left'
          }}
        >
          {/* {new Date(message.timestamp).toLocaleTimeString()} */}
        </Typography>
      </Paper>
      
      {isUser && (
        <Avatar
          sx={{
            bgcolor: 'secondary.main',
            width: 32,
            height: 32
          }}
        >
          <Person />
        </Avatar>
      )}
    </Box>
  );
};

export default ChatMessage; 