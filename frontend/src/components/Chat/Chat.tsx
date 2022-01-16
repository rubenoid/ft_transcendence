import React from 'react';
import { ChatGrid, ChatContainer} from './ChatElements';
import ChatBox from './ChatBox/ChatBox';
import ChatSideBar from './ChatSideBar/ChatSideBar';

const Chat = () => {
    return (
                <ChatGrid>
                    <ChatSideBar/>
                    <ChatBox/>
                </ChatGrid>
    );
}

export default Chat;