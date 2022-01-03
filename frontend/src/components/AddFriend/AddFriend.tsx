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
            <Text>Search for User</Text>
                <TextInput type="text" placeholder="Type to search..." onChange={(e) => setUserName(e.target.value)}></TextInput>
            <Text>{user && user.userName == userName ? user.userName : ''}</Text>
        </WidgetContainer>
    );
}

export default AddFriend;
