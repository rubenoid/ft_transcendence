import React, {useEffect, useState} from 'react';
import { TextInput, Text, WidgetContainer, Button } from '../Utils/Utils';
import { RoundButton, Link, Item } from '../Utils/Utils';
import { fetchData, postData, User } from '../../API/API';
import { SettingsContainer, UsersContainer } from './SettingsElements';
import { Label } from '../ConnectionForm/ConnectionFormElements';
import { Img, ImgContainer } from '../Profile/ProfileElements';


interface detailedUser extends User {
	twoFactorSecret: string;
}

const SettingsForm = () => {
    const [user, setUser] = useState<detailedUser>(undefined)
    const [image, setImage] = useState({ preview: "", raw: "" });
    const [file, setfile] = useState(undefined);

    useEffect(() => {
        async function getUser(): Promise<User> {
            const user: detailedUser = await fetchData('/user/me');
            setUser(user);
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
				{/* <Item>
					<Label> <Text fontSize='20px'>Avatar</Text></Label>
					<Button><Text fontSize='15px'><Link href="http://localhost:8080/profile">Upload</Link></Text></Button>
				</Item> */}
				<Item>
					<Label> <Text fontSize='20px'>Blocked users</Text></Label>
					<UsersContainer>
						<a>avan-dam</a>
						<br />
						<a>okruitho</a>
					</UsersContainer>
				</Item>
				<Item>
					<Label> <Text fontSize='20px'>Two Factor Authentication</Text></Label>
                    {user.twoFactorSecret.length ? <input type="checkbox" checked/> : <input type="checkbox"/>}
				</Item>
				<Item>
					<Label> <Text fontSize='20px'>Friends</Text></Label>
					<UsersContainer>
						<a>avan-dam</a>
						<br />
						<a>okruitho</a>
					</UsersContainer>
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
