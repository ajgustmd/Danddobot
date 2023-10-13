const { SlashCommandBuilder } = require('discord.js');
const path = '../danddo/chatbot/chatbot.js';
const { clearContext } = require(path);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatbot')
        .setDescription('단또봇의 챗봇 기능을 조작합니다')
        .addSubcommand((subcommand) => subcommand.setName('debugmode')
            .setDescription("디버그 모드를 활성화/비활성화 합니다."))
        .addSubcommand((subcommand) => subcommand.setName('info')
            .setDescription("현재 챗봇 정보를 출력합니다"))
        .addSubcommand((subcommand) => subcommand.setName('savedb')
            .setDescription('호감도와 문맥이 저장된 유저별 프로필 DB를 저장합니다'))
        .addSubcommandGroup((group) => group.setName('set')
            .setDescription('챗봇의 설정 값을 수정합니다. 챗봇 설정 값을 수정할 때 챗봇과의 대화 기록은 초기화됩니다')
            .addSubcommand((subcommand) => subcommand.setName('model')
                .setDescription('GPT 모델을 수정합니다')
                .addStringOption((option) => option.setName('modelname')
                    .setDescription('모델 이름')
                    .setChoices(
                        { name: "gpt-3.5-turbo", value: "gpt-3.5-turbo"}, // Default
                        { name: "gpt-3.5-turbo-16k", value: "gpt-3.5-turbo-16k"},
                        { name: "gpt-4", value: "gpt-4"})))
            .addSubcommand((subcommand) => subcommand.setName('temperature') // 1
                .setDescription('temperature 값을 수정합니다')
                .addNumberOption((option) => option.setName('temperature')
                    .setDescription('temperature')))
            .addSubcommand((subcommand) => subcommand.setName('max_tokens') // 128
                .setDescription('max_tokens 값을 수정합니다')
                .addIntegerOption((option) => option.setName('max_tokens')
                    .setDescription('max_tokens')))
            .addSubcommand((subcommand) => subcommand.setName('top_p') // 1
                .setDescription('top_p 값을 수정합니다')
                .addNumberOption((option) => option.setName('top_p')
                    .setDescription('top_p')))
            .addSubcommand((subcommand) => subcommand.setName('frequency_penalty') // 0
                .setDescription('frequency_penalty 값을 수정합니다')
                .addNumberOption((option) => option.setName('frequency_penalty')
                    .setDescription('frequency_penalty')))
            .addSubcommand((subcommand) => subcommand.setName('presence_penalty') // 0
                .setDescription('presence_penalty 값을 수정합니다')
                .addNumberOption((option) => option.setName('presence_penalty')
                    .setDescription('presence_penalty')))
            .addSubcommand((subcommand) => subcommand.setName('concept')
                .setDescription('AI의 컨셉을 수정합니다')
                .addStringOption((option) => option.setName('concept')
                    .setDescription('컨셉')
                    .setRequired(true)))  
            .addSubcommand((subcommand) => subcommand.setName('max_remember') // 2
                .setDescription('기억할 수 있는 최대 대화 갯수를 수정합니다')
                .addIntegerOption((option) => option.setName('max_remember')
                    .setDescription('max_remember')))
            .addSubcommand((subcommand) => subcommand.setName('init')
                .setDescription('챗봇의 모델, temperature, max_tokens, top_p, frequency_penalty, presence_penalty 값을 기본값으로 초기화 합니다'))),
        async execute(interaction) {
            grp = interaction.options.getSubcommandGroup();
            sub = interaction.options.getSubcommand();
            if (sub === 'debugmode') {
                const { toggleDebug, isDebugmode } = require(path);
                toggleDebug();
                await interaction.reply('디버그 모드 : ' + isDebugmode());
            }
            else if (sub === 'info') {
                const { getInfo } = require(path);
                await interaction.reply(getInfo());
            }
            else if (sub === 'savedb') {
                const { saveDB } = require(path);
                saveDB();
                await interaction.reply("프로필이 저장되었다냥~");
            }
            if (interaction.options.getSubcommandGroup() === 'set') {
                sub = interaction.options.getSubcommand();
                if (sub === 'model') {
                    const { setModel } = require(path);
                    model = interaction.options.getString('modelname');
                    setModel(model);
                    await interaction.reply('설정된 모델 : ' + model);
                }
                else if (sub === 'temperature') {
                    const { setTemperature } = require(path);
                    temperature = interaction.options.getNumber('temperature');
                    setTemperature(temperature);
                    await interaction.reply('설정된 temperature : ' + temperature);
                }
                else if (sub === 'max_tokens') {
                    const { setMaxtokens } = require(path);
                    max_tokens = interaction.options.getInteger('max_tokens');
                    setMaxtokens(max_tokens);
                    await interaction.reply('설정된 max_tokens : ' + max_tokens);
                }
                else if (sub === 'top_p') {
                    const { setTop_p } = require(path);
                    top_p = interaction.options.getNumber('top_p');
                    setTop_p(top_p);
                    await interaction.reply('설정된 top_p : ' + top_p);
                }
                else if (sub === 'frequency_penalty') {
                    const { setFrequency_penalty } = require(path);
                    frequency_penalty = interaction.options.getNumber('frequency_penalty');
                    setFrequency_penalty(frequency_penalty);
                    await interaction.reply('설정된 frequency_penalty : ' + frequency_penalty); 
                }
                else if (sub === 'presence_penalty') {
                    const { setPresence_penalty } = require(path);
                    presence_penalty = interaction.options.getNumber('presence_penalty');
                    setPresence_penalty(presence_penalty);
                    await interaction.reply('설정된 presence_penalty : ' + presence_penalty); 
                }
                else if (sub === 'concept') {
                    const { setConcept } = require(path);
                    concept = interaction.options.getString('concept');
                    setConcept(concept);
                    await interaction.reply('설정된 컨셉 : ' + concept);
                }
                else if (sub === 'max_remember') {
                    const { setMaxremember } = require(path);
                    max_remember = interaction.options.getInteger('max_remember');
                    setMaxremember(max_remember);
                    await interaction.reply('설정된 최대 기억 문맥 : ' + max_remember);
                }
                else if (sub === 'init') {
                    const { initVal } = require(path);
                    initVal();
                    await interaction.reply('설정값이 초기화 되었습니다');
                }
                clearContext();
            }
        }
}