import React from 'react'
import { ChatHistoryContainer } from './ChatHistoryElements';
import { Text } from '../../Utils/Text/Text';

const ChatHistory = () => {
    return (
        <ChatHistoryContainer>
                <Text color="black">Send your first message !</Text>
        </ChatHistoryContainer>
    )
}

export default ChatHistory
