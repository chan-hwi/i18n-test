const { GoogleSpreadsheet } = require("google-spreadsheet");
const fs = require("fs");
const {
	spreadsheet_id,
	private_key,
	client_email,
} = require("./google_key.json");

const doc = new GoogleSpreadsheet(spreadsheet_id);

const init = async () => {
	await doc.useServiceAccountAuth({
		client_email,
		private_key,
	});
};

const read = async () => {
	await doc.loadInfo();
	let result = {};

	for (let i = 0; i < doc.sheetCount; i++) {
		const sheet = doc.sheetsByIndex[i];

		await sheet.loadHeaderRow();
		const colTitles = sheet.headerValues;
		const rows = await sheet.getRows();
		result[sheet.title] = {};

		rows.map((row) => {
			colTitles.slice(1).forEach((title) => {
				result[sheet.title][title] = result[sheet.title][title] || [];
				const key = row[colTitles[0]];
				result[sheet.title] = {
					...result[sheet.title],
					[title]: {
						...result[sheet.title][title],
						[key]: row[title] !== "" ? row[title] : undefined,
					},
				};
			});
		});
	}

	console.log(result);
	return result;
};

const write = (data) => {
	if (fs.existsSync("./public/locales"))
		fs.rmSync("./public/locales", { recursive: true });
	Object.keys(data).forEach((sheet) => {
		Object.keys(data[sheet]).forEach((key) => {
			fs.mkdirSync(`./public/locales/${key}`, { recursive: true });
			fs.writeFile(
				`./public/locales/${key}/${sheet}.json`,
				JSON.stringify(data[sheet][key], null, 2),
				(err) => {
					if (err) {
						console.log(err);
					}
				}
			);
		});
	});
};

init()
	.then(() => read())
	.then((data) => write(data))
	.catch((err) => console.log(err));
