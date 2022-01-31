import React, { useState } from "react";
import { useBetween } from "use-between";
import { User } from "../Types/Types";

const UserState = (): {
	user: User;
	setUser: React.Dispatch<React.SetStateAction<User>>;
} => {
	const [user, setUser] = useState<User>(undefined);
	return { user, setUser };
};

export const SharedUserState = (): {
	user: User;
	setUser: React.Dispatch<React.SetStateAction<User>>;
} => useBetween(UserState);
