const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dbManager = require('../../handlers/Database/databaseManager');
const sequelizeInstance = dbManager.sequelize;
const initializeModels = require('../../handlers/Database/DatabaseModels');
const models = initializeModels(sequelizeInstance);
const { time } = require('discord.js');
const WarnModel = models.Warns;
const FlagModel = models.Flags;
const { getEmoji } = require('../../handlers/EmojiProvider');
const config = require('./../../config');
const fetchUserIfNotCached = require('../../handlers/CacheHandler/fetchUserIfNotCached');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Shows Informations about a User!').addUserOption(option => option.setName('user').setDescription('The User you want to get Informations about!').setRequired(true)),
	async execute(interaction) {
		try {
			await interaction.deferReply();
			const userOption = interaction.options.getUser('user');
			let isMember = false;
			let member = null;
			try {
				member = await interaction.guild.members.fetch(userOption.id);
				isMember = true;
			}
			catch (error) {
				isMember = false;
			}
			const bot_indicator = userOption.bot ? `${await getEmoji('bot')}` : '';
			const user_flags = await FlagModel.findAll({ where: { userid: userOption.id } });
			const user_warns = await WarnModel.findAll({ where: { userid: userOption.id } });
			const user_pemwarns = await WarnModel.findAll({ where: { userid: userOption.id, perma: true } });

			const userStatus = member?.presence?.status || 'offline';
			const userStatusEmoji = userStatus === 'online' ? await getEmoji('available') : userStatus === 'idle' ? await getEmoji('idle') :
				userStatus === 'streaming' ? await getEmoji('streaming') :
					userStatus === 'dnd' ? await getEmoji('dnd') : await getEmoji('offline');
			let platform;

			if (isMember) {
				const clientStatus = member.presence?.clientStatus;
				platform = clientStatus?.desktop ? 'User is using Discord on desktop' :
					clientStatus?.mobile ? 'User is using Discord on mobile' :
						clientStatus?.web ? 'User is using Discord on web' :
							'Platform not detectable';
			}
			else {
				platform = 'Platform not detectable. User is not in the server';
			}

			const flagResults = [];
			for (const flag of user_flags) {
				const flagtimestamp = new Date(parseInt(flag.datum) * 1000);
				const flagtime = time(flagtimestamp, 'R');
				const flagpunisher = await fetchUserIfNotCached(interaction.client, flag.punisherid);
				flagResults.push(`[${flagpunisher.username}, \`${flag.caseid}\`] ${flagtime} - ${flag.description}`);
			}
			const warnResults = [];
			for (const warn of user_warns) {
				const warntimestamp = new Date(parseInt(warn.datum) * 1000);
				const warntime = time(warntimestamp, 'R');
				const warnpunisher = await fetchUserIfNotCached(interaction.client, warn.punisherid);
				warnResults.push(`[${warnpunisher.username}, \`${warn.caseid}\`] ${warntime} - ${warn.description}`);
			}
			const pemwarnResults = [];
			for (const pemwarn of user_pemwarns) {
				const pemwarntimestamp = new Date(parseInt(pemwarn.datum) * 1000);
				const pemwarntime = time(pemwarntimestamp, 'R');
				const pemwarnpunisher = await fetchUserIfNotCached(interaction.client, pemwarn.punisherid);
				pemwarnResults.push(`[${pemwarnpunisher.username}, \`${pemwarn.caseid}\`] ${pemwarntime} - ${pemwarn.description}`);
			}

			const flagstring = user_flags.length > 0
				? `__**All Flags (${user_flags.length})**__\n${flagResults.join('\n\n')}`
				: `__**All Flags (${user_flags.length})**__\nNothing found.`;

			const warnstring = user_warns.length > 0
				? `__**All Warns (${user_warns.length})**__\n${warnResults.join('\n\n')}`
				: `__**All Warns (${user_warns.length})**__\nNothing found.`;

			const pemwarnstring = user_pemwarns.length > 0
				? `__**All Permanent Warns (${user_pemwarns.length})**__\n${pemwarnResults.join('\n\n')}`
				: `__**All Permanent Warns (${user_pemwarns.length})**__\nNothing found.`;
			let generatedEmbed = null;
			if (isMember) {
				const staffRoleID = config.ManagedGuildStaffRoleID;


				const staffUsers = Array.from(
					// eslint-disable-next-line no-shadow
					interaction.guild.members.cache.filter(member =>
						member.roles.cache.some(role => role.id === staffRoleID),
					).values(),
				);
				let staffuser = false;
				if (staffUsers.includes(member)) {
					staffuser = true;
				}

				const stafficon = staffuser ? await getEmoji('staff') : '';
				const boosticon = member.premiumSince ? await getEmoji('booster') : '';
				let timeouticon = '';
				if (member.communicationDisabledUntil > Date.now()) {
					timeouticon = await getEmoji('timeout');
				}

				let userindicator = '';
				if (staffuser) {
					userindicator = 'Serverstaff';
				}
				else {
					// eslint-disable-next-line no-unused-vars
					userindicator = 'User';
				}
				const vc_icon = member.voice.channel ? await getEmoji('voiceuser') : '';
				const boost_string = member.premiumSince ? `Boosting since: ${time(member.premiumSince, 'R')}` : '';
				const servernick = member.nickname != null ? ` \n*Aka. **${member.Nickname}**` : '';
				const user = await fetchUserIfNotCached(interaction.client, userOption.id);
				let userinfostring =
					'**The Member**' + `\n${user.username} \`${member.id}\`${servernick}\n` + `${boost_string}\n`;
				userinfostring += '**Creation, Join and more**\n';
				userinfostring += `**Created:** ${time(member.user.createdAt, 'R')}\n`;
				userinfostring += `**Joined:** ${time(member.joinedAt, 'R')}\n`;
				userinfostring += `**Infobadges:** ${boosticon} ${stafficon} ${bot_indicator}${vc_icon} ${timeouticon}\n\n`;
				userinfostring += '**Online-Status and Platform**\n';
				userinfostring += `${userStatusEmoji} | ${userStatus} - ${platform}\n\n`;
				userinfostring += '**Communication Timeout**\n';
				userinfostring += `${member.communicationDisabledUntil > Date.now() ? 'User is currently timed out' : 'User is not timed out'}\n\n`;
				userinfostring += '**Current Voice Channel**\n' +
					`${member.voice.channel ? `<#${member.voice.channel.id}>` : 'User is not in a Voice Channel'}\n\n`;
				userinfostring += flagstring + '\n\n';
				userinfostring += warnstring + '\n\n';
				userinfostring += pemwarnstring + '\n\n';

				generatedEmbed = new EmbedBuilder()
					.setDescription(userinfostring).setColor(config.EmbedColor)
					.setTitle('Information about a Guild member')
					.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
					.setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
			}
			else {
				let ban_entry;
				let ban_icon;
				try {
					ban_entry = await interaction.guild.bans.fetch(userOption.id);
					ban_icon = await getEmoji('banicon');
				}
				catch (error) {
					ban_icon = '';
				}
				const user = await fetchUserIfNotCached(interaction.client, userOption.id);
				let userinfostring =
					'**The User**' + `\n${user.username} \`${user.id}\`\n` + '\n';
				userinfostring += '**Creation, Join and more**\n';
				userinfostring += `**Created:** ${time(user.createdAt, 'R')}\n`;
				userinfostring += '**Joined:** *User is not in Guild*\n';
				userinfostring += `**Infobadges:** ${bot_indicator}${ban_icon}\n\n`;
				userinfostring += '**Online-Status and Platform**\n';
				userinfostring += `${userStatusEmoji} | ${userStatus} - ${platform}\n\n`;
				userinfostring += flagstring + '\n\n';
				userinfostring += warnstring + '\n\n';
				userinfostring += pemwarnstring + '\n\n';
				if (ban_entry) {
					userinfostring += '__**Ban-Status**__\n';
					userinfostring += `${ban_entry ? 'User is banned from the Guild:\n' + `\`\`\`${ban_entry.reason}\`\`\`` : 'User is not banned from the Guild.'}\n\n`;
				}

				generatedEmbed = new EmbedBuilder()
					.setDescription(userinfostring).setColor(config.EmbedColor)
					.setTitle('Information about a Discord User')
					.setThumbnail(user.displayAvatarURL({ dynamic: true }))
					.setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
			}
			await interaction.followUp({ embeds: [generatedEmbed] });

		}
		catch (error) {
			console.error(error);
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	},
};