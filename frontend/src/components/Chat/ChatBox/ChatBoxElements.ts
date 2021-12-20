import styled from 'styled-components';

export const ChatBoxContainer = styled.div`
    grid-area: chatBox;
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: #fff;
    border: 2px solid #04AA6D;
`;

export const ChatContainer = styled.div`
    background-color: #000;
    height: 100%;
    width: 100%;
`;

export const TopContainer = styled.div`
    background-color: #393b4c;
    min-height: 40px;
    width: 100%;
`;

export const InputContainer = styled.div`
    height: 100%;
    background: rgba(0, 255, 0, .1);
`;