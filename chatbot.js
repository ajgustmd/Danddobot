const { OpenAI } = require("openai");
const { openaikey } = require('./config.json');

const openai = new OpenAI({
    apiKey : openaikey
});

async function getResponse() {

}