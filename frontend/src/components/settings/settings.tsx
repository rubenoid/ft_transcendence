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

const SettingsForm = () => {
    const [user, setUser] = useState<detailedUser>(undefined)
    const [image, setImage] = useState({ preview: "", raw: "" });
    const [file, setfile] = useState(undefined);
    const [blockedUsers, setblockedUsers] = useState<detailedUser[]>([]);
    const [isChecked, setIsChecked] = useState(undefined);
    const [qrcode, setqrcode] = useState<string>(undefined);
    const [initial2FAEnabled, setinitial2FAEnabled] = useState<boolean>(undefined);
    const [inputtedTwoFA, setinputtedTwoFA] = useState<string>(undefined);
    const [twoFAvalid, settwoFAvalid] = useState<boolean>(undefined);

    useEffect(() => {
        async function getQR(): Promise<string> {
        if (isChecked && !initial2FAEnabled)
            {           
            const endpoint = `auth/getQr`;
            const qrcodegot: string = await fetchData(endpoint);
            console.log("fetched: qrcode", qrcodegot);
            setqrcode(qrcodegot);
            console.log("QRCODE:", qrcode);
            return (qrcode);
            }
          if (!isChecked)
          {
            console.log("takeoff twofa")
            const endpoint = `user/removeTwoFA`;
            const qrcodegot: string = await fetchData(endpoint);
            return "done";
          }
        }
        getQR();
    }, [isChecked]);

    useEffect(() => {
        async function getUser(): Promise<User> {
            const user: detailedUser = await fetchData('/user/meAndFriends');
            setUser(user);
            if (user.twoFactorSecret.length == 0){
                setIsChecked(false);
                setinitial2FAEnabled(false);
            }
            else {
                setinitial2FAEnabled(true);
                setIsChecked(true);
            }
            let blockedarr: detailedUser[] = [];
            for (let blockeduser of user.blockedUsers)
            {
                const endpoint: string = `/user/get/${blockeduser}`;
                const blocked: detailedUser = await fetchData(endpoint);
                blockedarr.push(blocked);
            }
            setblockedUsers(blockedarr);
            return user;
        }
        getUser();
    }, []);

    const twoFAChange = () => {
        setIsChecked(!isChecked);
        if (!isChecked)
            setinputtedTwoFA(undefined);
      };

      useEffect(() => {
        async function inputAccessCode(): Promise<boolean> {
          if (inputtedTwoFA && inputtedTwoFA.length != 6)
            return;
          const endpoint = `/auth/inputAccessCode`;
          const validated: boolean = await postData(endpoint, {usertoken: inputtedTwoFA});
          if (validated == true)
          { 
            settwoFAvalid(true); 
            console.log("GOOD QR code inpute 2FA");
          }
          else
            console.log("BAD QR code input 2FA");
          return (validated);
        }
        inputAccessCode();
      }, [inputtedTwoFA]);

    const handleChange = (e: any) => {
        if (e.target.files.length) {
          setImage({
            preview: URL.createObjectURL(e.target.files[0]),
            raw: e.target.files[0],
          });
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

        const removefriend = async (id: number) => {
            const endpoint: string = `/friends/remove/${id}`;
            await fetchData(endpoint);
        };
        
        const listfriends = friendz.map((friendz, key: number) => {
            return( 
                <TableRow key = {key}>
                        <TableCell><Text fontSize='10'>{friendz.userName}</Text></TableCell>
                        <TableCell><Text fontSize='10'>{friendz.firstName}</Text></TableCell> 
                        <TableCell><Text fontSize='10'>{friendz.lastName}</Text></TableCell> 
                        <TableCell><Button onClick={(e) => {removefriend(friendz.id);}}><Text>Remove</Text></Button></TableCell> 
                </TableRow>
            );
        });

        const removeblocked = async (id: number) => {
            const endpoint: string = `/blocked/remove/${id}`;
            await fetchData(endpoint);
        };
        
        const listblockedusers = blockedUsers.map((blockedUsers, key: number) => {
            return( 
                <TableRow key = {key}>
                        <TableCell><Text fontSize='10'>{blockedUsers.userName}</Text></TableCell>
                        <TableCell><Text fontSize='10'>{blockedUsers.firstName}</Text></TableCell> 
                        <TableCell><Text fontSize='10'>{blockedUsers.lastName}</Text></TableCell> 
                        <TableCell><Button onClick={(e) => {removeblocked(blockedUsers.id);}}><Text>Remove</Text></Button></TableCell> 
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
                        :	(<ImgContainer>
								<Img src={image.preview} alt="dummy" width="300" height="300" />
                            </ImgContainer>)
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
                    <tbody>
                    { listblockedusers.length ? listblockedusers : <Item>No blocked users</Item>}
                    </tbody>
                    </Table>
                    </Item>
				<Item>
					<Label> <Text fontSize='20px'>Two Factor Authentication</Text></Label>
                    <input type="checkbox" checked={isChecked} onChange={twoFAChange}/>
                    {isChecked && !initial2FAEnabled ?
                        <Item>
                      <img src={qrcode} alt="" />
                      <a href="http://localhost:5000/auth/getQr" download="QRCode"></a>
                      <Label> <Text fontSize='20px'>Input2FA code pls</Text></Label><TextInput type='text' onChange={(e) => {setinputtedTwoFA(e.target.value)}}/></Item>  : ''} 
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
                    <tbody>
                        { user.friends.length ? listfriends : <Item>No friends</Item>}	
					</tbody>
                    </Table>
				</Item>
                {isChecked && !twoFAvalid && !initial2FAEnabled ? '' :
				<Button onClick={uploadDataForm}><Text fontSize='15px'><Link href="http://localhost:8080/">Save changes</Link></Text></Button>}
			</>
		)};
    return (
		<SettingsContainer>
            {user ? settingsData() : 'loading'}
        </SettingsContainer>
    );
}

export default SettingsForm;
