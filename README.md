# <img src="https://raw.githubusercontent.com/valentijnnieman/curve/master/react-ui/src/curve.svg?sanitize=true" width="48" /> Curve

[![Build](https://travis-ci.org/valentijnnieman/curve.svg?branch=master)](https://travis-ci.org/valentijnnieman/curve)

A visual synth-design tool for Web Audio

[Play around with it here!](https://curve-visual.herokuapp.com/)

<img src="https://github.com/valentijnnieman/curve/blob/master/react-ui/public/all_screen.png?raw=true" />

# What is this?

This is a visual synth-design tool for Web Audio! You can use it to design synthesizers using basic oscillators and filters. Ever wanted to try out some cool synth design patterns you found on the internet? Learning about subtractive or FM synthesis, and want to try things out for yourself? Then this is the tool for you!

## How should I use this?

You can create audio blocks such as oscillators, gain, filters, or envelopes, by clicking the '+' button in the bottom right corner of the screen. Connect them to the speakers and turn it on to hear the oscillator oscillating wildly! Try connecting different blocks together.

## Generate code

You can click the "Generate code" button to see the Web Audio code output. You can build a crazy synth and save the outputted code for later! This is still experimental and might not always work as intended.

## Running Curve on local

Install the server:

- Run `npm install` in the root folder

Setting up the database:

- Create a development database using `createdb curve-dev`. The `createdb` command comes from the `pg` package installed by npm.
- Enter your development database credentials in `server/config/config.json`, under `development`
- Create a `.env.local` file that'll hold some ENV keys we'll need. In the file, set `curve_session_key=my_custom_key`.
- Run migrations using `sequelize db:migrate`

Run the server:

- Run `npm run dev` in the root folder
  The server is an express app that handles saving and sharing synths! It hosts the main React app in `react-ui` on the '/' route.

Run the app:

- `cd react-ui`
- `npm install`
- `npm start`

The `react-ui` app is the frontend. On the server, `npm run build` is run, and the express app (server) handles everything. On local however, it's nice to make use of the webpack dev tools, so we run it independently!

## Running Curve with Docker

- create an `.env.production` file that holds the following keys:

```
curve_session_key=?
POSTGRES_DB=curve
POSTGRES_USER=username
POSTGRES_PASSWORD=password
DATABASE_URL=postgres://username:password@db/curve
```

- run the containers useing the `docker-compose.yml` file by running `docker-compose up`. Now, you can run the database migrations by logging in to the container as follows: `docker exec -t -i <CONTAINER_ID> bash` where CONTAINER_ID is the id of the container running `curve_web` (run `docker ps` to see all the containers running). Then, run `node_modules/.bin/sequelize db:migrate --env production` to run the latest db migration.

## Running the tests locally with Docker and Travis

You can run the tests in Travis locally using Docker by first pulling the latest Travis Node image, using

`docker pull travisci/ci-nodejs:packer-1494866191`

and fire up the image with:

`docker run -it travisci/ci-nodejs:packer-1494866191 /bin/bash`

then you can run `su - travis` to switch to the `travis` user, clone the repo in the `/` folder, run `npm install`, and finally manually run the Travis CI build command.

## Roadmap

Here is some stuff I would love to implement next:

- [x] Better performance! The drawing of the connection lines is quite slow.
- [x] Filter blocks
- [x] Envelope blocks
- [x] Saving a 'project'
- [ ] Documentation
- [ ] Cookbook recipes showing off cool synth ideas
