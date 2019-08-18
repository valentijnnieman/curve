import * as React from "react";

interface AnalyserProps {
  analyser: AnalyserNode;
  backgroundColor: string;
  lineColor: string;
}

export class Analyser extends React.Component<AnalyserProps> {
  analyserCanvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  drawScope = () => {
    let width = this.ctx.canvas.width;
    let height = this.ctx.canvas.height;
    let timeData = new Uint8Array(this.props.analyser.frequencyBinCount);
    let scaling = height / 256;
    let risingEdge = 0;

    this.props.analyser.getByteTimeDomainData(timeData);

    // this.ctx.fillStyle = this.props.backgroundColor;
    // this.ctx.fillStyle = "#363636";
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.beginPath();

    for (
      let x = risingEdge;
      x < timeData.length && x - risingEdge < width;
      x++
    ) {
      this.ctx.lineTo(x, height - timeData[x] * scaling);
    }

    this.ctx.stroke();
  };

  draw = () => {
    try {
      this.drawScope();
      requestAnimationFrame(this.draw);
    } catch {
      //
    }
  };

  componentDidMount() {
    this.ctx = this.analyserCanvas.getContext("2d") as CanvasRenderingContext2D;

    // this.ctx.fillStyle = this.props.backgroundColor;
    this.ctx.fillStyle = "#f2f2f2";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.lineWidth = 4;
    // this.ctx.strokeStyle = this.props.lineColor;
    this.ctx.strokeStyle = this.props.backgroundColor;

    this.draw();
  }

  render() {
    return (
      <canvas
        ref={canvasElement => {
          this.analyserCanvas = canvasElement as HTMLCanvasElement;
        }}
        width={144}
        height={70}
      />
    );
  }
}
