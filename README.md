# flavor.finance

A spicy new twist on DeFi savings.


## Local Development

### Server

Run `yarn` to install dependencies, and `yarn start:dev` to start the development server. The server should be available at `localhost:8080`.

Make sure to run `gcloud auth application-default login` and `gcloud config set project flavor-finance` to use the datastore.


### Client

From the `client` directory, run `yarn` to install dependencies, and `yarn start` to start the development server. The server should be available at `localhost:3000`.

Run `yarn build` to build changes.


## Deployment

Install the `gcloud` CLI tool:

- [gcloud CLI tool](https://cloud.google.com/sdk/gcloud/)

Run `deploy.sh`. This script builds the client and server, and then deploys the application to GCP.

Make sure you have run `gcloud auth login` and logged into an account that has permissions on Google Cloud to deploy the service.

To see logs as request are sent, you can tail the logs with gcloud: `gcloud app logs tail -s flavor-finance`
