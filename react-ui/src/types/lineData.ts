export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  fromBlock: number; // id of block with output
  toBlock: number; // id of block with input
  outputId: number; // index in outputs[]
}
