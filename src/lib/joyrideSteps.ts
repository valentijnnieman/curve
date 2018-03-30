export const joyrideSteps = [
  {
    title: "Welcome to Curve!",
    text:
      "Here you can play around with synthesizer blocks, connecting them together to create interesting noises!",
    selector: ".grid-svg",
    position: "bottom-left",
    type: "hover",
    isFixed: true
  },
  {
    title: "Oscillator blocks",
    text:
      "These blocks are oscillators, they will generate a basic waveform like a square wave!",
    selector: ".card",
    position: "bottom-left",
    type: "hover",
    isFixed: true
  },
  {
    title: "Oscillator blocks",
    text: "You can change the frequency and set the type of waveform here",
    selector: ".node-controls",
    position: "bottom-left",
    type: "hover",
    isFixed: true
  },
  {
    title: "Oscillator blocks",
    text:
      "You can connect their output to other blocks by clicking on their output",
    selector: ".io-element--right",
    position: "bottom-left",
    type: "hover",
    isFixed: true
  },
  {
    title: "Oscillator blocks",
    text:
      "To hear their output, try connecting the output of a block to the input of the speakers, here!",
    selector: ".speakers-content",
    position: "bottom-left",
    type: "hover",
    isFixed: true
  },
  {
    title: "Gain input",
    text:
      "You can also connect outputs to the gain input of other blocks to modulate gain.",
    selector: ".io-element",
    position: "bottom-left",
    type: "hover",
    isFixed: true
  },
  {
    title: "Freq input",
    text: "Or to the frequency input, effectively modulating frequency!",
    selector: ".io-element--freq",
    position: "bottom-left",
    type: "hover",
    isFixed: true
  },
  {
    title: "Gain blocks",
    text: "These are gain blocks - connect to them to multiply their output!",
    selector: "#gain-block",
    position: "bottom-left",
    type: "hover",
    isFixed: true
  },
  {
    title: "Create new blocks",
    text: "With this button you can create new blocks!",
    selector: ".dropdown-button",
    position: "bottom-left",
    type: "hover",
    isFixed: true
  },
  {
    title: "Have fun!",
    text: `Time to experiment! Try connecting an oscillator to a gain block and setting the gain to 100 - 
    then connect the gain block to another oscillator block's frequency input! Freaky!`,
    selector: ".grid-svg",
    position: "bottom-left",
    type: "hover",
    isFixed: true
  }
];
