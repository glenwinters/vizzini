const botBuilder = require('claudia-bot-builder');

const botOptions = {
  platforms: ['skype'],
};

const toSCIENCE = (message) => {
  return message
    .split('')
    .reduce((memo, c) => {
      const uppered = c.toUpperCase();
      const scienced = /^[a-z]$/i.test(uppered) ? `${uppered}.` : uppered;
      return [...memo, scienced];
    }, [])
    .join('');
};

const help = () => {
  const commands = ['/science'];
  const response = 'Commands:\r\n';
  return response + commands.join('\r\n');
};

const commandNotFound = (message) => {
  return "Something I don't understand? Inconceivable!";
};

const requestHandler = (message) => {
  console.log(message);

  // Strip bot name if mentioned in a group chat
  const text = message.text.replace(/^(vizzini)? /, '');

  const textParts = text.split(' ');
  switch (textParts[0]) {
    case '/science':
      const text = textParts.slice(1).join(' ');
      return toSCIENCE(text);
    case '/help':
      return help();
    default:
      return commandNotFound(message);
  }
};

module.exports = botBuilder(requestHandler, botOptions);
