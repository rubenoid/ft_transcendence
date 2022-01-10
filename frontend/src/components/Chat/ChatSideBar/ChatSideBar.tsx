import React, { useState, useEffect} from 'react';
import { SideBar, ChatBody, ChatCard } from './ChatSideBarElements';


import { List, LongList, Text, Item, TableRow, TableCell } from '../../Utils/Utils';
import { fetchData, User } from '../../../API/API';

const ChatSideBar = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        async function getUsers(): Promise<User[]> {
            const users: User[] = await fetchData('/user/all');
            setUsers(users);
            return users;
        }
        getUsers();
    }, []);

    function openChat(data:any) {
        console.log(data);
    }

    const listUsers = users.map((user: User, key: number) => {
        return( 
            <ChatCard key = {key} onClick={() => openChat(user.id)}>
                <Text color='black' fontSize='10' >{user.userName}</Text>
            </ChatCard>
        );
    });
    return (
        <SideBar>
            <List>
                <h4>Chats</h4>

                <ChatBody>
                    { listUsers ? listUsers : <Item>Loading</Item>}
                </ChatBody>
            </List>
        </SideBar>
    )
}

export default ChatSideBar
