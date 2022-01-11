import styled from "styled-components";

export const PongCanvas = styled.canvas`
	background-color: black;
`;

export const PongContainer = styled.div`
	display: flex;
	position: relative;
	justify-content: center;
	background-color: transparent;
`;

export const PongImg = styled.img`
	border-radius: 10px;
	position: relative;
	max-height: 100%;
	max-width: 100%;
	opacity: 0.7;
`;

type ButtonProps = {
	display: boolean;
};

export const ButtonContainer = styled.div<ButtonProps>`
	position: absolute;
	top: 50%;
	left: 50%;
	border-radius: 5px;
	background-color: #393b4c;
	transform: translate(-50%, -50%);
	padding: 0px;
	opacity: 0.9;
	display: ${(props: ButtonProps) => (props.display ? "block" : "none")};
`;

export const Button = styled.button`
	width: 100%;
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
