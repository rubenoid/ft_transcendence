import React from "react";
import { Achievement } from "../../Types/Types";
import { Header, Text } from "../Utils/Text/Text";
import { AchievementWrapper, AchieventGrid } from "./ProfileElements";
import { IconContainer } from "../Utils/IconContainer";
import { FaAward as Award } from "react-icons/fa";
import { GiLostLimb as Lost } from "react-icons/gi";
import { GiThreeFriends as Friend } from "react-icons/gi";
import { SiAdblock as Block } from "react-icons/si";
import { FcFlashOn as ThreeWins } from "react-icons/fc";

interface InputParams {
	achievements: Achievement[];
}

const AchievementList = (props: InputParams): JSX.Element => {
	const listachievements = (): JSX.Element[] => {
		return props.achievements.map((item: Achievement, key: number) => {
			if (item.description.includes("first")) item.icon = <Award size={40} />;
			else if (item.description.includes("lost"))
				item.icon = <Lost size={50} />;
			else if (item.description.includes("friend"))
				item.icon = <Friend size={50} />;
			else if (item.description.includes("blocked"))
				item.icon = <Block size={40} />;
			else item.icon = <ThreeWins size={40} />;
			return (
				<AchievementWrapper key={key}>
					<IconContainer>{item.icon}</IconContainer>
					<Header>{item.title}</Header>
					<Text>{item.description}</Text>
				</AchievementWrapper>
			);
		});
	};

	return (
		<AchieventGrid>
			{props.achievements && props.achievements.length ? (
				listachievements()
			) : (
				<Text>Nothing to display</Text>
			)}
		</AchieventGrid>
	);
};

export default AchievementList;
