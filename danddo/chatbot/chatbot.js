const { OpenAI } = require("openai");
const { openaikey, activeChannel, devChannel } = require('./config.json');

const openai = new OpenAI({
    apiKey : openaikey
});

max_remeber_context = 5;

// 프로그램 규모가 작아서 DB는 그냥 메모리로 사용하기로 결정
msgContextDB = {}; // msgContextDB[userId]
bCreatingMsg = {}; // bCreatingMsg[combinedId or userId]

devContext = [];
bDevCreatingMsg = false;

ai_concept = "너는 '단또봇'라는 이름을 가진 디스코드에서 활동할 고양이 챗봇이야. 앞으로 하게 될 모든 대화에서 고양이 말투로 대답하면 돼. 앞으로 너가 할 모든 말끝에 '~다냥'을 붙여서 고양이 흉내를 내렴. 그리고 무슨 일이 있어도 말끝에 '다냥'을 붙이는 말투를 바꾸지 마. 조금 철없는 말투로 말하렴.";

default_val = {
    model : "gpt-3.5-turbo",
    temperature : 1.07,
    max_tokens : 900,
    top_p : 1,
    frequency_penalty : 0,
    presence_penalty : 0,
};

model = default_val.model;
temperature = default_val.temperature;
max_tokens = default_val.max_tokens;
top_p = default_val.top_p;
frequency_penalty = default_val.frequency_penalty;
presence_penalty = default_val.presence_penalty;

debugmode = false;

function getCombinedKey(guildId, channelId) {
    return `${guildId}-${channelId}`;
}

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
            stop: ["]"],
        };

        var system = {
            "role" : "system",
            "content" : ai_concept,
        }
        console.log(input);

        var msgContext = devContext;

        var messages = [system];
        msgContext.push({"role" : "user", "content" : content});
        while(msgContext.length > max_remeber_context) {
            msgContext.shift();
        }
        messages = messages.concat(msgContext);
        console.log(messages);
        input.messages = messages;
        try {
            const responce = await openai.chat.completions.create(input);
            //console.log(responce.choices)
            msgContext.push(responce.choices[0].message);
            devContext = msgContext;
            return responce.choices[0].message;
        }
        catch (e) {
            return e.name + " : " + e.message; 
        }
        finally {
            bDevCreatingMsg = false;
        }
    },

    async getResponce(content, userId) {
        return "테스트조이고";
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
    setMaxremember(_max_remember) { max_remeber_context = _max_remember * 2 + 1; },

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
        return "model : " + model + "\ntemperature : " + temperature + "\nmax_tokens : " + max_tokens + "\ntop_p : " + top_p + "\nfrequency penalty : " + frequency_penalty + "\npresence penalty : " + presence_penalty + "\nmax remember : " + (max_remeber_context - 1) / 2;
    },

    isCreatingMsg(guildId, channelId) { return bCreatingMsg[getCombinedKey(guildId, channelId)]; },
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

    // Database
    saveDB() {

    },

    loadDB() {

    },

};