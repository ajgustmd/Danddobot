const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('조이고')
        .setDescription('게이조이고'),
    async execute(interaction) {
        await interaction.reply('ㄱㅇㅈㅇㄱ');
    },
};