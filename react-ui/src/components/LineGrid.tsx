import * as React from "react";
import { Line } from "../types/lineData";

interface LineGridProps {
  stopMouseLine: (e: React.MouseEvent<SVGElement>) => void;
  disconnect: (fromBlock: number, toBlock: number, outputId: number) => void;
  lines: Array<Line>;
  wantsToConnect: boolean;
  lineFrom?: DOMRect;
  mouseX?: number;
  mouseY?: number;
}

export class LineGrid extends React.PureComponent<LineGridProps> {
  constructor(props: LineGridProps) {
    super(props);
  }
  createLineElements = () => {
    return this.props.lines.map((line, index) => {
      return (
        <g key={index}>
          <line
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#f50057"
            strokeWidth={4}
            strokeDasharray="4, 4"
            className="connection-line"
            onClick={e =>
              this.props.disconnect(line.fromBlock, line.toBlock, line.outputId)
            }
          />
        </g>
      );
    });
  };
  render() {
    const lineElements = this.createLineElements();
    let lineToMouse;
    if (this.props.wantsToConnect && this.props.lineFrom) {
      lineToMouse = (
        <line
          x1={this.props.lineFrom.x}
          y1={this.props.lineFrom.y + 12}
          x2={this.props.mouseX}
          y2={this.props.mouseY}
          strokeDasharray="4, 4"
          stroke="#f50057"
          strokeWidth={4}
        />
      );
    }
    return (
      <svg className="grid-svg" onClick={e => this.props.stopMouseLine(e)}>
        {lineElements}
        {lineToMouse}
      </svg>
    );
  }
}
