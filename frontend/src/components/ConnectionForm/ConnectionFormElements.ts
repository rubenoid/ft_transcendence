import styled from 'styled-components';

export const FormContainer = styled.div`
    display: flex;
    justify-content: center;
    position: relative;
    height: 100%;
    width: 100%;
    padding: 10px;
    background-color: #444;
`;

export const Form = styled.form`
    text-align: center;
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