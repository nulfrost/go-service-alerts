import * as v from 'valibot';

export const GoAlertSchema = v.object({
	LastUpdated: v.string(),
	TotalUpdates: v.number(),
	Trains: v.object({
		TotalUpdates: v.number(),
		Train: v.array(
			v.object({
				CorridorName: v.string(),
				CorridorCode: v.string(),
				Status: v.string(),
				Notifications: v.object({
					Noficiation: v.array(
						v.object({
							SubCategory: v.string(),
							Code: v.string(),
							Name: v.string(),
							MessageSubject: v.string(),
							MessageBody: v.string(),
							PostedDateTime: v.string(),
							Rank: v.any(),
							Status: v.string(),
							ServiceMode: v.string(),
							TripNumbers: v.any(),
						})
					),
				}),
				SaagNotifications: v.object({
					SaagNoficiation: v.array(v.any()),
				}),
				TotalUpdates: v.number(),
				LineColour: v.string(),
			})
		),
	}),
	Buses: v.object({
		TotalUpdates: v.number(),
		Bus: v.array(
			v.object({
				Route: v.string(),
				RouteName: v.string(),
				Status: v.string(),
				Notifications: v.object({
					Noficiation: v.array(
						v.object({
							SubCategory: v.string(),
							Code: v.string(),
							Name: v.string(),
							MessageSubject: v.string(),
							MessageBody: v.string(),
							PostedDateTime: v.string(),
							Rank: v.any(),
							Status: v.string(),
							ServiceMode: v.string(),
							TripNumbers: v.any(),
						})
					),
				}),
				TotalUpdates: v.number(),
				LineColour: v.string(),
			})
		),
	}),
	Stations: v.object({
		TotalUpdates: v.number(),
		Station: v.array(
			v.object({
				Route: v.string(),
				RouteName: v.string(),
				Status: v.string(),
				Notifications: v.object({
					Noficiation: v.array(
						v.object({
							SubCategory: v.string(),
							Code: v.string(),
							Name: v.string(),
							MessageSubject: v.string(),
							MessageBody: v.string(),
							PostedDateTime: v.string(),
							Rank: v.any(),
							Status: v.string(),
							ServiceMode: v.string(),
							TripNumbers: v.any(),
						})
					),
				}),
				TotalUpdates: v.number(),
			})
		),
	}),
});

export type GoAlert = v.InferInput<typeof GoAlertSchema>;
