import React, { useState } from 'react';
import { HeroContainer } from './HeroSectionElements';
import DashBoard from '../DashBoard/DashBoard';
import  ConnectionForm from '../ConnectionForm/ConnectionForm';
import  RegistrationForm from '../ConnectionForm/RegistrationForm';

type UserProps = {
    isConnected: boolean
}

const Content = (usr: UserProps) => {

    if (usr.isConnected)
        return (<DashBoard/>);
    else
        return (<ConnectionForm/>);
}

const HeroSection = () => {
    return (
        <HeroContainer>
            <Content isConnected ={false}/>
        </HeroContainer>
    );
}

export default HeroSection;
