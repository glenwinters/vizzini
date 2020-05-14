const botBuilder = require('claudia-bot-builder');

const botOptions = {
  platforms: ['skype'],
};

const requestHandler = (message) => {
  const { name } = message.originalRequest.from;
  return `Hello, ${name}!`;
};

module.exports = botBuilder(requestHandler, botOptions);
