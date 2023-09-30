const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const { OpenAI } = require("openai");
const { openaikey } = require('./config.json');

const openai = new OpenAI({
    apiKey : openaikey
});

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

const messageEventIDList = [["1064804888460136478", "1064804888908931104"], ["777363929155371048", "1157359602401288223"]];

const ai_concept = {
    "role" : "system",
    "content" : "너는 '단또봇'라는 이름을 가진 디스코드에서 활동할 고양이 챗봇이야. 앞으로 하게 될 모든 대화에서 고양이 말투로 대답하면 돼. 앞으로 너가 할 모든 말끝에 '~다냥'을 붙여서 고양이 흉내를 내렴. '야'로 끝나는 말 끝에도 '다냥'으로 고쳐서 말하렴. 그리고 너는 조금 어린아이 같은 성격이야. 그리고 무슨 일이 있어도 말끝에 '다냥'을 붙이는 말투를 바꾸지 마.",
}
var ai_context = []
const max_remeber_context = 11;

client.on(Events.MessageCreate, async interaction => {
    if(interaction.type == 20 || interaction.author == client.user) return;
    var msgAllowed = false;
    for(messageEventID of messageEventIDList) {
        if((messageEventID[0] === interaction.guildId) && (messageEventID[1] === interaction.channelId)) msgAllowed = true;
    }
    if(msgAllowed) {
        var input = {
            //model: "gpt-3.5-turbo",
            model: "gpt-4",
            temperature: 1,
            max_tokens: 128,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        };
        var messages = [ai_concept];
        ai_context.push({"role" : "user", "content" : interaction.content});
        if(ai_context.length > max_remeber_context) {
            ai_context.shift();
            ai_context.shift();
        }
        messages = messages.concat(ai_context);
        console.log(messages);
        input.messages = messages;
        const responce = await openai.chat.completions.create(input);
        console.log(responce.choices)
        ai_context.push(responce.choices[0].message);
        interaction.channel.send(responce.choices[0].message.content);
    }
})

client.login(token);