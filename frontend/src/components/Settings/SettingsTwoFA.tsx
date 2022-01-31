import React, { useEffect, useState } from "react";
import { fetchData, postData } from "../../API/API";
import { HeaderTwo, Text } from "../Utils/Text/Text";
import { TextInput } from "../Utils/TextInput/TextInput";
import { Label } from "../Utils/Label/Label";
import { Item } from "../Utils/List/List";
import { User } from "../../Types/Types";

interface newQrData {
	qrcode: string;
	secret: string;
}

interface InputParams {
	setEndpoints: React.Dispatch<React.SetStateAction<string[]>>;
	setTwoFAvalid: React.Dispatch<React.SetStateAction<boolean>>;
	user: User;
}

const SettingsTwoFA = (props: InputParams): JSX.Element => {
	const [initial2FAEnabled, setInitial2FAEnabled] = useState<boolean>(false);
	const [qrcode, setQrcode] = useState<newQrData>(undefined);
	const [isChecked, setIsChecked] = useState<boolean>(true);

	function setInitialTwoFaStates(): void {
		if (props.user.twoFactorSecret.length == 0) {
			setInitial2FAEnabled(false);
			setIsChecked(false);
		} else {
			setInitial2FAEnabled(true);
			setIsChecked(true);
		}
	}

	useEffect(() => {
		setInitialTwoFaStates();
	}, [props.user]);

	const twoFAChange = (): void => {
		setIsChecked(!isChecked);
		if (!isChecked && !initial2FAEnabled) {
			fetchData("auth/getQrRetSecret").then((data: newQrData) => {
				setQrcode(data);
			});
		}
	};

	async function addingAccessCode(inputtedTwoFA: string): Promise<void> {
		if (inputtedTwoFA == undefined || inputtedTwoFA.length != 6) {
			if (inputtedTwoFA.length == 0) props.setTwoFAvalid(true);
			else props.setTwoFAvalid(false);
			return;
		}
		const validated: boolean = await postData(`/auth/testQrCode`, {
			usertoken: inputtedTwoFA,
			secret: qrcode.secret,
		});
		if (validated) {
			props.setEndpoints((prev) => [
				...prev,
				`/auth/saveSecret/${qrcode.secret}`,
			]);
			props.setTwoFAvalid(true);
		} else {
			props.setTwoFAvalid(false);
		}
	}

	async function removingAccessCode(inputtedTwoFA: string): Promise<void> {
		if (inputtedTwoFA == undefined || inputtedTwoFA.length != 6) {
			if (inputtedTwoFA.length == 0) props.setTwoFAvalid(true);
			else props.setTwoFAvalid(false);
			return;
		}
		const validated: boolean = await postData(`/auth/inputAccessCode`, {
			usertoken: inputtedTwoFA,
		});
		if (validated) {
			props.setEndpoints((prev) => [...prev, `user/removeTwoFA`]);
			props.setTwoFAvalid(true);
		} else {
			props.setTwoFAvalid(false);
		}
	}

	return (
		<>
			<Item>
				<HeaderTwo fontSize="20px">Two Factor Authentication</HeaderTwo>
				<Label>Enabled: </Label>
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
						onChange={(e) => {
							addingAccessCode(e.target.value);
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
						onChange={(e) => {
							removingAccessCode(e.target.value);
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
