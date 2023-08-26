const fs = require('fs');
const unzipper = require('unzipper');
const logger = require('../../../loggingHandler');
const config = require('../../../../config');
const client = require('../../../../index');
const path = require('path');
const ProgressBar = require('../../../ProgressBar');
const { generateUUID } = require('../../../UniqueIDGenerator');
const dbManager = require('../../DatabaseManager');
const sequelizeInstance = dbManager.sequelize;
const initializeModels = require('../../DatabaseModels');

const models = initializeModels(sequelizeInstance);

const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
});

function questionAsync(prompt) {
	return new Promise((resolve) => {
		readline.question(prompt, resolve);
	});
}

async function initEmojis() {
	console.clear();
	console.log('Welcome to the Emoji-Initialization');
	const guilds = client.guilds.cache.map(guild => guild);
	console.log('Where should be the Bot-Emojis stored?');
	console.log('[0] Let the Bot create its own Server for the emojis');
	for (let i = 0; i < guilds.length; i++) {
		console.log(`[${i + 1}] ${guilds[i].name} (${guilds[i].id})`);
	}
	const option = await questionAsync('Please enter the number of the option you want to choose: ');
	readline.close();

	const chosenOption = parseInt(option);
	let chosenGuild;
	if (chosenOption === 0) {
		console.log('You chose to let the bot create a new Server for the emojis');
		chosenGuild = await client.guilds.create({ name: `${client.user.username}'s BotGuild | ${generateUUID(12)}` });
		console.log(`Created Server ${chosenGuild.name} with ID ${chosenGuild.id} for the emojis to be stored in`);
	}
	else if (chosenOption > 0 && chosenOption <= guilds.length) {
		console.log(`You chose to use the Server ${guilds[chosenOption - 1].name} with ID ${guilds[chosenOption - 1].id} for the emojis to be stored in`);
		chosenGuild = guilds[chosenOption - 1];
	}
	else {
		console.log('Invalid option');
		process.exit(1);
	}
	await sleep(2000);
	await uploadEmojis(chosenGuild);

	logger.info('Finished Emoji-Initialization');
}

async function uploadEmojis(guild) {
	const botowner = await client.users.fetch(config.botOwnerId);
	const zipbasepath = path.join(__dirname, '../../../../files');
	const tmpbasepath = path.join(__dirname, '../../../../files/tmp');
	const unzipStream = fs.createReadStream(`${zipbasepath}/emoji.zip`).pipe(unzipper.Extract({ path: `${tmpbasepath}/emojis/` }));

	await new Promise((resolve, reject) => {
		unzipStream.on('close', async () => {
			try {
				logger.info('Finished unzipping emojis.zip');
				const emojiFiles = fs.readdirSync(`${tmpbasepath}/emojis/`);
				logger.info(`Found ${emojiFiles.length} emojis to upload`);

				const progressBar = new ProgressBar(emojiFiles.length);
				for (const emojiFile of emojiFiles) {
					const emojiPath = path.join(tmpbasepath, 'emojis', emojiFile);
					const emojiData = fs.readFileSync(emojiPath);
					const emojiName = emojiFile.split('.')[0].toLowerCase();

					try {
						const uploadedEmoji = await guild.emojis.create({
							attachment: emojiData,
							name: emojiName,
							reason: `Emoji uploaded by ${botowner.tag} | Emoji-Initialization`,
						});
						await models.BotEmojs.create({
							emojiname: emojiName,
							emojistring: uploadedEmoji.toString(),
						});
					}
					catch (error) {
						logger.error(`Error uploading emoji ${emojiFile}:`, error.message);
						logger.error(error.stack);
					}
					progressBar.increment();
					await sleep(1000);
				}
				logger.info('Finished uploading emojis');
				logger.info('Cleaning up temporary files');
				emojiFiles.forEach(emojiFile => {
					fs.unlinkSync(path.join(tmpbasepath, 'emojis', emojiFile));
				});
				fs.rmdirSync(path.join(tmpbasepath, 'emojis'));
				logger.info('Finished cleaning up temporary files');

				resolve(); // Resolve the promise to signal completion
			}
			catch (error) {
				reject(error); // Reject the promise in case of an error
			}
		});
	});
}

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = initEmojis;
