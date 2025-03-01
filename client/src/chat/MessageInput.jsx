// components/MessageInput.jsx
import { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';
import { useChat } from '../contexts/ChatContext';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { sendMessage } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage('');
  };

  return (
    <Box component="form" display="flex" p={2} sx={{ bottom: '0px' }} position="absolute" width="70%">
      <TextField
        sx={{ width: '80%' }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <IconButton type="submit" onClick={handleSubmit}>
        <Send />
      </IconButton>
    </Box>
  );
};

export default MessageInput;