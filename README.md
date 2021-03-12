# Benchdb
Escalable Benchmark tool for database engines
## Setup

For a clean setup, follow these steps:

Clone the repo:

```bash
git clone --depth 1 https://github.com/terru/benchdb.git
cd benchdb
```

Install the dependencies:

```bash
npm i
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```
Run docker using the [npm commands](#commands)

## Table of Contents
- [Features](#features)
- [Docker configuration](#docker)
- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Validation](#validation)
- [Logging](#logging)
- [Linting](#linting)
- [Inspirations](#inspirations)
- [License](#license)

## Features

- **ES9**: latest ECMAScript features
- **Validation**: env validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan)
- **Testing**: unit and integration tests using [Jest](https://jestjs.io)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
- **Docker support** : see [docker](#docker) section
- **Git hooks**: with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)

## Docker

The required services and the running env for the tool are virtualized and configured automatically using [docker](https://docs.docker.com/) and [docker-compose](https://docs.docker.com/compose/).
The ```Dockerfile``` in this repo contains a full and light docker image, built to run the nodejs app in a isolated state, only with the required dependencies.

The main hardware arquitecture of the proyect was made using the ```docker-compose.yml``` file, throw the usage of this file, the following services can be automatic launched:
- Mosquitto: an instance of a local mosquitto broker to simulate the communication between the procedures (emulating sensors) and interact over the well known MQTT protocol. (Mosquitto can be easily configured using the mosquitto/mosquitto.conf in this repo, since its mapped to the one in the volume).
- Mongodb (default): by default the tool builds a mongo db structure and connects the subscriber with it, allowing to measure the saving time of simulated sensors measures.
- Benchdb: the isolated nodejs environment where the measures and the communications are taking place.

Also, several structural tools are defined and launched in the same file:
- The node-network, a network bridge shared between all the services, so they can see each other in the net.
- The dbdata volumes to store and keep the saved data between enabling/disabling the services.

**Docker-compose.env files**
Specific ```docker-compose``` are used to define the commands that need to be executed in each environment, they also define the name of the container that will be used in those envs. See ```docker-compose.dev.yml``` as an example.

## Commands

The tool is totally virtualized using docker-compose, see [docker](#docker) section.

Running locally:

```bash
npm run docker:dev
```

Running in production:

```bash
npm run docker:prod
```

Testing:

```bash
# run all tests
npm run test

# run all tests in watch mode
npm run test:watch

# run test coverage
npm run coverage
```

Linting:

```bash
# run ESLint
npm run lint

# fix ESLint errors
npm run lint:fix

# run prettier
npm run prettier

# fix prettier errors
npm run prettier:fix
```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
# Port number
PORT=3000

# URL of the Mongo DB
MONGODB_URL=mongodb://127.0.0.1:27017/node-boilerplate

# mosquitto Host
MOSQUITTO_HOST=tcp://mosquitto:1883
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--subscriber\     # Suscriber tool for MQTT connection
 |--senders\        # Message Sender procedures
 |--engines\        # Custom database engines tools and classes
 |--models\         # Data models (data layer)
 |--utils\          # Utility classes and functions
 |--index.js        # Tool entry point
```
## Validation

Env data is validated using [Joi](https://joi.dev/). Check the [documentation](https://joi.dev/api/) for more details on how to write Joi validation schemas.

## Logging

Import the logger from `src/config/logger.js`. It is using the [Winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```javascript
const logger = require('<path to src>/config/logger');

logger.error('message'); // level 0
logger.warn('message'); // level 1
logger.info('message'); // level 2
logger.http('message'); // level 3
logger.verbose('message'); // level 4
logger.debug('message'); // level 5
```

In development mode, log messages of all severity levels will be printed to the console.

In production mode, only `info`, `warn`, and `error` logs will be printed to the console.\
It is up to the server (or process manager) to actually read them from the console and store them in log files.\
This tool uses pm2 in production mode, which is already configured to store the logs in log files.
## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).

In this tool, ESLint is configured to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) with some modifications. It also extends [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) to turn off all rules that are unnecessary or might conflict with Prettier.

To modify the ESLint configuration, update the `.eslintrc.json` file. To modify the Prettier configuration, update the `.prettierrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore` and `.prettierignore`.

To maintain a consistent coding style across different IDEs, the project contains `.editorconfig`

## Inspirations

- [hagopj13/node-express-boilerplate](https://github.com/hagopj13/node-express-boilerplate)
- [FIWARE/tutorials.IoT-over-MQTT](https://github.com/FIWARE/tutorials.IoT-over-MQTT)
- [danielfsousa/express-rest-es2017-boilerplate](https://github.com/danielfsousa/express-rest-es2017-boilerplate)
- [asoorm/docker-compose-mongo-replicaset.yml](https://gist.github.com/asoorm)

## License

[MIT](LICENSE)
