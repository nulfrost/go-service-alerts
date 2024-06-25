import { extractContentFromHTML, fetchGOAlerts } from './helpers';

export default {
	async scheduled(_, env, __): Promise<void> {
		try {
			const alerts = await fetchGOAlerts();
			console.log(extractContentFromHTML(alerts.Trains.Train[0].Notifications.Notification[0].MessageBody));
			console.log(alerts.LastUpdated);
		} catch (error) {
			console.error('unhandled error', error);
		}
	},
} satisfies ExportedHandler<Env>;
