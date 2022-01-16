import styled from "styled-components";

export const ButtonContainer = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	border-radius: 5px;
	background-color: #444;
	transform: translate(-50%, -50%);
	padding: 50px;
	opacity: 0.9;
`;

export const Button = styled.button`
	margin: 10px;
	background-color: #04aa6d;
	color: white;
	padding: 12px 20px;
	border: none;
	border-radius: 4px;
	cursor: pointer;

	&:hover {
		background-color: #abc;
	}
`;

type BoxProps = {
	height?: string;
};

export const WidgetContainer = styled.div<BoxProps>`
	justify-content: center;
	text-align: center;
	height: 100%;
	width: 100%;
	background-color: #393b4c;
	padding: 20px;
`;
