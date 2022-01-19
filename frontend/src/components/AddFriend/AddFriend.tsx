import React, { useState, useEffect } from 'react';
import { WidgetContainer } from '../Utils/Containers/Containers';
import { Button } from '../Utils/Buttons/Button/Button';
import { fetchData } from '../../API/API';
import { SearchResultContainer } from './AddFriendElements';
import { TextInput } from '../Utils/TextInput/TextInput';
import { Text } from '../Utils/Text/Text';
import { User } from '../../Types/Types';

const AddFriend = () => {
    
    const [user, setUser] = useState<User>();
    const [userName, setUserName] = useState<string>('');

    useEffect(() => {
        async function getUsers(): Promise<User> {
	        const endpoint: string = `/user/getByUserName/${userName}`;
            const user: User = await fetchData(endpoint);
            if (user)
                setUser(user);
            return user;
        }
        getUsers();
    }, [userName]);
    console.log(user);
    console.log('UserName->' + userName);

    const addFriend = async (id: number) => {
        const endpoint: string = `/friends/add/${id}`;
        await fetchData(endpoint);
    };

    const SearchResult = () => {
        return (
            <SearchResultContainer>
                <Text>{user.userName}</Text>
                <Button onClick={(e) => {addFriend(user.id);}}>Add</Button>
            </SearchResultContainer>
        );
    }


    return (
        <WidgetContainer>
                <Text>Search for User</Text>
                <TextInput type="text" placeholder="Type to search..." onChange={(e) => setUserName(e.target.value)}></TextInput>
                {user && user.userName == userName ? SearchResult() : ''}
        </WidgetContainer>
    ); 
}

export default AddFriend;
