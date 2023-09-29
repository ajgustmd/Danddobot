const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('선택한 서버를 재시작합니다.')
        .addStringOption((option) => option.setName('게임')
            .setDescription('게임 이름')
            .setChoices(
                { name: '프로젝트 좀보이드', value: 'projectzomboid'}, 
                { name: '코어키퍼', value: 'corekeeper'}))
        .addStringOption((option) => option.setName('서버')
            .setDescription('서버 이름')
            .setChoices({ name: '단또서버', value: 'danddo'})),
    async execute(interaction) {
        const gameName = interaction.options.getString('게임');
        const serverName = interaction.options.getString('서버');
        if(!isNotServerOpening) {
            // isNotServerOpening도 게임서버마다 열려있는 지 정보를 확인할 수 있어야 함
            interaction.reply('서버가 이미 열리는 중이란다 기다리렴');
            return;
        }

        if(gameName == 'projectzomboid' && serverName == 'danddo') {
            if(isNotServerOpening)
            restartServer(interaction, gameName, serverName);
        } else {
            interaction.reply('테스트 오류1');
            return;
        }
    },
};

/*
    서버가 열려있는지 판별이 가능할 때에는 열려있을 때에만 가능
    불가능한 게임이라면 재시작 쿨타임 적용
*/

function restartServer(interaction, game, server) {
	if (process.getuid() == 0) {
		const spawn = require("child_process").spawn;
		const pythonProcess = spawn('python3', ["./sc/restart.py"]);
		interaction.reply('서버를 재시작하도록 하겠다');
		isNotServerOpening = false;
		pythonProcess.stdout.on('data', (data) => {
			console.log(data.toString());
			if (data.toString() === "SERVER_STARTED\n") {
				console.log('서버가 열렸습니다');
				interaction.channel.send('서버가 열렸단다');		
				isNotServerOpening = true;
			}
		});
	} else {
		interaction.reply('DanddoBot이 관리자 권한으로 실행되어 있지 않아')
	}
}

