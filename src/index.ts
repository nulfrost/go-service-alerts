import { extractContentFromHTML, fetchGOAlerts } from './helpers';
import { GoAlertSchema } from './helpers/schema';
import { safeParse } from 'valibot';

// how we know there's been an update
// 1. check the last updated timestamp
// 2. if it's different, then there's been an update
// 3. gather all of the alerts from the different services
// 4. filter out the services that have no alerts
// 5. check the notification content to see if it has changed
// 6. if not, then there's no update
// 7. if it has, then send the update to threads and update the cache

export default {
	async scheduled(_, env, __): Promise<void> {
		try {
			const alerts = await fetchGOAlerts();
			const result = safeParse(GoAlertSchema, alerts);
			if (!result.success) {
				console.log('unexpected response from api, exiting');
				return;
			}
			const lastUpdatedTimestamp = await env.go_service_alerts.get(alerts.LastUpdated);
			if (alerts.LastUpdated === lastUpdatedTimestamp) {
				console.log('no new alerts, exiting');
				return;
			}

			const mergedGoAlerts = [...alerts.Buses.Bus, ...alerts.Stations.Station, ...alerts.Trains.Train];
			console.log(mergedGoAlerts.filter((service) => service.Notifications.Noficiation.length !== 0));
		} catch (error) {
			console.error('unhandled error', error);
		}
	},
} satisfies ExportedHandler<Env>;
