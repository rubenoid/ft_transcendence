import React, { useEffect, useState } from 'react';
import { SideBar } from './ChatSideBarElements';
import { List, Text, Item } from '../../Utils/Utils';
import { User, fetchData } from '../../../API/API';

const ChatSideBar = () => {

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
            <Item><Text>{user.userName}</Text></Item>
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
