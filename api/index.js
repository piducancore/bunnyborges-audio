const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN);
bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.on("inline_query", async (ctx) => {
  const apiUrl = `http://recipepuppy.com/api/?q=${ctx.inlineQuery.query}`;
  const response = await fetch(apiUrl);
  const { results } = await response.json();
  const recipes = results
    .filter(({ thumbnail }) => thumbnail)
    .map(({ title, href, thumbnail }) => ({
      type: "article",
      id: thumbnail,
      title: title,
      description: title,
      thumb_url: thumbnail,
      input_message_content: {
        message_text: title,
      },
      reply_markup: Markup.inlineKeyboard([Markup.button.url("Go to recipe", href)]),
    }));
  return await ctx.answerInlineQuery(recipes);
});

bot.on("chosen_inline_result", ({ chosenInlineResult }) => {
  console.log("chosen inline result", chosenInlineResult);
});

// bot.launch();

module.exports = async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
  } finally {
    res.status(200).end();
  }
};
