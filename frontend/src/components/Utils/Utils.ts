import styled from 'styled-components';


export const TextInput = styled.input`
    background: rgba(0, 255, 0, .1);
    width: 100%;
    padding: 12px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    resize: vertical;

    &:focus
    {
        border: 1px solid #04AA6D;
        box-shadow: none;
    }
`;

export const Text = styled.p`
    padding: 0px 30px;
    color: #fff;
    font-size: 24px;
    text-align: center;
    max-width: 600px;
    
    @media screen and (max-width: 768px) {
        font-size: 24px;
    }
    
    @media screen and (max-width: 480px) {
        font-size: 18px;
    }
`;

export const List = styled.ul`
    width: 100%;
    display: block;
    padding: 10px 0 0 0;
    list-style-type: none;
`;

export const LongList = styled.ul`
    width: 100%;
    margin: 10px 0;
    list-style-type: none;
    height: 100%;
    display: block;
    padding: 10px 0;
    position: relative;
`

export const Item = styled.li`
    list-style-type: none;
    width: 100%;
    padding: 5px 0;
`;