const TextToSpeechV1 = require("ibm-watson/text-to-speech/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

function getClient() {
  const tts = new TextToSpeechV1({
    authenticator: new IamAuthenticator({ apikey: process.env.TTS_API_KEY }),
    serviceUrl: process.env.TTS_SERVICE_URL,
    disableSslVerification: true,
  });
  return tts;
}

async function getSpeech(text, voice) {
  const tts = getClient();
  const { result } = await tts.synthesize({
    text,
    voice,
    accept: "audio/mp3",
  });
  return result;
}

module.exports = {
  getClient,
  getSpeech,
};
