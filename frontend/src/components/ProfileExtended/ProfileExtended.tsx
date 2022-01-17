import React, {useEffect, useState} from 'react';
import { TextInput, Text, WidgetContainer, Button, TableRow, TableCell, TableHeader, TableHeaderCell, Table, TextContainer } from '../Utils/Utils';
import { RoundButton, Item } from '../Utils/Utils';
import { fetchData, postData, User, Match } from '../../API/API';
import { SettingsContainer, UsersContainer } from '../settings/SettingsElements';
import { Label } from '../ConnectionForm/ConnectionFormElements';
import { Img, ImgContainer, TopContainer } from '../Profile/ProfileElements';
import { SearchResultContainer } from '../AddFriend/AddFriendElements';
import { Link, useNavigate } from 'react-router-dom';


interface detailedUser extends User {
	twoFactorSecret: string,
    blockedUsers: number[],
    blockedUsersAsUsers: detailedUser[],
	twoFAEnabled: boolean;
    matches: Match[],
}

const ProfileExtended = () => {
	const navigator = useNavigate();
	const [user, setUser] = useState<detailedUser>(undefined)


    useEffect(() => {
        async function getUser(): Promise<User> {
            const user: detailedUser = await fetchData('/user/meAndFriends');
            if (user.twoFactorSecret.length == 0) {
                user.twoFAEnabled = false;
            }
            else {
                user.twoFAEnabled = true;
            }
            user.blockedUsersAsUsers = [];
            user.matches = [];
            for (let blockeduser of user.blockedUsers)
            {
                const endpoint: string = `/user/get/${blockeduser}`;
                user.blockedUsersAsUsers.push(await fetchData(endpoint));
            }
            user.matches = await fetchData('/match/getMyUserHistory');
            console.log("USER IS", user);
            console.log("user.matches IS", user.matches);
            setUser(user);
            return user;
        }
        getUser();
    }, []);

	const settingsData = () => {

        const friendz = user.friends;
        const blocked = user.blockedUsersAsUsers;
        const matches = user.matches;

        const listfriends = friendz.map((friendz, key: number) => {
            return( 
                <TableRow key = {key}>
                        <TableCell><Text fontSize='10'>{friendz.userName}</Text></TableCell>
                        <TableCell><Text fontSize='10'>{friendz.firstName}</Text></TableCell> 
                        <TableCell><Text fontSize='10'>{friendz.lastName}</Text></TableCell> 
                </TableRow>
            );
        });

        const listblockedusers = blocked.map((blocked, key: number) => {
            return( 
                <TableRow key = {key}>
                        <TableCell><Text fontSize='10'>{blocked.userName}</Text></TableCell>
                        <TableCell><Text fontSize='10'>{blocked.firstName}</Text></TableCell> 
                        <TableCell><Text fontSize='10'>{blocked.lastName}</Text></TableCell> 
                </TableRow>
            );
        });

        const listmatches = matches.map((matches, key: number) => {
            return( 
                <TableRow key = {key}>
                        {matches.players[0].userName == user.userName && matches.players[1] ?
                            <TableCell><Text fontSize='10'>{matches.players[1].userName}</Text></TableCell>
                            : ''
                        }
                        {matches.players[0].userName != user.userName && matches.players[1] ?
                            <TableCell><Text fontSize='10'>{matches.players[1].userName}</Text></TableCell>
                            : ''
                        }
                        {!matches.players[1] ?
                            <TableCell></TableCell>
                            : ''
                        }
                        <TableCell>
                            { matches.players[0].userName == user.userName ? 
                            <Text fontSize='10'>{matches.scorePlayer1}</Text>
                            : 
                            <Text fontSize='10'>{matches.scorePlayer2}</Text>
                        }
                        </TableCell>
                        <TableCell>
                            { matches.players[0].userName == user.userName ? 
                            <Text fontSize='10'>{matches.scorePlayer2}</Text>
                            : 
                            <Text fontSize='10'>{matches.scorePlayer1}</Text>
                        }
                        </TableCell>
                </TableRow>
            );
        });

		return (
			<>
                <Item>
				    <h1>Profile</h1>
                </Item>
                <ImgContainer>
						<Img src={'http://localhost:5000/' + user.avatar} alt='profileImg' width="300" height="300"/>
                </ImgContainer>
                <TopContainer>
				    <Label> <Text fontSize='20px'>Username</Text></Label>
                    <Text fontSize='20px'>{user.userName}</Text>
                </TopContainer>
                <TopContainer>
				    <Label> <Text fontSize='20px'>FirstName</Text></Label>
                    <Text fontSize='20px'>{user.firstName}</Text>
                </TopContainer>
                <TopContainer>
				    <Label> <Text fontSize='20px'>LastName</Text></Label>
                    <Text fontSize='20px'>{user.lastName}</Text>
                </TopContainer>
                <TopContainer>
				    <Label> <Text fontSize='20px'>losses</Text></Label>
                    <Text fontSize='20px'>{user.losses}</Text>
                </TopContainer>
                <TopContainer>
				    <Label> <Text fontSize='20px'>wins</Text></Label>
                    <Text fontSize='20px'>{user.wins}</Text>
                </TopContainer>
                <TopContainer>
				    <Label> <Text fontSize='20px'>rating</Text></Label>
                    <Text fontSize='20px'>{user.rating}</Text>
                </TopContainer>
				<Item>
					<Label> <Text fontSize='20px'>Blocked users</Text></Label>
					<Table>
					{ listblockedusers.length ?
                    <TableHeader><TableRow>
                        <TableHeaderCell>Username</TableHeaderCell>
                        <TableHeaderCell>First Name</TableHeaderCell>
                        <TableHeaderCell>Last Name</TableHeaderCell>
                    </TableRow></TableHeader> : ''}
                    <tbody>
                    { listblockedusers.length ? listblockedusers : <Item>No blocked users</Item>}
                    </tbody>
                    </Table>
                    </Item>
				<Item>
                    <TopContainer>
					    <Label> <Text fontSize='20px'>Two Factor Authentication</Text></Label>
                        {user.twoFAEnabled ? <Text>Yes</Text> : <Text>No</Text>}
                    </TopContainer>
				</Item>
				<Item>
					<Label> <Text fontSize='20px'>Friends</Text></Label>
					<Table>
						{ user.friends.length ?
							<TableHeader><TableRow>
								<TableHeaderCell>Username</TableHeaderCell>
								<TableHeaderCell>First Name</TableHeaderCell>
								<TableHeaderCell>Last Name</TableHeaderCell>
							</TableRow></TableHeader> : ''}
							<tbody>
								{ user.friends.length ? listfriends : <Item>No friends</Item>}	
							</tbody>
                    </Table>
					</Item>
                    <Label> <Text fontSize='20px'>Macthes</Text></Label>
					<Table>
						{ user.matches.length ?
							<TableHeader><TableRow>
								<TableHeaderCell>Played Against</TableHeaderCell>
								<TableHeaderCell>score P1</TableHeaderCell>
								<TableHeaderCell>score P2</TableHeaderCell>
							</TableRow></TableHeader> : ''}
							<tbody>
								{ user.matches.length ? listmatches : <Item>No matches</Item>}	
							</tbody>
                    </Table>
			</>
		)};
		return (
			<SettingsContainer>
				{user ? settingsData() : 'loading'}
			</SettingsContainer>
		);
}

export default ProfileExtended;
