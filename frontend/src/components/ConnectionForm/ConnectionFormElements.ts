import styled from 'styled-components';

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    text-align: center;
`;

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

export const Button = styled.button`
    margin: 10px;
    background-color: #04AA6D;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #abc;
    }
`;

export const Label = styled.label`
    color: #fff;
    padding: 12px 12px 12px 0;
    display: inline-block;
`;