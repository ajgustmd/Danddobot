const { SlashCommandBuilder } = require('discord.js');

const fs = require('node:fs');

// server restart, kill, update 추가 예정

isServerOpening = {};
const infoPath = "./serverInfo.json";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('선택한 서버를 재시작합니다.')
        .addStringOption((option) => option.setName('게임')
            .setDescription('게임 이름')
            .setRequired(true)
            .setAutocomplete(true))
        .addStringOption((option) => option.setName('서버')
            .setDescription('서버 이름')
            .setRequired(true)
            // 굳이 Autocomplete 를 두 개를 사용할 필요가 없어보임. 게임-서버 로 묶어서 Autocomplete 하나로 해결하도록 수정
            .setAutocomplete(true)),
    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        let choices = [];
        serverInfo = JSON.parse(fs.readFileSync(infoPath));

        if (focusedOption.name === '게임') {
            for(var e in serverInfo) {
                choices.push({name:serverInfo[e].name, value:e});
            }
        }
        else if (focusedOption.name === '서버') {
            var gameName = interaction.options.getString('게임');
            console.log(gameName);
            if (!gameName) {
                // skip filling choices
            } else {
                var serverlist = serverInfo[gameName].server;
                for(var e in serverlist) {
                    choices.push({name:serverlist[e].name, value:e});
                }
            }
        }
        await interaction.respond(choices);
    },
    async execute(interaction) {
        const gameName = interaction.options.getString('게임');
        const serverName = interaction.options.getString('서버');
        if(!isServerOpening[gameName]) isServerOpening[gameName] = {};
        if(isServerOpening[gameName][serverName]) {
            interaction.reply('서버가 이미 열리는 중이란다 기다리렴');
            return;
        }

        if(gameName == 'projectzomboid' && serverName == 'danddo') {
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

function restartServer(interaction, gameName, serverName) {
	if (process.getuid() == 0) {
        var info = JSON.parse(fs.readFileSync(infoPath));
        var sh_path = info[gameName].sh_path;
        info = info[gameName].server[serverName];
        var user = info.user;
        var dir = info.dir;
        var session = info.session;
        var servername = info.servername;
        var log = info.log;
		const spawn = require("child_process").spawn;
		const pythonProcess = spawn('python3', ["./sc/restart.py", sh_path, user, dir, session, servername, log]);
		interaction.reply('서버를 재시작하도록 하겠다');
		isServerOpening[gameName][serverName] = true;
		pythonProcess.stdout.on('data', (data) => {
			console.log(data.toString());
			if (data.toString() === "SERVER_STARTED\n") {
				console.log('서버가 열렸습니다');
				interaction.channel.send('서버가 열렸단다');		
				isNotServerOpening[gameName][serverName] = false;
			}
		});
	} else {
		interaction.reply('DanddoBot이 관리자 권한으로 실행되어 있지 않아')
	}
}

