import React, { useState, useEffect } from 'react';
import { WidgetContainer } from '../Utils/Utils';
import { ImgContainer, Img } from './ProfileElements';
import { fetchData, User } from '../../API/API';
import { Text } from '../Utils/Text/Text';

const Profile = () => {

    const [user, setUser] = useState<User>(undefined);

    useEffect(() => {
        async function getUser(): Promise<User> {
            const user: User = await fetchData('/user/me');
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