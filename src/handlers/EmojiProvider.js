const dbManager = require('./Database/databaseManager');
const sequelizeInstance = dbManager.sequelize;
const initializeModels = require('./Database/DatabaseModels');

const models = initializeModels(sequelizeInstance);
const BotEmojiModel = models.BotEmojs;


async function getEmoji(emojiName) {
	const emoji = await BotEmojiModel.findOne({ where: { emojiname: emojiName } });
	if (emoji) {
		return emoji.get().emojistring;
	}
	else {
		return null;
	}
}

module.exports = getEmoji;
