import styled from 'styled-components';

export const ChatContainer = styled.div`
    width: 100%;
    height: 100%;
    justify-content: center;
    text-align: center;
    background-color: #666;
    padding: 20px;
`;

export const ChatGrid = styled.div`
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-areas: 
    ". sideBar"
    ". sideBar"
    "chatBox sideBar"; 
`;

export const ChatSideBar = styled.div`
    grid-area: sideBar;
    width: 100%;
    height: 100%;
    background-color: #444;
    padding: 10px;
`;
