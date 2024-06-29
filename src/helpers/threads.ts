import { GoAlert } from './schema';

type ThreadsErrorResponse = {
	error: {
		message: string;
		type: string;
		code: number;
		fbtrace_id: string;
	};
};

type TrainAlerts = GoAlert['Trains']['Train'][0]['SaagNotifications']['SaagNoficiation'];

export async function getMostRecentCachedAlert({ env, alerts }: { env: Env; alerts: KVNamespaceListResult<unknown, string> }) {
	const lastCachedAlertKey = alerts.keys[alerts.keys.length - 1].name;
	const lastCachedAlertData = await env.go_service_alerts.get(lastCachedAlertKey);
	return {
		lastCachedAlertKey,
		lastCachedAlertData,
	};
}

export function parseAlertValue(value: string): TrainAlerts {
	return JSON.parse(value);
}

export async function createThreadsMediaContainer({
	userId,
	accessToken,
	postContent,
}: {
	userId: string;
	accessToken: string;
	postContent: string;
}) {
	const response = await fetch(
		`https://graph.threads.net/v1.0/${userId}/threads?media_type=text&text=${postContent}&access_token=${accessToken}`,
		{
			method: 'POST',
		}
	);

	const { id, error }: { id: string; error: { message: string; type: string; code: number; fbtrace_id: string } } = await response.json();

	return {
		id,
		error,
	};
}

export async function publishThreadsMediaContainer({
	userId,
	mediaContainerId,
	accessToken,
}: {
	userId: string;
	mediaContainerId: string;
	accessToken: string;
}) {
	const response = await fetch(
		`https://graph.threads.net/v1.0/${userId}/threads_publish?creation_id=${mediaContainerId}&access_token=${accessToken}`,
		{
			method: 'POST',
		}
	);

	const { error }: ThreadsErrorResponse = await response.json();
	return {
		error,
	};
}

export async function sendThreadsPost({
	env,
	alertsToBePosted,
	alertsToBeCached,
	lastUpdatedTimestamp,
}: {
	env: Env;
	alertsToBePosted: TrainAlerts;
	alertsToBeCached: TrainAlerts;
	lastUpdatedTimestamp: GoAlert['LastUpdated'];
}) {
	if (alertsToBePosted && alertsToBePosted?.length !== 0) {
		for (const alert of alertsToBePosted) {
			const { id, error: mediaContainerError } = await createThreadsMediaContainer({
				userId: env.THREADS_USER_ID,
				accessToken: env.THREADS_ACCESS_TOKEN,
				postContent: encodeURIComponent(`
                        ${alert.HeadSign}
        
                        ${alert.DelayReason}\n
                    `),
			});

			if (mediaContainerError) {
				console.log('there was an error creating the media container:', mediaContainerError.message);
				return;
			}

			const { error: mediaPublishError } = await publishThreadsMediaContainer({
				userId: env.THREADS_USER_ID,
				accessToken: env.THREADS_ACCESS_TOKEN,
				mediaContainerId: id,
			});

			if (mediaPublishError) {
				console.log('there was an error publishing the media container' + mediaPublishError.message);
				return;
			}
		}
		console.log(`${alertsToBePosted.length} new threads post created on: ${new Date().toISOString()}`);
		await env.go_service_alerts.put(lastUpdatedTimestamp, JSON.stringify(alertsToBeCached));
	}
}
