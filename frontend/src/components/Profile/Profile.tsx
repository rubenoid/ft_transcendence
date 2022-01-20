import React, { useState, useEffect,  } from 'react';
import { WidgetContainer } from '../Utils/Containers/Containers';
import { ImgContainer, Img, TopContainer } from './ProfileElements';
import { fetchData } from '../../API/API';
import { User } from '../../Types/Types';
import { Button } from '../Utils/Buttons/Button/Button';
import { useNavigate, Link } from 'react-router-dom';
import { sharedHeroSection } from '../HeroSection/HeroSection';
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

	const { isConnected, setIsConnected } = sharedHeroSection();
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
        setIsConnected(false);
        navigate("/", {replace: true});
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
                    <Text>{user.userName}</Text>
                    <Text>{user.firstName}</Text>
                    <Text>{user.lastName}</Text>
                </TopContainer>
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