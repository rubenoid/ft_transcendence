import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from './WidgetElements';
import { fetchUsers, User } from '../../API/API';
import { List, LongList, Item } from '../Utils/Utils';



const Widget = () => {

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        async function getUsers(): Promise<User[]> {
            const users: User[] = await fetchUsers();
            setUsers(users);
            return users;
        }
        getUsers();
    }, [fetchUsers]);

    console.log('USERS');
    console.log(users);
    const listUsers = users.map((user: User, key: number) => {
        console.log('FIRSTNAME')
        console.log(user.firstName)
        return <Item key={key}>{user.firstName}</Item>;
    });
    return (
        <WidgetWrapper>
            <List>
                {listUsers != undefined ? listUsers : <Item>Loading</Item>}
            </List>
        </WidgetWrapper>
    );
}

export default Widget;
