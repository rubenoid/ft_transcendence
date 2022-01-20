import * as speakeasy from "speakeasy";
import * as qrcode from "qrcode";
import * as readline from "readline";

export function getTwoFactorAuthenticationCode(): {
	otpauthUrl: "";
	base32: "";
} {
	const secretCode = speakeasy.generateSecret({ name: "Pong online" });
	return {
		otpauthUrl: secretCode.otpauth_url,
		base32: secretCode.base32,
	};
}

export function createQrCodeAsImg(url: string): void {
	qrcode.toFile("img.png", url, function (err) {
		console.log("error", err);
	});
}

export async function createQrCodeAsURL(data: string): Promise<string> {
	return await qrcode.toDataURL(data);
}

export async function check2faInput(
	input: string,
	secret: string,
): Promise<boolean> {
	const check = speakeasy.totp.verify({
		secret: secret,
		encoding: "base32",
		token: input,
	});
	return check;
}
