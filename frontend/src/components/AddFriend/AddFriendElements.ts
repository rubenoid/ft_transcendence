import styled from 'styled-components';

export const AddFriendContainer = styled.div`
    background-color: #393b4c;
    width: 100%;
`;

export const SearchBox = styled.input`
    border: 1px solid green;
    border-radius: 5px;
    height: 40px;
    width: 100%;
    padding: 10px;
    outline: 0;

    ::placeholder{
        color: #fff;
        font-size: 14px;
    }
`;

export const SearchResultContainer = styled.div`
    display: flex;
    background-color: #444;
    text-align: left;
    margin: 20px 0;
    gap: 15px;
`;

export const AddIconContainer = styled.div`
    align-content: center;
    text-align: center;
    padding-top: 10px;
    background-color: #04AA6D;
    height: 50px;
    width: 50px;
    font-size: 1rem;
    color: #fff;
    cursor: pointer;
    border-radius: 50%;

    &:hover {
        color: #393b4c;
        transition: all ease-in-out;
    }
`;