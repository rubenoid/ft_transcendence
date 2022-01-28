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
	changingData: boolean;
	endpoints: string[];
	user: User;
}

const SettingsTwoFA = (props: InputParams): JSX.Element => {
	const [inputtedTwoFA, setInputtedTwoFA] = useState<string>("");
	const [initial2FAEnabled, setInitial2FAEnabled] = useState<boolean>(false);
	const [qrcode, setQrcode] = useState<newQrData>(undefined);
	const [isChecked, setIsChecked] = useState<boolean>(false);
	const [twoFAvalid, setTwoFAvalid] = useState<boolean>(true);

	useEffect(() => {
		console.log("props.changingData");
		if (props.user.twoFactorSecret.length == 0) {
			setInitial2FAEnabled(false);
			setIsChecked(false);
		} else {
			setInitial2FAEnabled(true);
			setIsChecked(true);
		}
		setInputtedTwoFA("");
	}, []);

	const twoFAChange = (): boolean => {
		console.log(isChecked);
		if (!qrcode) {
			if (!isChecked && !initial2FAEnabled) {
				console.log("QR done");
				fetchData("auth/getQrRetSecret").then((data: newQrData) => {
					setQrcode(data);
				});
			}
		}
		return !isChecked;
	};

	useEffect(() => {
		async function inputAccessCode(): Promise<void> {
			if (inputtedTwoFA == undefined || inputtedTwoFA.length != 6) return;
			console.log("inputting 2fa initial2FAEnabled = ", initial2FAEnabled);
			console.log("inputtedTwoFA", inputtedTwoFA);
			if (initial2FAEnabled == true) {
				console.log(
					"postData  /auth/inputAccessCode` inputtedTwoFA",
					inputtedTwoFA,
				);
				const validated: boolean = await postData(`/auth/inputAccessCode`, {
					usertoken: inputtedTwoFA,
				});
				if (validated) {
					console.log("in remove 2FA valid");
					props.endpoints.push(`user/removeTwoFA`);
					setTwoFAvalid(true);
				} else {
					console.log("in remove 2FA unvalid");
					setTwoFAvalid(false);
				}
			} else {
				console.log("postData  /auth/testQrCode` inputtedTwoFA", inputtedTwoFA);
				const validated: boolean = await postData(`/auth/testQrCode`, {
					usertoken: inputtedTwoFA,
					secret: qrcode.secret,
				});
				if (validated) {
					console.log("in ADD 2FA valid");
					props.endpoints.push(`/auth/saveSecret/${qrcode.secret}`);
					setTwoFAvalid(true);
				} else {
					console.log("in add 2FA unvalid");
					setTwoFAvalid(false);
				}
				// props.onInputEvent(twoFAvalid);
			}
		}
		inputAccessCode();
	}, [inputtedTwoFA]);
	return (
		<>
			<Item>
				<Text fontSize="20px">Two Factor Authentication</Text>
				<input
					type="checkbox"
					checked={isChecked}
					onChange={() => setIsChecked(twoFAChange)}
				/>
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
