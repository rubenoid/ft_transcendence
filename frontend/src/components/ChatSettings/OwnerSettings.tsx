import React from "react";
import { Text } from "../Utils/Text/Text";
import { ChatSettingsForm, roleLevel } from "./ChatSettings";
import { UserWrapper } from "./ChatSettingsElements";
import { TextInput } from "../Utils/TextInput/TextInput";
import { Label } from "../Utils/Label/Label";

interface InputParams {
	settingsForm: ChatSettingsForm;
	setSettingsForm: React.Dispatch<React.SetStateAction<ChatSettingsForm>>;
	myRole: roleLevel;
}

const OwnerSettings = (props: InputParams): JSX.Element => {
	function updatePrivacy(e: number): void {
		props.setSettingsForm({ ...props.settingsForm, privacyLevel: e });
	}

	const displaySettings = (): JSX.Element => {
		return (
			<>
				<Text fontSize="20px" color="black">
					Settings
				</Text>
				<Text>Change Name</Text>
				<TextInput
					type={"text"}
					placeholder={props.settingsForm.name}
					onChange={(e) =>
						props.setSettingsForm({
							...props.settingsForm,
							name: e.target.value,
						})
					}
				></TextInput>
				<Text>Change Visibility</Text>
				<Label>
					<input
						type="radio"
						name="privacy"
						value={"1"}
						checked={props.settingsForm.privacyLevel == 1}
						onChange={(e) => updatePrivacy(parseInt(e.target.value))}
					/>
					Public
				</Label>
				<Label>
					<input
						type="radio"
						name="privacy"
						value={"0"}
						checked={props.settingsForm.privacyLevel == 0}
						onChange={(e) => updatePrivacy(parseInt(e.target.value))}
					/>
					Private
				</Label>
				<Label>
					<input
						type="radio"
						name="privacy"
						value={"2"}
						checked={props.settingsForm.privacyLevel == 2}
						onChange={(e) => updatePrivacy(parseInt(e.target.value))}
					/>
					Protected
				</Label>
				{props.settingsForm.privacyLevel == 2 ? (
					<TextInput
						placeholder="Enter new password"
						onChange={(e) =>
							props.setSettingsForm({
								...props.settingsForm,
								password: e.target.value,
							})
						}
					/>
				) : (
					""
				)}
			</>
		);
	};
	return (
		<>
			<UserWrapper>
				{props.settingsForm && props.myRole == roleLevel.owner
					? displaySettings()
					: ""}
			</UserWrapper>
		</>
	);
};

export default OwnerSettings;
