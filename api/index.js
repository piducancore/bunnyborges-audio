const { Telegraf } = require("telegraf");
const { createWriteStream } = require("fs");
const { getLastest } = require("../utils/twitter");
const { getSpeech } = require("../utils/watson");

const telegram = new Telegraf(process.env.TELEGRAM_API_TOKEN);

telegram.on("inline_query", async (ctx) => {
  try {
    const tweets = await getLastest("bunnyborges");
    const stream = await getSpeech(
      tweets[Math.floor(Math.random() * tweets.length)],
      "es-LA_SofiaV3Voice"
    );
    await new Promise((resolve, reject) => {
      const writeStream = createWriteStream("speech.mp3");
      stream.pipe(writeStream);
      stream.on("end", () => resolve());
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
