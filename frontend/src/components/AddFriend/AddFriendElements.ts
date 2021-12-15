import styled from 'styled-components';

export const AddFriendContainer = styled.div`
    background-color: #444;
    width: 100%;

`;

export const SearchBox = styled.input`
    border: 1px solid green;
    border-radius: 5px;
    height: 40px;
    width: 100%;
    padding: 10px;
    outline: 0;
    background: rgba(0, 255, 0, .1);
    ::placeholder{
        color: #fff;
        font-size: 14px;
    }
`;