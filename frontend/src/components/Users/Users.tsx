import React, { useState, useEffect } from 'react';
import { fetchData, User } from '../../API/API';
import { Item, WidgetContainer, TextContainer } from '../Utils/Utils';
import { Text, Table, TableHeaderCell, TableBody, TableRow, TableHeader, TableCell } from '../Utils/Utils'


const Users = () => {

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        async function getUsers(): Promise<User[]> {
            const users: User[] = await fetchData('/user/all');
            console.log('USERS->', users);
            setUsers(users);
            return users;
        }
        getUsers();
    }, [fetchData]);

    const listUsers = users.map((user: User, key: number) => {
        return( 
            <TableRow key = {key}>
                    <TableCell><Text fontSize='10'>{user.id}</Text></TableCell>
                    <TableCell><Text fontSize='10'>{user.userName}</Text></TableCell>
                    <TableCell><Text fontSize='10'>{user.wins}</Text></TableCell> 
                    <TableCell><Text fontSize='10'>{user.losses}</Text></TableCell> 
            </TableRow>
        );
    });

    return (
        <WidgetContainer>
            <TextContainer>
                <Text>Users</Text>
            </TextContainer>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>id</TableHeaderCell>
                        <TableHeaderCell>username</TableHeaderCell>
                        <TableHeaderCell>wins</TableHeaderCell>
                        <TableHeaderCell>losses</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    { listUsers ? listUsers : <Item>Loading</Item>}
                </TableBody>
            </Table>
        </WidgetContainer>
    );
}

export default Users;
