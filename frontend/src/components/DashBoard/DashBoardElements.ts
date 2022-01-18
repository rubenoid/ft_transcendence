import styled from "styled-components";

export const DashBoardContainer = styled.div`
	height: 100%;
	width: 100%;
	display: grid;
	grid-template-columns: 0fr 1fr 2fr 1.5fr 0fr;
	grid-template-areas:
		". profile game chat ."
		". info1 game chat ."
		". info2 game chat .";
	grid-gap: 10px;
	background-color: #8ec5fc;
	background-image: linear-gradient(62deg, #8ec5fc 0%, #e0c3fc 100%);
	padding: 10px 0;

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
	background-color: ${(props: BoxProps) =>
		props.bgColor ? props.bgColor : "transparent"};
	border-radius: 5px;
	grid-area: ${(props: BoxProps) => props.gridArea};
	place-self: ${(props: BoxProps) => props.alignSelf};
	overflow: "scroll";
`;
