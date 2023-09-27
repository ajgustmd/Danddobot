const { SlashCommandBuilder } = require('discord.js');

isNotServerOpening = true;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pz_restart')
        .setDescription('좀보이드 서버를 재시작합니다. 만약 서버가 열려있지 않다면 그냥 서버를 시작합니다.'),
    async execute(interaction) {
	if (!isNotServerOpening) {
		await interaction.reply('서버가 이미 열리는 중이란다 기다리렴');
		return;
	}
	if (process.getuid() == 0) {
		const spawn = require("child_process").spawn;
		console.log(__dirname);
		const pythonProcess = spawn('python3', ["../sc/restart.py"]);
		await interaction.reply('좀보이드 서버를 재시작하도록 하겠다');
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
		await interaction.reply('DanddoBot이 관리자 권한으로 실행되어 있지 않아')
	}
    },
};
