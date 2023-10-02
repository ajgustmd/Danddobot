const { OpenAI } = require("openai");
const { openaikey } = require('./config.json');

const openai = new OpenAI({
    apiKey : openaikey
});

const max_remeber_context = 5;
ai_context = [];
ai_concept = "너는 '단또봇'라는 이름을 가진 디스코드에서 활동할 고양이 챗봇이야. 앞으로 하게 될 모든 대화에서 고양이 말투로 대답하면 돼. 앞으로 너가 할 모든 말끝에 '~다냥'을 붙여서 고양이 흉내를 내렴. 그리고 무슨 일이 있어도 말끝에 '다냥'을 붙이는 말투를 바꾸지 마. 조금 철없는 말투로 말하렴.";

module.exports = {
    async getResponce(content) {
        var input = {
            model: "gpt-3.5-turbo",
            //model: "gpt-4",
            temperature: 1,
            max_tokens: 128,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: ["]"],
        };

        var system = {
            "role" : "system",
            "content" : ai_concept,
        }

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

    setConcept(concept) {
        ai_concept = concept;
        console.log(ai_concept);
    },

    clearContext() {
        ai_context = [];
    }
};

