import * as React from "react";

interface AnalyserProps {
  analyser: AnalyserNode;
  backgroundColor: string;
  lineColor: string;
}

export class Analyser extends React.Component<AnalyserProps> {
  analyserCanvas: HTMLCanvasElement;

  drawScope = () => {
    let ctx = this.analyserCanvas.getContext("2d") as CanvasRenderingContext2D;
    let width = ctx.canvas.width;
    let height = ctx.canvas.height;
    let timeData = new Uint8Array(this.props.analyser.frequencyBinCount);
    let scaling = height / 256;
    let risingEdge = 0;

    this.props.analyser.getByteTimeDomainData(timeData);

    ctx.fillStyle = this.props.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = this.props.lineColor;
    ctx.beginPath();

    for (
      let x = risingEdge;
      x < timeData.length && x - risingEdge < width;
      x++
    ) {
      ctx.lineTo(x - risingEdge, height - timeData[x] * scaling);
    }

    ctx.stroke();
  };

  draw = () => {
    this.drawScope();
    requestAnimationFrame(this.draw);
  };

  componentDidMount() {
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
