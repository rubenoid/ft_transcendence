import React from 'react';
import { AiOutlineSend as SendIcon} from 'react-icons/ai';
import { SendIconContainer } from './SendButtonElements';

const SendButton = () => {
    return (
        <SendIconContainer>
            <SendIcon/>
        </SendIconContainer>
    );
}

export default SendButton;
