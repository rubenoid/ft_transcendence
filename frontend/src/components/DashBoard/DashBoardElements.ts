import styled from "styled-components";

export const DashBoardContainer = styled.div`
	height: 100vh;
	width: 100%;
	display: flex;
	background-color: black;
	padding: 10px 0;
	justify-content: space-evenly;

	@media screen and (max-width: 1300px) {
		grid-template-columns: 1fr 1.5fr 1.5fr;
		grid-template-areas:
			" profile info1 info2"
			" game game chat "
			" game game chat";
	}

	@media screen and (max-width: 768px) {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
`;

type BoxProps = {
	gridArea: string;
	alignSelf?: string;
	bgColor?: string;
	height?: string;
};

export const Box = styled.div<BoxProps>`
	width: 100%;
	height: 100%;
	background-color: black;
	border: 5px solid;
	border-radius: 5px;
	grid-area: ${(props: BoxProps) => props.gridArea};
	place-self: ${(props: BoxProps) => props.alignSelf};
	overflow: "scroll";
`;

export const MainContentWrapper = styled.div`
	width: 1000px;
`;
