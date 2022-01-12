import React, { useState, useEffect,  } from 'react';
import { RoundButton, TextContainer, WidgetContainer } from '../Utils/Utils';
import { ImgContainer, Img, TopContainer } from './ProfileElements';
import { Text } from '../Utils/Utils';
import { fetchData, User } from '../../API/API';
import { useNavigate } from 'react-router-dom';

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

    useEffect(() => {
        async function getUser(): Promise<User> {
            const user: User = await fetchData('/user/me');
            setUser(user);
            return user;
            
        }
        getUser();
    }, []);

    async function logout() {
        const endpoint = '/auth/logout'
        await fetchData(endpoint);
        delete_cookie("AuthToken", undefined, undefined);
        navigate("/", {replace: true});
    }

    const userInfo = () => {
        return (
            <>
                <TopContainer>
                    <Text>{user.firstName}</Text>
                    <RoundButton onClick={logout}><Text fontSize='25px'>🛫</Text></RoundButton>
                </TopContainer>
                <ImgContainer>
                    <Img src={'http://localhost:5000/' + user.avatar} alt='profileImg'/>
                </ImgContainer>
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