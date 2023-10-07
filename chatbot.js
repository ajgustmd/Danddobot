const { OpenAI } = require("openai");
const { openaikey } = require('./config.json');

const openai = new OpenAI({
    apiKey : openaikey
});

max_remeber_context = 5;
ai_context = [];
ai_concept = "너는 '단또봇'라는 이름을 가진 디스코드에서 활동할 고양이 챗봇이야. 앞으로 하게 될 모든 대화에서 고양이 말투로 대답하면 돼. 앞으로 너가 할 모든 말끝에 '~다냥'을 붙여서 고양이 흉내를 내렴. 그리고 무슨 일이 있어도 말끝에 '다냥'을 붙이는 말투를 바꾸지 마. 조금 철없는 말투로 말하렴.";

default_val = {
    model : "gpt-3.5-turbo",
    temperature : 1,
    max_tokens : 512,
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

module.exports = {
    async getResponce(content) {
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

        var messages = [system];
        ai_context.push({"role" : "user", "content" : content});
        if(ai_context.length > max_remeber_context) {
            ai_context.shift();
            ai_context.shift();
        }
        messages = messages.concat(ai_context);
        console.log(messages);
        input.messages = messages;
        const responce = await openai.chat.completions.create(input);
        //console.log(responce.choices)
        ai_context.push(responce.choices[0].message);
        return responce.choices[0].message;
    },

    clearContext() { ai_context = []; },
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
    }
};