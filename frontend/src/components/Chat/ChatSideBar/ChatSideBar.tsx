import React, { useEffect, useState } from 'react';
import { SideBar } from './ChatSideBarElements';
import { List, Button, Item } from '../../Utils/Utils';
import { User, fetchData } from '../../../API/API';

type ChatSideBarProps = {
    setSelectedUser: React.Dispatch<React.SetStateAction<User>>
}

const ChatSideBar = (props: ChatSideBarProps) => {
    const [friends, setFriends] = useState<User[]>([]);

    useEffect(() => {
        async function getFriends(): Promise<User[]> {
            const friends: User[] = await fetchData('/friends/me');
            console.log('USERS->', friends);
            setFriends(friends);
            return friends;
        }
        getFriends();
    }, [fetchData]);

    const listFriends = friends.map((user: User, key: number) => {
        return( 
            <Item key={user.id}><Button onClick={()=>{props.setSelectedUser(user)}}>{user.userName}</Button></Item>
        );
    });

    return (
        <SideBar>
            <List>
                { friends ? listFriends : 'No Friends Yet, Add one !'}
            </List>
        </SideBar>
    );
}

export default ChatSideBar;
