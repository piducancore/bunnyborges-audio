const Twitter = require("twitter-lite");

async function getClient() {
  const auth = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  });
  const { access_token } = await auth.getBearerToken();
  return new Twitter({
    bearer_token: access_token,
  });
}

async function getLastTweet(user) {
  const twitter = await getClient();
  const [lastTweet] = await twitter.get("statuses/user_timeline", {
    screen_name: user,
    exclude_replies: true,
  });
  return lastTweet;
}

module.exports = {
  getClient,
  getLastTweet,
};
