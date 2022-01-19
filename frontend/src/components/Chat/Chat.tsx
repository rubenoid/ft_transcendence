import React, {useState} from 'react';
import { ChatGrid } from './ChatElements';
import ChatBox from './ChatBox/ChatBox';
import ChatSideBar from './ChatSideBar/ChatSideBar';
import { User } from '../../API/API';

export interface Message {
    data: string;
    senderId: number;
}

export interface Channel {
    id: number;
    name: string;
    users: User[];
    messages: Message[];
}

const Chat = () => {
    const [selectedUser, setSelectedUser] = useState<Channel>();
    console.log('SELECTED_USER->',selectedUser);

    return (
                <ChatGrid>
                    <ChatSideBar setSelectedUser={setSelectedUser}/>
                    { selectedUser ? <ChatBox chatWith={selectedUser}/> : '' }
                </ChatGrid>
    );
}

export default Chat;