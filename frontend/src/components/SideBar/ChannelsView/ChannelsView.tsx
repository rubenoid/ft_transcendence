import React, { useState, useEffect } from "react";
import { Text } from "../../Utils/Text/Text";
import { fetchData } from "../../../API/API";
import { List, Item } from "../../Utils/List/List";
import { Button } from "../../Utils/Buttons/Button/Button";
import { Channel } from "../../../Types/Types";

const ChannelsView = (): JSX.Element => {
	const [channels, setChannels] = useState<Channel[]>([]);

	useEffect(() => {
		async function getChannels(): Promise<Channel[]> {
			const channels: Channel[] = await fetchData("/user/me/chats");
			console.log("USERS-d>ddb", channels);
			setChannels(channels);
			return channels;
		}
		getChannels();
	}, [fetchData]);

	const listChannels = channels.map((channel: Channel, key: number) => {
		return (
			<Item key={channel.id}>
				<Button>{channel.name}</Button>
			</Item>
		);
	});

	return (
		<div>
			<List>
				<h1>Channels</h1>
				{channels.length ? listChannels : <h2>No Channels Yet, Add one !</h2>}
			</List>
		</div>
	);
};

export default ChannelsView;
