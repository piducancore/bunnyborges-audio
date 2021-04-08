const Twitter = require("twitter-lite");

async function getClient() {
  return new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: "",
    access_token_secret: "",
  });
}

async function getLastest(user) {
  const twitter = await getClient();
  const { statuses } = await twitter.get("search/tweets", {
    q: `from:${user} -is:retweet`,
    count: 100,
    include_entities: false,
    result_type: "recent",
  });
  return statuses.map((status) => status.text.replace(/^@[A-Za-z0-9]+\ /, ""));
}

module.exports = {
  getClient,
  getLastest,
};
