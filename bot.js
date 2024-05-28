const api = require('node-telegram-bot-api');
const bot = new api('TELEGRAM BOT_TOKEN', { polling: true } );
const AI = require("@google/generative-ai");

const AICommandPrefix = '.'

const gemini = new AI.GoogleGenerativeAI('GEMINI API_KEY').getGenerativeModel({
    model: 'gemini-pro', 
    generationConfig: { 
        temperature: 0.9, 
        topP: 1, 
        topK: 1,
        maxOutputTokens: 1024
    }
})

async function question(msg, ai) {
    try {
        bot.sendMessage(msg.chat.id, (await ai.generateContent(msg.text.substring(AICommandPrefix.length))).response.text(), {
            reply_to_message_id: msg.message_id
        })
    } catch {
        if (e == 'Error: [GoogleGenerativeAI Error]: Candidate was blocked due to SAFETY') {
            bot.sendMessage(msg.chat.id, `Неприемлимый контент не доступен для вопросов`, {
                reply_to_message_id: msg.message_id
            });
            return
        };
        if (String(e).startsWith('Error: [GoogleGenerativeAI Error]: Error fetching from')) {
            bot.sendMessage(msg.chat.id, `Ошибка генерации`, {
                reply_to_message_id: msg.message_id
            });
            return
        }
    }
};

bot.on('message', (msg, met) => met.type == 'text' && msg.text.startsWith(AICommandPrefix) ? question(msg, gemini) : void 0 );