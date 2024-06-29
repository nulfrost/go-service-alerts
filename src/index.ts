import { extractContentFromHTML, fetchGOAlerts, removeKeysFromObject } from './helpers';
import { GoAlertSchema, type GoAlert } from './helpers/schema';
import { safeParse } from 'valibot';

// how we know there's been an update
// 1. check the last updated timestamp
// 2. if it's different, then there's been an update
// 3. gather all of the alerts from the different services
// 4. filter out the services that have no alerts
// 5. check the saag notification length and content
// 6. if there are changes, then send the update to threads and update the cache
// 7. if not, exit

export default {
	async scheduled(_, env, __): Promise<void> {
		try {
			const alerts = await fetchGOAlerts();
			const modifiedAlerts = removeKeysFromObject(['TrainAnnouncements', 'BusAnnouncements'], alerts) as GoAlert;
			const result = safeParse(GoAlertSchema, modifiedAlerts);
			if (!result.success) {
				console.log('unexpected response from api, exiting');
				return;
			}
			const lastUpdatedTimestamp = await env.go_service_alerts.get(alerts.LastUpdated);
			if (alerts.LastUpdated === lastUpdatedTimestamp) {
				console.log('no new alerts, exiting');
				return;
			}

			const trainRoutesWithNotifications = modifiedAlerts.Trains.Train.filter(
				(train) => train?.SaagNotifications.SaagNoficiation && train?.SaagNotifications?.SaagNoficiation.length > 0
			);
		} catch (error) {
			console.error('unhandled error', error);
		}
	},
} satisfies ExportedHandler<Env>;
