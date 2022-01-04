import React from 'react'
import { PongContainer, PongImg, Button, ButtonContainer } from './PongElements'

import  PongImgUrl  from '../../../public/pong.png';

import { Text } from '../Utils/Utils'
import socket from '../socket';


function addToQueue() {
	socket.emit("addToQueue");
}

const Pong = () => {
    return (
        <>
            <PongContainer>
                <PongImg src={PongImgUrl}/>
                <ButtonContainer>
                    <Button><Text fontSize='20px' onClick={addToQueue}>Play Online</Text></Button>
                </ButtonContainer>
            </PongContainer>
        </>
    );
}

export default Pong;
