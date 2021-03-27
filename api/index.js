const { Telegraf } = require("telegraf");
const { request, gql } = require("graphql-request");

const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN);

bot.on("inline_query", async (ctx) => {
  try {
    const { sheetpoem } = await request(
      "https://sheetpoetry.now.sh/graphql",
      gql`
        {
          sheetpoem(
            spreadsheetId: "1qjgDw3TREpqQoSSbB0tzd0Joues1jraJix2mU52zToU"
            range: "A1:E500"
            verses: 4
          )
        }
      `
    );
    const results = [
      {
        type: "article",
        id: 1,
        title: "hyper! hyper!",
        description: "hyper uppercut 🦾",
        input_message_content: {
          message_text: sheetpoem,
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
