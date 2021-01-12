const botBuilder = require('claudia-bot-builder');
const axios = require('axios');
const _ = require('lodash');

const { skypeTemplate } = botBuilder;

const botOptions = {
  platforms: ['skype'],
};

// Sample Spoonacular response for /mealplanner/generate
// eslint-disable-next-line no-unused-vars
const recipeResponse = {
  data: {
    meals: [
      {
        id: 1109176,
        imageType: 'jpg',
        title: 'Vegan Birthday Cake Cinnamon Rolls',
        readyInMinutes: 45,
        servings: 12,
        sourceUrl:
          'https://www.godairyfree.org/recipes/vegan-birthday-cake-cinnamon-rolls',
      },
      {
        id: 358788,
        imageType: 'jpeg',
        title: 'Smoked Turkey Baked Chimichangas',
        readyInMinutes: 27,
        servings: 4,
        sourceUrl:
          'http://www.foodnetwork.com/recipes/rachael-ray/smoked-turkey-baked-chimichangas-recipe.html',
      },
      {
        id: 458444,
        imageType: 'jpg',
        title: 'Italian Cassata',
        readyInMinutes: 45,
        servings: 8,
        sourceUrl: 'http://allrecipes.com/Recipe/Italian-Cassata/',
      },
    ],
    nutrients: {
      calories: 1825.55,
      protein: 56.77,
      fat: 68.42,
      carbohydrates: 248.89,
    },
  },
};

const { SPOONACULAR_API_KEY, RAPID_API_KEY } = process.env;

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

const getRecipe = () => {
  return axios
    .get('https://api.spoonacular.com/mealplanner/generate', {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        timeFrame: 'day',
      },
    })
    .then((response) => {
      // The response has 3 meals (breakfast, lunch and dinner) and this randomly
      // picks lunch or dinner.
      const recipe = response.data.meals[1 + _.random(1)];
      const { id: recipeID, imageType, sourceUrl, title } = recipe;
      const recipeImageUrl = `https://spoonacular.com/recipeImages/${recipeID}-312x150.${imageType}`;
      return new skypeTemplate.Carousel('summary')
        .addHero([recipeImageUrl])
        .addTitle(title)
        .addButton('View', sourceUrl, 'openUrl')
        .get();
    })
    .catch((error) => error.message);
};

const getWattsPhoto = (wattage) => {
  const isInputValid = /^\d+W$/.test(wattage);
  if (!isInputValid) {
    return Promise.resolve('Bad input. Example: 850W');
  }

  const requestOptions = {
    method: 'GET',
    url:
      'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI',
    params: {
      q: wattage,
      pageNumber: '1',
      pageSize: '1',
      autoCorrect: 'false',
      safeSearch: 'true',
    },
    headers: {
      'x-rapidapi-key': RAPID_API_KEY,
      'x-rapidapi-host': 'contextualwebsearch-websearch-v1.p.rapidapi.com',
    },
  };

  return axios
    .request(requestOptions)
    .then((response) => {
      const image = response.data.value[0].url;
      return new skypeTemplate.Carousel('summary')
        .addHero([image])
        .addTitle(wattage)
        .get();
    })
    .catch((error) => error.message);
};

const help = () => {
  const commands = ['/science', '/recipe', '/watts'];
  const response = 'Commands:\r\n';
  return response + commands.join('\r\n');
};

const commandNotFound = () => {
  return "Something I don't understand? Inconceivable!";
};

const requestHandler = (message) => {
  // Strip bot name if mentioned in a group chat
  const text = message.text.replace(/^(vizzini)? /, '');

  const textParts = text.split(' ');
  const commandArgs = textParts.slice(1).join(' ');
  switch (textParts[0]) {
    case '/recipe':
      return getRecipe();
    case '/science':
      return toSCIENCE(commandArgs);
    case '/watts':
      return getWattsPhoto(commandArgs);
    case '/help':
      return help();
    default:
      return commandNotFound(message);
  }
};

module.exports = botBuilder(requestHandler, botOptions);
