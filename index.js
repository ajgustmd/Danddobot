const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        console.log(command.data.name);
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        // 지정된 길드가 아니라면 명령어 사용 거부
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral:true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true});
            }
        }
    }
    if (interaction.isAutocomplete()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.autocomplete(interaction);
        } catch (error) {
            console.log(error);
        }
    }

});

const { messageEventIDList } = require('./danddo/chatbot/config.json');

creatingResponce = false;

client.on(Events.MessageCreate, async interaction => {
    if(interaction.type == 20 || interaction.author == client.user) return;
    var msgAllowed = false;
    for(messageEventID of messageEventIDList) {
        if((messageEventID[0] === interaction.guildId) && (messageEventID[1] === interaction.channelId)) msgAllowed = true;
    }
    if(msgAllowed) {
        const { getResponce } = require('./danddo/chatbot/chatbot.js');
        try {
            if(!creatingResponce) {
                creatingResponce = true;
                responce = await getResponce(interaction.content, interaction.guildId, interaction.author.id);
                interaction.channel.send(responce);
                creatingResponce = false;
            }
            else {
                interaction.author.send('메세지가 이미 생성 중이다냥. 나중에 다시 시도해주라냥.');
                interaction.delete();
            }
        }
        catch (e) {
            interaction.channel.send(e.name + " : " + e.message);
        }
    }
})

client.login(token);