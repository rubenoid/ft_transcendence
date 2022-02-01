import React, { useState } from "react";
import { UserStatus } from "../Types/Types";
import { useBetween } from "use-between";

export const StatusColors = new Map<string, string>();

StatusColors.set("Online", "#04aa6d");
StatusColors.set("Offline", "#ff3a3a");
StatusColors.set("In game", "#3f3fff");

const UserStatus = (): {
	userStatuses: UserStatus[];
	setUserStatuses: React.Dispatch<React.SetStateAction<UserStatus[]>>;
} => {
	const [userStatuses, setUserStatuses] = useState<UserStatus[]>([]);

	return { userStatuses, setUserStatuses };
};

export const SharedUserStatuses = (): {
	userStatuses: UserStatus[];
	setUserStatuses: React.Dispatch<React.SetStateAction<UserStatus[]>>;
} => useBetween(UserStatus);

export function FindStatus(id: number, userStatuses: UserStatus[]): string {
	const found: UserStatus = userStatuses.find((x) => x.id == id);
	if (!found) return "";
	return found.status;
}
