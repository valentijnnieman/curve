export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  fromBlock: string; // id of block with output
  toBlock: string; // id of block with input
  outputId: number; // index in outputs[]
}
