const { OpenAI } = require("openai");
const { openaikey, activeChannel, devChannel, debugChannel } = require('./config.json');
const prompt = require('./prompt.json');
const fs = require('node:fs');

const openai = new OpenAI({
    apiKey : openaikey
});

const dbPath = './database.json';

max_remeber_context = 4;

// 프로그램 규모가 작아서 DB는 그냥 메모리로 사용하기로 결정
chatbotDB = loadDB(); // chatbotDB[userId] = { friendship, context }
bCreatingMsg = {}; // bCreatingMsg[combinedId or userId]

devContext = [];
bDevCreatingMsg = false;

ai_concept = "너는 '단또봇'라는 이름을 가진 디스코드에서 활동할 고양이 챗봇이야. 앞으로 하게 될 모든 대화에서 고양이 말투로 대답하면 돼. 앞으로 너가 할 모든 말끝에 '~다냥'을 붙여서 고양이 흉내를 내렴. 그리고 무슨 일이 있어도 말끝에 '다냥'을 붙이는 말투를 바꾸지 마. 조금 철없는 말투로 말하렴.";

default_val = {
    model : "gpt-3.5-turbo",
    temperature : 1,
    max_tokens : 900,
    top_p : 1,
    frequency_penalty : 0,
    presence_penalty : 0,
};

minDecreaseFriendship = -10;
maxIncreaseFriendship = 6;
defaultFriendship = 0;

model = default_val.model;
temperature = default_val.temperature;
max_tokens = default_val.max_tokens;
top_p = default_val.top_p;
frequency_penalty = default_val.frequency_penalty;
presence_penalty = default_val.presence_penalty;

debugmode = false;

setInterval(saveDB, 1000 * 60 * 30);

function getCombinedKey(guildId, channelId) {
    return `${guildId}-${channelId}`;
}

function getPrompt(friendship) {
    if(friendship >= 23) return prompt.favorable;
    else if(friendship >= 10) return prompt.friendly;
    else if(friendship >= -3) return prompt.neutral;
    else return prompt.hostile;
}

function getdFriendlyMultiplier(dfriendly) {
    if(dfriendly > 0) {
        return Math.random() * 0.7 + 0.2; 
    }
    else return Math.random() * 1.5 + 0.5;
}

// Database
function saveDB() {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(chatbotDB));
    } catch (e) {
        return;
    }
}

function loadDB() {
    try {
        var db = JSON.parse(fs.readFileSync(dbPath));
        if(db) return db;
        else return {};
    } catch (e) {
        console.log(e);
        return {};
    }
}

function isDebugChannel(guildId, channelId) { return debugmode && (debugChannel === getCombinedKey(guildId, channelId)); }

module.exports = {
    async getDevResponce(content) {
        bDevCreatingMsg = true;
        var input = {
            model: model,
            temperature: temperature,
            max_tokens: max_tokens,
            top_p: top_p,
            frequency_penalty: frequency_penalty,
            presence_penalty: presence_penalty,
        };

        var system = {
            "role" : "system",
            "content" : ai_concept,
        }
        console.log(input);

        var messages = [system];
        while(devContext.length > max_remeber_context) {
            devContext.shift();
        }
        devContext.push({"role" : "user", "content" : content});
        messages = messages.concat(devContext);
        console.log(messages);
        input.messages = messages;
        try {
            const responce = await openai.chat.completions.create(input);
            //console.log(responce.choices)
            devContext.push(responce.choices[0].message);
            return responce.choices[0].message.content;
        }
        catch (e) {
            return e.name + " : " + e.message; 
        }
        finally {
            bDevCreatingMsg = false;
        }
    },

    async getResponce(content, guildId, channelId, userId) {
        bCreatingMsg[userId] = true;
        bCreatingMsg[getCombinedKey(guildId, channelId)] = true;
        var judge = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k",
            temperature: 1,
            max_tokens: 64,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: ["]"],
            messages: [{
                "role" : "system",
                "content" : prompt.judge
            }, {
                "role" : "user",
                "content" : content
            }]
        });

        judge = judge.choices[0].message.content;

        judge = Number(judge.replace(/[^0-9\-]/g, ""));
        var dfriendly = judge;
        dfriendly *= getdFriendlyMultiplier(dfriendly);

        dfriendly = Math.min(Math.max(dfriendly, minDecreaseFriendship), maxIncreaseFriendship);

        if(!chatbotDB[userId]) chatbotDB[userId] = { friendship: defaultFriendship, context: []};
        var friendship = chatbotDB[userId].friendship;
        friendship += dfriendly;
        var system = getPrompt(friendship);
        chatbotDB[userId].friendship = friendship;

        const max_remember = 4;
        var context = chatbotDB[userId].context;
        while(context.length > max_remember) {
            context.shift();
        }
        context.push({"role" : "user", "content" : content});
        var messages = [{"role" : "system", "content" : system}];
        messages = messages.concat(context);
        console.log(messages);
        try {
            const responce = await openai.chat.completions.create({
                model: "gpt-3.5-turbo-16k",
                temperature: 1.07,
                max_tokens: 900,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                messages: messages
            });
            context.push(responce.choices[0].message);
            if(isDebugChannel(guildId, channelId)) {
                return responce.choices[0].message.content + "\n[debug]\n호감도 변화량 : " + dfriendly.toFixed(2) + "\n현재 호감도 : " + chatbotDB[userId].friendship.toFixed(2);
            }
            return responce.choices[0].message.content;
        }
        catch (e) {
            console.log(e);
            context.pop();
            if(isDebugChannel(guildId, channelId)) {
                return e.name + " : " + e.message;
            }
            return "에러가 발생했다냥..";
        }
        finally {
            bCreatingMsg[userId] = false;
            bCreatingMsg[getCombinedKey(guildId, channelId)] = false;
        }
    },

    clearContext() {
        devContext = [];
    },
    setModel(_model) { model = _model; },
    setTemperature(_temperature) { temperature = _temperature; },
    setMaxtokens(_max_tokens) { max_tokens = _max_tokens; },
    setTop_p(_top_p) { top_p = _top_p; },
    setFrequency_penalty(_frequency_penalty) { frequency_penalty = _frequency_penalty; },
    setPresence_penalty(_presence_penalty) { presence_penalty = _presence_penalty; },
    setConcept(_concept) { ai_concept = _concept; },
    setMaxremember(_max_remember) { max_remeber_context = _max_remember * 2; },

    initVal() {
        model = default_val.model;
        temperature = default_val.temperature;
        max_tokens = default_val.max_tokens;
        top_p = default_val.top_p;
        frequency_penalty = default_val.frequency_penalty;
        presence_penalty = default_val.presence_penalty;
    },

    // debug mode
    toggleDebug() { debugmode = !debugmode; },
    isDebugmode() { return debugmode; },

    getInfo() {
        return "model : " + model + "\ntemperature : " + temperature + "\nmax_tokens : " + max_tokens + "\ntop_p : " + top_p + "\nfrequency penalty : " + frequency_penalty + "\npresence penalty : " + presence_penalty + "\nmax remember : " + max_remeber_context / 2;
    },

    isCreatingMsg(guildId, channelId, userId) { return bCreatingMsg[getCombinedKey(guildId, channelId)] || bCreatingMsg[userId]; },
    isDevCreatingMsg() { return bDevCreatingMsg; },

    isActiveChannel(guildId, channelId) {
        for(id of activeChannel) {
            if(getCombinedKey(guildId, channelId) === id) { 
                return true;
            }
        }
        return false;
    },

    isDevChannel(guildId, channelId) {
        return getCombinedKey(guildId, channelId) === devChannel;
    },

    saveDB,
};