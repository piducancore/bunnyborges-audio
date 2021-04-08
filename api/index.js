const { Telegraf } = require("telegraf");
const { getLastTweet } = require("../utils/twitter");
const { getSpeech } = require("../utils/watson");
const fs = require("fs");

const telegram = new Telegraf(process.env.TELEGRAM_API_TOKEN);

telegram.on("inline_query", async (ctx) => {
  try {
    const { text } = await getLastTweet("bunnyborges");
    const stream = await getSpeech(text, "es-LA_SofiaV3Voice");
    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream("speech.mp3");
      stream.pipe(writeStream);
      stream.on("close", () => resolve());
      stream.on("error", (err) => reject(err));
    });

    return await ctx.answerInlineQuery(
      [
        {
          type: "audio",
          id: 1,
          audio_url: "https://bunnyborges-audio.vercel.app/speech.mp3",
          title: "hyper! hyper!",
        },
      ],
      { cache_time: 1 }
    );
  } catch (e) {
    throw e;
  }
});

module.exports = async (req, res) => {
  try {
    await telegram.handleUpdate(req.body);
  } finally {
    res.status(200).end();
  }
};
