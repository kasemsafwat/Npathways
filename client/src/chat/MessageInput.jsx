// components/MessageInput.jsx
import { useState } from 'react';
import { Box, TextField, IconButton, Paper } from '@mui/material';
import { Send, AttachFile, EmojiEmotions } from '@mui/icons-material';
import { useChat } from '../contexts/ChatContext';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { sendMessage } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        p: 1,
        m: 2,
        borderRadius: '24px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      }}
      elevation={1}
    >
      <IconButton size="small" sx={{ color: 'text.secondary' }}>
        <AttachFile />
      </IconButton>
      
      <TextField
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        variant="standard"
        InputProps={{ disableUnderline: true }}
        sx={{ ml: 1, mr: 1 }}
      />
      
      <IconButton size="small" sx={{ color: 'text.secondary' }}>
        <EmojiEmotions />
      </IconButton>
      
      <IconButton 
        type="submit" 
        color="primary"
        disabled={!message.trim()}
        sx={{ 
          bgcolor: '#7678ee',
          color: 'white',
          '&:hover': {
            bgcolor: '#6567dd',
          },
          '&.Mui-disabled': {
            bgcolor: '#e0e0e0',
          }
        }}
      >
        <Send />
      </IconButton>
    </Paper>
  );
};

export default MessageInput;