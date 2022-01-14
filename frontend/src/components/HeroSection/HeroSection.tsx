import React, { useState } from 'react';
import { HeroContainer } from './HeroSectionElements';
import DashBoard from '../DashBoard/DashBoard';
import  ConnectionForm from '../ConnectionForm/ConnectionForm';
import  RegistrationForm from '../ConnectionForm/RegistrationForm';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import TwoFACheck from '../ConnectionForm/twoFACheck';

type UserProps = {
    isConnected: boolean
}

// const Content = (usr: UserProps) => {

//     if (usr.isConnected)
//         return (<DashBoard/>);
//     else
//         return (<ConnectionForm/>);
// }

const HeroSection = () => {
    return (
        <HeroContainer>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<ConnectionForm/>} />
                    <Route path='/register' element={<RegistrationForm/>} />
                    <Route path='/profile' element={<DashBoard/>} />
                    <Route path='/checkTwoFA' element={<TwoFACheck/>} /> 
                </Routes>
            </BrowserRouter>
        </HeroContainer>
    );
}

export default HeroSection;
