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
    flex-direction: column;
    text-align: center;
    margin: 20px 0;
    gap: 15px;
`;
