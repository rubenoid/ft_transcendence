import { Inject, Injectable } from '@nestjs/common';
import { Repository, FindOneOptions} from 'typeorm';
import { ChatEntity, ChatMessageEntity } from './chat.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatService {

	constructor (
		@Inject('CHAT_REPOSITORY')
		private chatRepository: Repository<ChatEntity>,

		private userService: UserService
		) {}

	async getAllChats()
	{
		const chats = await this.chatRepository.find({ relations: ["users", "messages"]});

		return chats;
	}

	async createChat()
	{ 
		const toadd = new ChatEntity;

		toadd.name = "Oscar, Ruben";
		toadd.password = "aa";

		const users = await this.userService.getUsers();

		if (users.length < 2)
			throw "kkr weinig users";
		toadd.users = [users[0], users[1]];
		toadd.messages = [];

		this.chatRepository.save(toadd);
	}

	async createRandMessage(id: number)
	{
		const chat = await this.chatRepository.findOne(id);

        console.log('1');
        
		if (!chat)
			throw "no chat";

        console.log('2');
            
		if (!chat.messages)
			chat.messages = [];
	
		console.log(chat);

		const toadd = new ChatMessageEntity;

		toadd.data = "hallo!!";

		toadd.senderId = 0;
	
		chat.messages.push(toadd);
		await this.chatRepository.save(chat);

	}

	async clear()
	{
		const chats = await this.chatRepository.find();

		for (let i = 0; i < chats.length; i++) {
			const e = chats[i];
			await this.chatRepository.remove(e);
		}
	}

}
 