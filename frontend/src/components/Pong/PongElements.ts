import styled from "styled-components";

export const PongCanvas = styled.canvas`
	background-color: black;
	width: 400px;
	height: 600px;
	display: flex;
`;

export const PongContainer = styled.div`
	width: 400px;
	display: block;
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

export const PlayerContainerTop = styled.div`
	width: 400px;
	height: 50px;
	background-color: #3f3fff;
	border-radius: 7px 7px 0 0;
	padding: 7px 0px 0 20px;
	display: flex;
	justify-content: space-between;
`;

export const PlayerContainerBot = styled.div`
	width: 400px;
	height: 50px;
	background-color: #ff3939;
	border-radius: 0 0 7px 7px;
	padding: 7px 0px 0 20px;
	display: flex;
	justify-content: space-between;
`;

export const ScoreContainer = styled.div`
	background-color: white;
	border-radius: 7px;
	margin-right: 20px;
	width: 30px;
	height: 35px;
`;

export const ScoreText = styled.p`
	color: black;
	padding 5px 10px;
`;
