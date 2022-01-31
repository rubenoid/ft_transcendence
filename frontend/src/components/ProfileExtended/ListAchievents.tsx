import React from "react";
import { Achievement } from "../../Types/Types";
import { Header, Text } from "../Utils/Text/Text";
import { AchievementWrapper, AchieventGrid } from "./ProfileElements";

interface InputParams {
	achievements: Achievement[];
}

const AchievementList = (props: InputParams): JSX.Element => {
	const listachievements = (): JSX.Element[] => {
		return props.achievements.map((item: Achievement, key: number) => {
			return (
				<AchievementWrapper key={key}>
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
