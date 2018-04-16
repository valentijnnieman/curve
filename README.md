# Curve

[![Build](https://travis-ci.org/valentijnnieman/curve.svg?branch=master)](https://travis-ci.org/valentijnnieman/curve)

<img src="https://raw.githubusercontent.com/valentijnnieman/curve/master/src/curve.svg?sanitize=true" width="48" />

A visual synth-design tool for Web Audio

[Play around with it here!](https://curve-visual.herokuapp.com/)

# What is this?

This is a visual synth-design tool for Web Audio! You can use it to design synthesizers using basic oscillators and filters. Ever wanted to try out some cool synth design patterns you found on the internet? Learning about subtractive or FM synthesis, and want to try things out for yourself? Then this is the tool for you!

## How should I use this?

You can create oscillator or gain blocks by clicking the '+' button in the bottom right corner of the screen. Connect them to the speakers and turn it on to hear the oscillator oscillating wildly! Try connecting oscillators and gain blocks together! You can connect to an oscillator's internal gain, or frequency.

## Generate code

You can click the "Generate code" button to see the Web Audio code output. You can build a crazy synth and save the outputted code for later! This is still experimental and might not always work as intended.

# WIP

This is still very much work in progress! :) I use Typescript with create-react-app to build the editor, and Redux to keep state. Pull the project, and run `npm start` or `yarn start`.

## Roadmap

Here is some stuff I would love to implement next:

* [x] A tutorial/walkthrough explaining what does what
* [x] Better performance! The drawing of the connection lines is quite slow.
* [ ] Filter blocks
* [ ] Saving a 'project'
* [ ] Cookbook recipes showing off cool synth ideas
