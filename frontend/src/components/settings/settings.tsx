import React, {useEffect, useState} from 'react';
import { TextInput, Text, WidgetContainer, Button, TableRow, TableCell, TableHeader, TableHeaderCell, Table } from '../Utils/Utils';
import { RoundButton, Link, Item } from '../Utils/Utils';
import { fetchData, postData, User } from '../../API/API';
import { SettingsContainer, UsersContainer } from './SettingsElements';
import { Label } from '../ConnectionForm/ConnectionFormElements';
import { Img, ImgContainer } from '../Profile/ProfileElements';


interface detailedUser extends User {
	twoFactorSecret: string,
    blockedUsers: number[],
}

interface friends {
	id: string;
    userName: string,
    firstName: string,
    lastName: string,
    avatar: string,
    wins: string,
    losses: string,
    rating: string,
    registered: boolean,
    twoFactorSecret: string,
    twoFactorvalid: boolean,
    blockedUsers: number[],
    blockedBy: number[],
}

const SettingsForm = () => {
    const [user, setUser] = useState<detailedUser>(undefined)
    const [image, setImage] = useState({ preview: "", raw: "" });
    const [file, setfile] = useState(undefined);
    const [blockedUsers, setblockedUsers] = useState<detailedUser[]>([]);

    useEffect(() => {
        async function getUser(): Promise<User> {
            const user: detailedUser = await fetchData('/user/meAndFriends');
            setUser(user);
            let blockedarr: detailedUser[] = [];
            for (let blockeduser of user.blockedUsers)
            {
                const endpoint: string = `/user/get/${blockeduser}`;
                console.log("endpoint", endpoint);
                const blocked: detailedUser = await fetchData(endpoint);
                console.log("blocked", blocked);
                blockedarr.push(blocked);
                console.log("blockedarr", blockedarr);
            }
            setblockedUsers(blockedarr);
            console.log("blockedUsers IS1:", blockedUsers);
            return user;
        }
        getUser();
    }, []);

    const handleChange = (e: any) => {
        if (e.target.files.length) {
          setImage({
            preview: URL.createObjectURL(e.target.files[0]),
            raw: e.target.files[0],
          });
          console.log("image.preview", image.preview);
          console.log("user.avatar", user.avatar);
          setfile(e.target.files[0]);
        }
      };
    

	const uploadDataForm= async (e: any) => {
        var formData = new FormData();


		formData.append("user", JSON.stringify(user));
		formData.append("file", file);

        await postData("/user/updateForm", formData, {'Content-Type': 'multipart/form-data'});
	};

	const settingsData = () => {
        const friendz = user.friends;
        const blocked = user.blockedUsers;
        const listfriends = friendz.map((friendz, key: number) => {
            return( 
                <TableRow key = {key}>
                        <TableCell><Text fontSize='10'>{friendz.userName}</Text></TableCell>
                        <TableCell><Text fontSize='10'>{friendz.firstName}</Text></TableCell> 
                        <TableCell><Text fontSize='10'>{friendz.lastName}</Text></TableCell> 
                        <TableCell><Button><Text>Remove</Text></Button></TableCell> 
                </TableRow>
            );
        });
        
        const listblockedusers = blockedUsers.map((blockedUsers, key: number) => {
            return( 
                <TableRow key = {key}>
                        <TableCell><Text fontSize='10'>{blockedUsers.userName}</Text></TableCell>
                        <TableCell><Text fontSize='10'>{blockedUsers.firstName}</Text></TableCell> 
                        <TableCell><Text fontSize='10'>{blockedUsers.lastName}</Text></TableCell> 
                        <TableCell><Button><Text>Remove</Text></Button></TableCell> 
                </TableRow>
            );
        });
		return (
			<>
				<h1>Settings</h1>

				<Item>
				<Label> <Text fontSize='20px'>Username</Text></Label>
					<TextInput type='text'placeholder={user.userName} onChange={(e) => {setUser({...user, userName: e.target.value})}}/>
				</Item>
				<Item>
				<Label> <Text fontSize='20px'>FirstName</Text></Label>
					<TextInput type='text' placeholder={user.firstName} onChange={(e) => {setUser({...user, firstName: e.target.value})}}/>
					</Item>
				<Item>
					<Label> <Text fontSize='20px'>Lastname</Text></Label>
					<TextInput type='text' placeholder={user.lastName} onChange={(e) => {setUser({...user, lastName: e.target.value})}}/>
				</Item>
                <Item>
                    <Label htmlFor="upload-button">
                    {!image.preview ? (
                        <div>
							<ImgContainer>
								<Img src={'http://localhost:5000/' + user.avatar} alt='profileImg' width="300" height="300"/>
                        	</ImgContainer>
							<Text>Select your photo for upload</Text>
						</div>
							) 
                        :	(
                            <ImgContainer>
								<Img src={image.preview} alt="dummy" width="300" height="300" />
                            </ImgContainer>
							)
					}
                    </Label>
                    <input type="file" id="upload-button" style={{ display: "none" }} 
                    onChange={handleChange}/>
                </Item>
				<Item>
					<Label> <Text fontSize='20px'>Blocked users</Text></Label>
                    <Table>
					{ listblockedusers.length ?
                    <TableHeader><TableRow>
                        <TableHeaderCell>Username</TableHeaderCell>
                        <TableHeaderCell>First Name</TableHeaderCell>
                        <TableHeaderCell>Last Name</TableHeaderCell>
                        <TableHeaderCell>Edit</TableHeaderCell>
                    </TableRow></TableHeader> : ''}
                    { listblockedusers.length ? listblockedusers : <Item>No blocked users</Item>}
                     </Table> 	
                    </Item>
				<Item>
					<Label> <Text fontSize='20px'>Two Factor Authentication</Text></Label>
                    {user.twoFactorSecret.length ? <input type="checkbox" checked/> : <input type="checkbox"/>}
				</Item>
				<Item>
					<Label> <Text fontSize='20px'>Friends</Text></Label>
					<Table>
                    { user.friends.length ?
                    <TableHeader><TableRow>
                        <TableHeaderCell>Username</TableHeaderCell>
                        <TableHeaderCell>First Name</TableHeaderCell>
                        <TableHeaderCell>Last Name</TableHeaderCell>
                        <TableHeaderCell>Edit</TableHeaderCell>
                    </TableRow></TableHeader> : ''}
                        { user.friends.length ? listfriends : <Item>No friends</Item>}	
					</Table>
				</Item>

				<Button onClick={uploadDataForm}><Text fontSize='15px'><Link>Save changes</Link></Text></Button>
			</>
		)};
    return (
		<SettingsContainer>
            {user ? settingsData() : 'loading'}
        </SettingsContainer>
    );
}

export default SettingsForm;
