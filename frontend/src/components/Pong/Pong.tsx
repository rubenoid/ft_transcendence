import React from 'react'
import { PongContainer, PongImg, Button, ButtonContainer } from './PongElements'

import  PongImgUrl  from '../../../public/pong.png';

const Pong = () => {
    return (
        <>
            <PongContainer>
                <PongImg src={PongImgUrl}/>
                <ButtonContainer>
                    <Button>Play Online</Button>
                    <Button>Play Computer</Button>
                </ButtonContainer>
            </PongContainer>
        </>
    );
}

export default Pong;
