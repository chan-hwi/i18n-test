import { GoogleSpreadsheet } from "google-spreadsheet";

const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID!);

export const init = async () => {
	await doc.useServiceAccountAuth({
		client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL!,
		private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY!.replace(/\\n/g, "\n"),
	});
};

export const read = async () => {
	await doc.loadInfo();
	const sheet = doc.sheetsByIndex[0];

	await sheet.loadHeaderRow();
	const colTitles = sheet.headerValues;
	const rows = await sheet.getRows();

	let result: { [k: string]: any } = {};

	rows.map((row) => {
		colTitles.slice(1).forEach((title) => {
			result[title] = result[title] || [];
			const key = row[colTitles[0]];
			result = {
				...result,
				[title]: {
					...result[title],
					[key]: row[title] !== "" ? row[title] : undefined,
				},
			};
		});
	});

	return result;
};
