import React from 'react';
import { ChatGrid, ChatContainer} from './ChatElements';
import { Text, TextInput, WidgetContainer } from '../Utils/Utils';
import { List, LongList, Item } from '../Utils/Utils';
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