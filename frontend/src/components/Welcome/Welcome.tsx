import React from "react";
import { useNavigate } from "react-router-dom";
import { Img, ParentDiv, Ulist, ListItem } from "./WelcomeElements";
import { LinkButton } from "../Utils/Buttons/Button/LinkButton";
import {
	FooterWrapper,
	HeaderWrapper,
	MainContentWrapper,
	MainViewContainer,
} from "../Utils/Containers/Containers";
import { Header, Text } from "../Utils/Text/Text";

const WelcomeComponent = (): JSX.Element => {
	const navigate = useNavigate();
	return (
		<MainViewContainer>
			<HeaderWrapper>
				<Header>Welcome To PONG</Header>
			</HeaderWrapper>
			<MainContentWrapper>
				<Text>
					This is the project done by four young ambitious software engineers.
					It marks the end of their journey within Codam Core. We hope you
					enjoy browsing this website as much as we enjoyed making it.
				</Text>
				<ParentDiv>
					<Ulist>
						<ListItem>
							<Img
								src={"http://localhost:5000/img/amber_van_dam.jpeg"}
								alt="Amber van Dam"
							/>
							<div>
								<a href="https://github.com/avan-dam">Github</a>
							</div>
							<div>
								<a href="https://www.linkedin.com/in/amber-van-dam-5044b21b6/">
									Connect on LinkedIn
								</a>
							</div>
						</ListItem>
						<ListItem>
							<Img
								src={"http://localhost:5000/img/oscar_kruithof.jpeg"}
								alt="Oscar Kruithof"
							/>
							<div>
								<a href="https://github.com/Alpha1337k">Github</a>
							</div>
							<div>
								<a href="https://www.linkedin.com/in/oscar-kruithof-1b358a1b3/">
									Connect on LinkedIn
								</a>
							</div>
						</ListItem>
						<ListItem>
							<Img
								src={"http://localhost:5000/img/haroutioun_achtchian.jpeg"}
								alt="Haroutioun Achtchian"
							/>
							<div>
								<a href="https://github.com/harou24">Github</a>
							</div>
							<div>
								<a href="https://www.linkedin.com/in/harou/">
									Connect on LinkedIn
								</a>
							</div>
						</ListItem>
						<ListItem>
							<Img
								src={"http://localhost:5000/img/ruben_van_schaik.jpeg"}
								alt="Ruben van Schaik"
							/>
							<div>
								<a href="https://github.com/rubenoid">Github</a>
							</div>
							<div>
								<a href="https://www.linkedin.com/in/ruben-van-schaik/">
									Connect on LinkedIn
								</a>
							</div>
						</ListItem>
					</Ulist>
				</ParentDiv>
			</MainContentWrapper>
			<FooterWrapper>
				<LinkButton to={-1}>
					<Text>Back</Text>
				</LinkButton>
			</FooterWrapper>
		</MainViewContainer>
	);
};

export default WelcomeComponent;
