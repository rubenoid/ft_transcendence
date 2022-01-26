import React, {useState, useEffect} from 'react';
import {
	TableRow,
	TableCell,
	TableHeader,
	TableHeaderCell,
	Table,
} from "../../Utils/Table/Table";
import { detailedUser, Match } from "../../../Types/Types";
import {Text} from '../../Utils/Text/Text';
import {fetchData} from '../../../API/API';
import { Link, useParams } from "react-router-dom";
/*
	const [userlist, setuserlist] = useState(undefined);

	useEffect(() => {
		async function getUsers(): Promise<void> {
			const foundUsers: detailedUser[] = await fetchData("/user/all");
			const allStatus: userStatus[] = await fetchData("/user/getAllStatus");
			for (let i = 0; i < allStatus.length; i++) {
				const e = allStatus[i];
				const found = foundUsers.find((x) => x.id == e.id);
				if (found) {
					found.status = e.status;
				}
			}
			users = foundUsers;
			setListUsers();
		}
		getUsers();
	}, [fetchData]);
*/
const ListMatch = () => {

	const [user, setUser] = useState<detailedUser>(undefined);
	const { profileId } = useParams();
    console.log('ProfileId->',profileId);

	useEffect(() => {
		async function getUser(): Promise<void> {
			const user: detailedUser = await fetchData(`/user/get/${profileId}`);
			user.matches = [];
			fetchData(`/match/getUserHistory/${profileId}`)
				.then((match: Match[]) => {
					user.matches = match;
					setUser({ ...user });
				})
				.catch((er) => {
					console.log("2", er);
				});
		}
		getUser();
	}, [fetchData]);

    const listmatches = user.matches.map((value: Match, key: number) => {
        return (
            <TableRow key={key}>
                {value.players[0].userName == user.userName && value.players[1] ? (
                    <TableCell>
                        <Link to={`/profile/${value.players[1].id}`}>
                            <Text fontSize="10">{value.players[1].userName}</Text>
                        </Link>
                    </TableCell>
                ) : (
                    <TableCell>
                        <Link to={`/profile/${value.players[0].id}`}>
                            <Text fontSize="10">{value.players[0].userName}</Text>
                        </Link>
                    </TableCell>
                )}
                <TableCell>
                    {value.players[0].userName == user.userName ? (
                        <Text fontSize="10">{value.scorePlayer1}</Text>
                    ) : (
                        <Text fontSize="10">{value.scorePlayer2}</Text>
                    )}
                </TableCell>
                <TableCell>
                    {value.players[0].userName == user.userName ? (
                        <Text fontSize="10">{value.scorePlayer2}</Text>
                    ) : (
                        <Text fontSize="10">{value.scorePlayer1}</Text>
                    )}
                </TableCell>
            </TableRow>
        );
    });

    return (
        <div>
            {user.matches.length ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>Played Against</TableHeaderCell>
                            <TableHeaderCell>
                                {user.userName}
                                {"'"}s score
                            </TableHeaderCell>
                            <TableHeaderCell>Other player Score</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <tbody>{listmatches}</tbody>
                </Table>
            ) : (
                <Text>No matches yet</Text>
            )}
        </div>
    )
}

export default ListMatch
