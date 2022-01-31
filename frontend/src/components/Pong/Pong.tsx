import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LinkButton } from "../Utils/Buttons/Button/LinkButton";
import {
	FooterWrapper,
	HeaderWrapper,
	MainContentWrapper,
	MainViewContainer,
} from "../Utils/Containers/Containers";
import { Header, Text } from "../Utils/Text/Text";
import Pong from "./PongGame";
import RunningGamesList from "./RunningGamesList";

const PongView = (): JSX.Element => {

	const navigate = useNavigate();
	return (
		<MainViewContainer>
			<HeaderWrapper>
				<Header>Pong</Header>
			</HeaderWrapper>
			<MainContentWrapper>
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<Pong />
					<RunningGamesList
						onSpectateClick={(id: string) => {
							navigate(`/game/${id}`);
						}}
					/>
				</div>
			</MainContentWrapper>
			<FooterWrapper>
				<LinkButton to={-1}>
					<Text>Back</Text>
				</LinkButton>
			</FooterWrapper>
		</MainViewContainer>
	);
};

export default PongView;
