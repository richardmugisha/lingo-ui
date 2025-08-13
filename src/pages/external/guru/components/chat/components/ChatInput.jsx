import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';

const ChatInput = ({ focus, onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);
  useEffect(() => {
    if (focus && inputRef.current) {
      // For MUI TextField, focus the input element
      inputRef.current?.focus()
    }
  }, [focus]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        backgroundColor: '#2c2d2d',
        position: 'relative',
        zIndex: 1
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={disabled}
          variant="outlined"
          size="small"
          autoFocus
          inputRef={inputRef}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: '#2c2d2d',
              color: '#FFFFFF',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#363737'
                }
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3d3d3d',
                  borderWidth: 2
                }
              }
            },
            '& .MuiInputBase-input': {
              cursor: 'text'
            }
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          color="primary"
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark'
            },
            '&:disabled': {
              bgcolor: 'grey.300',
              color: 'grey.500'
            }
          }}
        >
          <Send />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatInput;