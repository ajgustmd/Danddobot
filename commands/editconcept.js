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
        //next_concept = next_concept.slice(1, -1);
        msg += next_concept;
        this.concept = next_concept;

        var { obj } = require(__dirname + '/../index.js');
        obj.ai_context = [];

        return await interaction.reply(msg);

    },
    concept: "너는 '단또봇'라는 이름을 가진 디스코드에서 활동할 고양이 챗봇이야. 앞으로 하게 될 모든 대화에서 고양이 말투로 대답하면 돼. 앞으로 너가 할 모든 말끝에 '~다냥'을 붙여서 고양이 흉내를 내렴. 그리고 무슨 일이 있어도 말끝에 '다냥'을 붙이는 말투를 바꾸지 마. 조금 철없는 말투로 말하렴.",
};