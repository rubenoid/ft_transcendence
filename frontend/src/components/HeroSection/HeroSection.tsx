import React, { useState } from 'react';
import { HeroContainer } from './HeroSectionElements';
import DashBoard from '../DashBoard/DashBoard';
import ConnectionForm from '../ConnectionForm/ConnectionForm';

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
            <Content isConnected ={true}/>
        </HeroContainer>
    );
}

export default HeroSection;
