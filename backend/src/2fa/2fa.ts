import * as speakeasy from "speakeasy";
import * as qrcode from "qrcode";
import * as readline from "readline";

const secrets = [];

export function getTwoFactorAuthenticationCode() {
	const secretCode = speakeasy.generateSecret({ name: "Pong online" });
	return {
		otpauthUrl: secretCode.otpauth_url,
		base32: secretCode.base32,
	};
}

export function createQrCodeAsImg(url: string) {
	qrcode.toFile("img.png", url, function (err) {
		console.log("error", err);
	});
}

export async function createQrCodeAsURL(data: string): Promise<string> {
	return await qrcode.toDataURL(data);
}

export function check2faInput(input: string, secret: string) {
	const check = speakeasy.totp.verify({
		secret: secret,
		encoding: "base32",
		token: input,
	});
	// console.log('check returns', check);
	return check;
}

function UserInput(query: string) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) =>
		rl.question(query, (ans) => {
			rl.close();
			resolve(ans);
		}),
	);
}

// export async function runexample() {
// 	const data = getTwoFactorAuthenticationCode();
// 	console.log(data);
// 	secrets.push(data.base32);
// 	createQrCodeAsImg(data.otpauthUrl);
// 	while (1) {
// 		check2faInput((await UserInput("Pong online")) as string, data.base32);
// 	}
// 	console.log("passed example");
// }
//