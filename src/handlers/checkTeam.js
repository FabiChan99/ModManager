const config = require('../config');


async function CheckIfTeamMember(interaction) {
	const member = await interaction.guild.members.fetch(interaction.user.id);
	return !!member.roles.cache.has(config.ManagedGuildStaffRoleID);

}

module.exports = { CheckIfTeamMember };