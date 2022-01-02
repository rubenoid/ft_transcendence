import React, { useState, useEffect } from 'react';
import { Item, TextInput ,Text, Button, WidgetContainer } from '../Utils/Utils';
import { fetchUserByUserName, User } from '../../API/API';

const AddFriend = () => {
    
    const [user, setUser] = useState<User>();
    const [userName, setUserName] = useState<string>('');

    useEffect(() => {
        async function getUsers(): Promise<User> {
            const user: User = await fetchUserByUserName(userName);
            console.log('USER');
            console.log(user);
            if (user)
                setUser(user);
            return user;
        }
        getUsers();
    }, [userName]);
    console.log(user);
    console.log('UserName->' + userName);

    return (
        <WidgetContainer>
            <Item><Text>User Manager</Text></Item>
            <Item>
                <TextInput type="text" placeholder="Type to search..." onChange={(e) => setUserName(e.target.value)}></TextInput>
            </Item>
            <Item><Text>{user ? user.userName : ''}</Text></Item> 
            <Item>
                <Button><Text fontSize='20px'>Search</Text></Button>
            </Item>
        </WidgetContainer>
    );
}

export default AddFriend;
