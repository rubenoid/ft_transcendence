import styled from "styled-components";

export const RoundButton = styled.button`
	height: 50px;
	width: 50px;
	text-align: center;
	color: white;
	background-color: black;
	border-radius: 50px;
	border: 2px solid #3f3fff;
	cursor: pointer;

	&:hover {
		background-color: #abc;
	}
`;
