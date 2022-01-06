import React, { useState, useEffect } from 'react';
import { TextContainer, WidgetContainer } from '../Utils/Utils';
import { ImgContainer, Img } from './ProfileElements';
import { Text } from '../Utils/Utils';
import { fetchMySelf, User } from '../../API/API';

const Profile = () => {

    const [user, setUser] = useState<User>(undefined);

    useEffect(() => {
        async function getUser(): Promise<User> {
            const user: User = await fetchMySelf();
            setUser(user);
            return user;
        }
        getUser();
    }, []);

    const userInfo = () => {
        return (
            <>
                <Text>{user.firstName}</Text>
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