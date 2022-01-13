import React, { useState, useEffect } from 'react';
import { TextContainer, WidgetContainer } from '../Utils/Utils';
import { ImgContainer, Img } from './ProfileElements';
import { Text } from '../Utils/Utils';
import { fetchData, User } from '../../API/API';
import { Button, Item } from '../Utils/Utils';
import { Label } from '../ConnectionForm/ConnectionFormElements';
import { postData } from '../../API/API';

const Profile = () => {

    const [user, setUser] = useState<User>(undefined);
    const [image, setImage] = useState({ preview: "", raw: "" });
    const [file, setfile] = useState(undefined);

    useEffect(() => {
        async function getUser(): Promise<User> {
            const user: User = await fetchData('/user/me');
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
          setfile(e.target.files[0]);
        }
      };
    
      const handleUpload = async (e: any) => {
        e.preventDefault();
        console.log("in handle upload");
        var imageType = /image.*/;
        if (!file.type.match(imageType))
            return;
        var formData = new FormData();
        console.log("mid handleupload", image.raw);
        formData.append("file", file);
        // console.log("formData handleupload", formData);
        formData.forEach((value, key) => {
            console.log(value, key);
        });

        await postData("/user/uploadAvatar", formData, {'Content-Type': 'multipart/form-data'});
        console.log("upload gone through");
      };

    const userInfo = () => {
        return (
            <>
                <Text>{user.userName}</Text>
                <Text>{user.firstName}</Text>
                <Text>{user.lastName}</Text>
                <ImgContainer>
                    <Img src={'http://localhost:5000/' + user.avatar} alt='profileImg'/>
                </ImgContainer>
                <Item>
                    <Label htmlFor="upload-button">
                        {image.preview ? '' //(  <img src={image.preview} alt="dummy" width="300" height="300" />) 
                            : (<Text>Select your photo for upload</Text>)}
                    </Label>
                    <input type="file" id="upload-button" style={{ display: "none" }} 
                    onChange={handleChange}/>
                    <Button onClick={handleUpload}>Upload</Button>
                </Item>
            </>
        )
    }
    return (
        <WidgetContainer>
            {user ? userInfo() : 'loading'}
        </WidgetContainer>
    );
}

export default Profile;