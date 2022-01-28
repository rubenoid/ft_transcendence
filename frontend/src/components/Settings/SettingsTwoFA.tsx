import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchData, postData } from "../../API/API";
import { Button } from "../Utils/Buttons/Button/Button";
import { Text } from "../Utils/Text/Text";
import { TextInput } from "../Utils/TextInput/TextInput";
import { Label } from "../ConnectionForm/ConnectionFormElements";
import { Item } from "../Utils/List/List";
import { User } from "../../Types/Types";
// import { SharedUserState } from "../../App/UserStatus";

interface newQrData {
	qrcode: string;
	secret: string;
}

interface InputParams {
	// initial2FAEnabled : boolean;
	changingData: boolean;
	endpoints: string[];
    user: User;
    onInputEvent(cb: boolean): void;
}

const count = 0;

const SettingsTwoFA = (props: InputParams): JSX.Element => {
	// const [ user, setUser ] = useState<User>();
	const [inputtedTwoFA, setInputtedTwoFA] = useState<string>("");
	const [initial2FAEnabled, setInitial2FAEnabled] = useState<boolean>(false);
	const [qrcode, setQrcode] = useState<newQrData>(undefined);
	const [isChecked, setIsChecked] = useState<boolean>(true);
	const [twoFAvalid, setTwoFAvalid] = useState<boolean>(true);
	const [checkValid, setCheckValid] = useState<boolean>(true);

	useEffect(() => {
        console.log
		fetchData("/user/menFriendsnBlocked").then((user: User) => {
			console.log("user.twoFactorSecret.length", user.twoFactorSecret.length);
			if (props.user.twoFactorSecret.length == 0) {
				setInitial2FAEnabled(false);
				setIsChecked(false);
			} else {
				setInitial2FAEnabled(true);
				setIsChecked(true);
			}
            setInputtedTwoFA("");
		});
	}, [props.changingData]);

	const twoFAChange = (): void => {
		setIsChecked(isChecked == false);
		console.log(
			"NOW isChecked",
			isChecked,
			"initial2FAEnabled",
			initial2FAEnabled,
		);
        if (!isChecked && !initial2FAEnabled) {
			fetchData("auth/getQrRetSecret").then((data: newQrData) => {
				setQrcode(data);
			});
		}
	};

	useEffect(() => {
		async function inputAccessCode(): Promise<void> {
			if (inputtedTwoFA == undefined || inputtedTwoFA.length != 6) return;
			if (initial2FAEnabled == true) {
				const validated: boolean = await postData(`/auth/inputAccessCode`, {
					usertoken: inputtedTwoFA,
				});
				if (validated) {
					props.endpoints.push(`user/removeTwoFA`);
					setCheckValid(!checkValid);
                    setTwoFAvalid(true);
				} else {
                    setTwoFAvalid(false);
				}
			} else {
				const validated: boolean = await postData(`/auth/testQrCode`, {
					usertoken: inputtedTwoFA,
					secret: qrcode.secret,
				});
				if (validated) {
					props.endpoints.push(`/auth/saveSecret/${qrcode.secret}`);
					setTwoFAvalid(true);
                    // setIsChecked(!isChecked);
				} else {
					setTwoFAvalid(false);
				}
                props.onInputEvent(twoFAvalid);
			}
		}
		inputAccessCode();
	}, [inputtedTwoFA]);
	return (
		<>
			<Item>
				<Text fontSize="20px">Two Factor Authentication</Text>
				<input type="checkbox" checked={isChecked} onChange={twoFAChange} />
			</Item>
			{isChecked && !initial2FAEnabled ? (
				<Item>
					{qrcode !== undefined && qrcode.qrcode !== undefined ? (
						<img src={qrcode.qrcode} alt="" />
					) : (
						"loading"
					)}
					<Label>
						<Text fontSize="20px">Input2FA code pls</Text>
					</Label>
					<TextInput
						type="text"
                        value={inputtedTwoFA} 
						onChange={(e) => {
							setInputtedTwoFA(e.target.value);
						}}
					/>
				</Item>
			) : !isChecked && initial2FAEnabled ? (
				<Item>
					<Label>
						<Text fontSize="20px">Your 2fa code please</Text>
					</Label>
					<TextInput
						type="text"
                        value={inputtedTwoFA} 
						onChange={(e) => {
							setInputtedTwoFA(e.target.value);
						}}
					/>
				</Item>
			) : (
				""
			)}
		</>
	);
};

export default SettingsTwoFA;
