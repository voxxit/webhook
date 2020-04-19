import { TwitchChat } from '../../services/TwitchChat';
import { StreamLabs } from '../../services/StreamLabs';

interface HandleOptions {
	payload: any;
}

export class PullRequestOpened {
	public constructor(
		private twitchChat: TwitchChat,
		private streamlabs: StreamLabs,
	) {}

	private async notifyTwitch({ payload }: HandleOptions) {
		try {
			const message = `*${payload.pull_request.user.login}* just opened a pull request in ${payload.repository.html_url}`;
			await this.twitchChat.send(message);

			return {
				notified: true,
				message,
			};
		} catch {
			// TODO: add logging

			return {
				notified: false,
				message: '',
			};
		}
	}

	public async notifyStreamLabs({ payload }: HandleOptions) {
		try {
			const message = `*${payload.pull_request.user.login}* just opened a pull request in *${payload.repository.full_name}*`;
			await this.streamlabs.alert({ message });

			return {
				notified: true,
				message,
			};
		} catch {
			// TODO: add logging

			return {
				notified: false,
				message: '',
			};
		}
	}

	public async handle({ payload }: HandleOptions) {
		const [twitchChat, streamlabs] = await Promise.all([
			this.notifyTwitch({ payload }),
			this.notifyStreamLabs({ payload }),
		]);

		return {
			twitchChat,
			streamlabs,
		};
	}
}
