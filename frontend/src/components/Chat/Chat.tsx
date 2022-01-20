import React, {useState} from 'react';
import { ChatGrid } from './ChatElements';
import ChatBox from './ChatBox/ChatBox';
import ChatSideBar from './ChatSideBar/ChatSideBar';
import { Channel, User, Message } from '../../Types/Types';

const Chat = (): JSX.Element => {
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