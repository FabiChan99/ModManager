const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dbManager = require('../../handlers/Database/databaseManager');
const sequelizeInstance = dbManager.sequelize;
const initializeModels = require('../../handlers/Database/DatabaseModels');
const models = initializeModels(sequelizeInstance);
const FlagModel = models.Flags;
const config = require('./../../config');
const { getCurrentUnixTimeStamp } = require('../../handlers/getCurrentUnixTimeStamp');
const { generateUUID } = require('../../handlers/UniqueIDGenerator');
const { CheckIfTeamMember } = require('../../handlers/checkTeam');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('flag')
		.setDescription('Flags a User in his Userinfo profile (Staff-internal Notes)')
		.addUserOption(option => option.setName('user').setDescription('The User you want to flag').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('The Reason for the Flag').setRequired(true)),
	async execute(interaction) {
		try {
			if (!await CheckIfTeamMember(interaction)) {
				await interaction.reply({ content: 'You are not allowed to use this command! You need to be a Staffmember to use this Command', ephemeral: true });
				return;
			}
			const reason = interaction.options.getString('reason');
			const userOption = interaction.options.getUser('user');
			const user_flags = await FlagModel.findAll({ where: { userid: userOption.id } });
			const user_flags_count = user_flags.length;
			const caseid = generateUUID(8);
			await FlagModel.create({
				userid: userOption.id,
				punisherid: interaction.user.id,
				description: reason,
				datum: getCurrentUnixTimeStamp(),
				caseid: caseid,
			});

			const embed = new EmbedBuilder()
				.setTitle('User flagged')
				.setDescription(`The user ${userOption.username} \`${userOption.id}\` got flagged!\n Reason: \`\`\`${reason}\`\`\`This user has now __${user_flags_count + 1} flag(s)__. \nFlag-ID: \`\`${caseid}\`\``)
				.setColor(config.EmbedColor).setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
			await interaction.reply({ embeds: [embed], ephemeral: false });


		}
		catch (error) {
			console.error(error);
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};
