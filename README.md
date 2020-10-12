# Vizzini

Vizzini is a Skype bot with a variety of fun commands.

It's built using [Claudia Bot Builder](https://github.com/claudiajs/claudia-bot-builder) which allows you to quickly deploy a bot to many different services (e.g. Skype, Slack, Facebook Messenger) on AWS API Gateway and Lambda. This app only has Skype enabled.

Commands:
* `/help` shows the list of available commands.
* `/recipe` displays a random recipe pulled from spoonacular.com.
* `/science <text>` converts "some text" to "S.O.M.E. T.E.X.T.". Don't ask...

Due to Skype having its own slash commands, you need to put a space before the
slash if talking to the bot directly.

## History

I wrote my first Skype bot in July 2017 and named it `gvobot`. It was written in Python using [`microsoftbotframework`](https://github.com/mbrown1508/microsoftbotframework) and hosted on Heroku. It had commands like `!number` (random number), `!song` (random song from a list of youtube links in a DB), `!recipe` (random recipe from food2fork.com).

In August 2019, I got an email saying they were deprecating Skype bots and I needed to move the bot registration to Azure. In that process, I decided to rewrite it in Node.js using [`botbuilder`](https://github.com/Microsoft/botbuilder-js) and move hosting and deployment over to Azure as well (this was a pain!). I only implemented a few commands, but I did give it a fun name: vizzini (anyone want a peanut?).

In May 2020, I was studying for the AWS Developer Associate exam and wanted to work on a serverless project, so I decided to rewrite vizzini using [`Claudia.js`](https://github.com/claudiajs), which is a framework for deploying Node.js projects to AWS API Gateway and Lambda. It was very easy to setup and a great way get my hands dirty with those AWS services. food2fork.com had shutdown, so when I rewriting the recipe functionality, I switched to spoonacular.com.

## Installation

### Pre-requisites

- [Node.js](https://nodejs.org/en/)
- [An Azure account](https://portal.azure.com)
- [A Web App Bot created in Azure](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-quickstart-registration?view=azure-bot-service-3.0&viewFallbackFrom=azure-bot-service-4.0)
- [An AWS account](https://aws.amazon.com/)

### Steps

1. Install Node.js dependencies.

   ```bash
   npm install
   ```

1. Create the bot API in your AWS account (defaults to `us-east-1`). You will be prompted for your Microsoft app ID and secret, which can be found in the Web App Bot settings in Azure. This uses the `claudia` cli to create the API Gateway and Lambda in your default AWS account. You can set the `AWS_PROFILE` environment variable to specify a different AWS account.

   ```bash
   npm run create
   ```

1. Grab the Skype URL at the bottom of the `create` command's output, and use it to set the `messaging endpoint` in your Web App Bot settings in Azure.

You should now be able to message the bot on Skype and get a response.

## Deployment

This uses the `claudia` cli to deploy a new version of the Lambda function and, if needed, update the API Gateway.

```bash
npm run update
```

## Infrastructure

This app uses Claudia to easily deploy Node.js to AWS Lambda and API Gateway.

It uses a "REST API" type API Gateway with a single lambda attached as `LAMBDA_PROXY` for two endpoints: `GET /` (health check) and `POST /skype` (skype messaging). I believe the resources are named after either the folder name or the name in `package.json`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
