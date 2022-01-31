import styled from "styled-components";

export const WidgetContainer = styled.div`
	justify-content: center;
	text-align: center;
	height: 100%;
	width: 100%;
	padding: 20px;
	border: 5px white solid;
	border-radius: 5px;
`;

export const MainContentWrapper = styled.div`
	height: 80vh;
	overflow-y: auto;
`;

export const HeaderWrapper = styled.div``;

export const FooterWrapper = styled.div`
	height: 110px;
	padding: 20px;
	display: flex;
	justify-content: right;
`;

export const MainViewContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	border: 5px white solid;
	border-radius: 5px;
	background-color: black;
	border-radius: 7px;
	padding: 20px;
	height: -webkit-fill-available;
`;

export const AdminContainer = styled.div`
	background-color: white;
	border-radius: 7px;
	padding: 20px;
`;
