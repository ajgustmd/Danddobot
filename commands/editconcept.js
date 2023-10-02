const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('editconcept')
        .setDescription('단또봇의 컨셉을 수정합니다')
        .addStringOption((option) => option.setName('concept')
            .setDescription('컨셉을 설정합니다')
            .setRequired(true)),
    async execute(interaction) {
        var msg = "수정된 컨셉 : ";
        var next_concept = interaction.options.getString('concept');
        msg += next_concept;
        const { clearContext, setConcept } = require('./chatbot.js');
        setConcept(next_concept);
        clearContext();

        return await interaction.reply(msg);
    },
};