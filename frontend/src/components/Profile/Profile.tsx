import React, { useState, useEffect,  } from 'react';
import { WidgetContainer } from '../Utils/Utils';
import { ImgContainer, Img, TopContainer } from './ProfileElements';
import { fetchData, User } from '../../API/API';
import { Button } from '../Utils/Utils';
import { useNavigate, Link } from 'react-router-dom';
import { RoundButton } from '../Utils/Buttons/Round/RoundButton';
import { Text } from '../Utils/Text/Text';

function delete_cookie( name: string, path: string | undefined, domain: string | undefined ) {
    if( get_cookie( name ) ) {
        document.cookie = name + "=" +
        ((path) ? ";path="+path:"")+
        ((domain)?";domain="+domain:"") +
        ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}
    
function get_cookie(name: string){
    return document.cookie.split(';').some(c => {
        return c.trim().startsWith(name + '=');
    });
}

const Profile = () => {

    const navigate = useNavigate();
    const [user, setUser] = useState<User>(undefined);
    // const [image, setImage] = useState({ preview: "", raw: "" });
    // const [file, setfile] = useState(undefined);

    useEffect(() => {
        async function getUser(): Promise<User> {
            const user: User = await fetchData('/user/me');
            setUser(user);
            return user;
            
        }
        getUser();
    }, []);

    // const handleChange = (e: any) => {
    //     if (e.target.files.length) {
    //       setImage({
    //         preview: URL.createObjectURL(e.target.files[0]),
    //         raw: e.target.files[0],
    //       });
    //       setfile(e.target.files[0]);
    //     }
    //   };
    
    //   const handleUpload = async (e: any) => {
    //     e.preventDefault();
    //     console.log("in handle upload");
    //     var imageType = /image.*/;
    //     if (!file.type.match(imageType))
    //         return;
    //     var formData = new FormData();
    //     console.log("mid handleupload", image.raw);
    //     formData.append("file", file);
    //     // console.log("formData handleupload", formData);
    //     formData.forEach((value, key) => {
    //         console.log(value, key);
    //     });

    //     await postData("/user/uploadAvatar", formData, {'Content-Type': 'multipart/form-data'});
    //     console.log("upload gone through");
    //   };
    async function logout() {
        const endpoint = '/auth/logout'
        await fetchData(endpoint);
        delete_cookie("AuthToken", undefined, undefined);
        navigate("/login", {replace: true});
    }

    const userInfo = () => {
        return (
            <>
                <TopContainer>
                <ImgContainer>
                    <Img src={'http://localhost:5000/' + user.avatar} alt='profileImg'/>
                </ImgContainer>

                    <RoundButton onClick={logout}><Text fontSize='25px'>🛫</Text></RoundButton>
                </TopContainer>
                <TopContainer>
                <Text>userName</Text>
                    <Text>{user.userName}</Text>
                </TopContainer>
                <TopContainer>
                <Text>First name</Text>
                    <Text>{user.firstName}</Text>
                </TopContainer>
                <TopContainer>
                <Text>Last name</Text>
                    <Text>{user.lastName}</Text>
                </TopContainer>
                {/* <Item> */}
                    {/* <Label htmlFor="upload-button">
                        {image.preview ? '' //(  <img src={image.preview} alt="dummy" width="300" height="300" />) 
                            : (<Text>Select your photo for upload</Text>)} */}
                    {/* </Label> */}
                    {/* <input type="file" id="upload-button" style={{ display: "none" }} 
                    onChange={handleChange}/>
                    <Button onClick={handleUpload}>Upload</Button> */}
                {/* </Item> */}
                <TopContainer>
                <Button><Text><Link to={`/profile/${user.id}`}>Profile</Link></Text></Button>
                <Button><Text><Link to="/settings">settings</Link></Text></Button>
                <Button><Text><Link to="/game">Game</Link></Text></Button>
                </TopContainer>

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