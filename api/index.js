const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN);

bot.on("inline_query", async (ctx) => {
  try {
    const results = [
      {
        type: "article",
        id: 1,
        title: "hyper! hyper!",
        description: "hyper uppercut 🦾",
        input_message_content: {
          message_text: "some text here",
          parse_mode: "HTML",
        },
      },
    ];
    return await ctx.answerInlineQuery(results, { cache_time: 1 });
  } catch (e) {
    throw e;
  }
});

module.exports = async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
  } finally {
    res.status(200).end();
  }
};
