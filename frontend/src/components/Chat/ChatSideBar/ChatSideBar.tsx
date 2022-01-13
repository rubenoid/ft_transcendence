import React, { useState, useEffect} from 'react';
import { SideBar, ChatBody, ChatCard, CreateChatContainer } from './ChatSideBarElements';
import { List, LongList, Text, Item, TableRow, TableCell, Button, TextInput } from '../../Utils/Utils';
import { fetchData, User } from '../../../API/API';
import ChatBox from '../ChatBox/ChatBox';
import setUserChat from '../ChatBox/ChatBox';
import { useBetween } from 'use-between';
import { chatState } from '../ChatState';

const ChatSideBar = () => {

    const {otherUser, setUser} = useBetween(chatState);
    const [users, setUsers] = useState<User[]>([]);
    const [chatUsers, setChatUsers] = useState<string>('');
    const [userFound, setUserfound] = useState<boolean>(false);

    useEffect(() => {
        async function getUsers(): Promise<User[]> {
            const users: User[] = await fetchData('/user/all');
            setUsers(users);
            return users;
        }
        getUsers();
    }, []);

    async function changeChat(id: number) {
        const user: User = await fetchData(`/user/get/${id}`);
        setUser(user);
        console.log("Set user!");
    }

    const listUsers = users.map((user: User, key: number) => {
        return( 
            <ChatCard key = {key} onClick={() => changeChat(user.id)}>
                <Text color='black' fontSize='10' >{user.userName}</Text>
            </ChatCard>
        );
    });

    useEffect(() => {
        async function getChatUsers(): Promise<User> {
	        const endpoint = `/user/getByUserName/${chatUsers}`;
            const user: User = await fetchData(endpoint);
            if (user)
                setUserfound(true);
            else
                setUserfound(false);
            return user;
        }
        getChatUsers();
    }, [chatUsers]);

    const StartChatDialog = () => {
        return (
            <CreateChatContainer>
                <Button>Start Chat</Button>
            </CreateChatContainer>
        );
    };

    return (
        <SideBar>
            <h4>Chats</h4>
            <TextInput type="text" placeholder='Create new chat' onChange={(e) => setChatUsers(e.target.value)}></TextInput>
            {userFound ? StartChatDialog() : ''}
            <ChatBody>
                { listUsers ? listUsers : <Item>Loading</Item>}
            </ChatBody>
        </SideBar>
    )
}

export default ChatSideBar
