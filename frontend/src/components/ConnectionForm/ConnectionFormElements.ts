import styled from "styled-components";
import { Link as LinkR } from "react-router-dom";

export const FormContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: 100%;
	max-width: 400px;
	border: 5px solid white;
	border-radius: 10px;
	padding: 10px;
	margin-top: 20%;
	margin-left: calc(50% - 200px);
`;

export const Form = styled.form`
	padding: 10px;
	text-align: center;
`;

export const Button = styled.button`
	margin: 10px;
	background-color: #3f3fff;
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

export const Btn = styled(LinkR)`
	height: 50px;
	width: 50px;
	text-align: center;
	background-color: #444;
	color: white;
	border-radius: 50px;
	border: 2px solid #3f3fff;
	cursor: pointer;

	&:hover {
		background-color: #abc;
	}
`;

export const RegistrationContainer = styled.div`
	min-height: 100vh;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;
