# Vizzini

Vizzini is a Skype bot.

It's built using [Claudia Bot Builder](https://github.com/claudiajs/claudia-bot-builder) which allows you to quickly deploy a bot to many different services (e.g. Skype, Slack, Facebook Messenger) on AWS API Gateway and Lambda. This app only has Skype enabled.

## Installation

### Pre-requisites

- [Node.js](https://nodejs.org/en/)
- [An Azure account](https://portal.azure.com)
- [A Web App Bot created in Azure](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-quickstart-registration?view=azure-bot-service-3.0&viewFallbackFrom=azure-bot-service-4.0)
- [An AWS account](https://aws.amazon.com/)

### Steps

1. Install node dependencies.

   ```bash
   npm install
   ```

1. Create the bot API in your AWS account (defaults to `us-east-1`). This command will create the API Gateway and Lambda in your default AWS account (set `AWS_PROFILE` to specify a different account). This command will prompt you for your Microsoft App ID and secret, which can be found in the Web App Bot settings in Azure.

   ```bash
   npm run create
   ```

1. Grab the Skype URL at the bottom of the `create` command's output, and set that as the `messaging endpoint` in your Web App Bot settings in Azure.

## Development

#### Push an update

```bash
npm run update
```

## Infrastructure

This app uses Claudia to easily deploy Node.js to AWS Lambda and API Gateway.

On `claudia create`, an API Gateway is created with a single lambda attached for `GET /` (health endpoint) and `POST /skype` (skype messaging endpoint). I believe the resources are named after either the folder name or the name in `package.json`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
