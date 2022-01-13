import React, {useState} from 'react';
import { ChatGrid, ChatContainer} from './ChatElements';
import { Text, TextInput, WidgetContainer } from '../Utils/Utils';
import { List, LongList, Item } from '../Utils/Utils';
import ChatBox from './ChatBox/ChatBox';
import ChatSideBar from './ChatSideBar/ChatSideBar';
import { User } from '../../API/API';

const Chat = () => {
    const [selectedUser, setSelectedUser] = useState<User>();
    console.log('SELECTED_USER->',selectedUser);

    return (
                <ChatGrid>
                    <ChatSideBar setSelectedUser={setSelectedUser}/>
                    { selectedUser ? <ChatBox chatWith={selectedUser}/> : '' }
                </ChatGrid>
    );
}

export default Chat;