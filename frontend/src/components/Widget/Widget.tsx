import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from './WidgetElements';
import { fetchUsers, User } from '../../API/API';
import { List, LongList, Item } from '../Utils/Utils';
import { Text, Table, TableHeaderCell, TableBody, TableRow, TableHeader, TableCell } from '../Utils/Utils'


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
        console.log(user.userName)
        return <TableRow>
                    <TableCell><Text fontSize='10'>{user.id}</Text></TableCell>
                    <TableCell><Text fontSize='10'>{user.userName}</Text></TableCell>
                    <TableCell><Text fontSize='10'>{user.wins}</Text></TableCell> 
                    <TableCell><Text fontSize='10'>{user.losses}</Text></TableCell> 
            </TableRow> 
    });
    return (
        <WidgetWrapper>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>id</TableHeaderCell>
                        <TableHeaderCell>username</TableHeaderCell>
                        <TableHeaderCell>wins</TableHeaderCell>
                        <TableHeaderCell>losses</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                    { listUsers ? listUsers : <Item>Loading</Item>}
            </Table>
        </WidgetWrapper>
    );
}

export default Widget;
