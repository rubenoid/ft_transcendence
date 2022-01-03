import React from 'react'
import { PongContainer, PongImg, Button, ButtonContainer } from './PongElements'

import  PongImgUrl  from '../../../public/pong.png';

import { Text } from '../Utils/Utils'

const Pong = () => {
    return (
        <>
            <PongContainer>
                <PongImg src={PongImgUrl}/>
                <ButtonContainer>
                    <Button><Text fontSize='20px'>Play Online</Text></Button>
                </ButtonContainer>
            </PongContainer>
        </>
    );
}

export default Pong;
