const { Telegraf } = require("telegraf");
const { stringify } = require("querystring");
const { getLastest } = require("../utils/twitter");

const telegram = new Telegraf(process.env.TELEGRAM_API_TOKEN);

telegram.on("inline_query", async (ctx) => {
  try {
    const tweets = await getLastest("bunnyborges");
    const randomTweet = tweets[Math.floor(Math.random() * tweets.length)];
    const params = stringify({ text: randomTweet, voice: "es-LA_SofiaV3Voice", buffer: true });
    const audio_url = `https://${process.env.VERCEL_URL}/api/tts?${params}`;
    const answer = await ctx.answerInlineQuery(
      [
        {
          type: "audio",
          id: 1,
          audio_url,
          title: "🎧",
        },
      ],
      { cache_time: 1 }
    );
    return answer;
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
