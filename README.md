# Curve

A visual programming language for Web Audio!

[Play around with it here!](https://curve-visual.herokuapp.com/)

<img src="https://raw.githubusercontent.com/valentijnnieman/curve/master/src/curve.svg?sanitize=true" width="48" />

# What is this?

This is a visual programming language (sort of!) for Web Audio! You can use it to play around with digital audio, connecting stuff together to create cool sounds, all in the browser!

## How should I use this?

You can create oscillator or gain blocks by clicking the '+' button in the bottom right corner of the screen. Connect them to the speakers and turn it on to hear the oscillator oscillating wildly! Try connecting oscillators and gain blocks together! You can connect to an oscillator's internal gain, or frequency.

# WIP

This is still very much work in progress! :) I use Typescript with create-react-app to build the editor, and Redux to keep state. Pull the project, run `npm start` or `yarn start` and go to `/editor` to mess about with it.

## Roadmap

Here is some stuff I would love to implement next:
[] Better performance! The drawing of the connection lines is quite slow.
[] Filter blocks
[] Saving a 'project'
[] A tutorial
