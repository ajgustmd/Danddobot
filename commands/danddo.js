const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('단또')
        .setDescription('단또'),
    async execute(interaction) {
        await interaction.reply('애옹');
    },
};