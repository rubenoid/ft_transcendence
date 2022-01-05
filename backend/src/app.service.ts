import { Injectable } from "@nestjs/common";

console.log("this is app server");

@Injectable()
export class AppService {
	getHello(): string {
		return "gello World!";
	}
}
