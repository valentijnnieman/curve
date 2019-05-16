import { BlockData } from "../types/blockData";

export interface UpdateBlockAction {
  type: "UPDATE_BLOCK";
  block: BlockData;
}

export interface CreateBlockAction {
  type: "CREATE_BLOCK";
  block: BlockData;
}

export interface DeleteBlockAction {
  type: "DELETE_BLOCK";
  id: string;
}
export interface StartDraggingAction {
  type: "START_DRAGGING";
}
export interface StopDraggingAction {
  type: "STOP_DRAGGING";
}

export function updateBlock(block: BlockData): UpdateBlockAction {
  return {
    type: "UPDATE_BLOCK",
    block
  };
}

export function createBlock(block: BlockData): CreateBlockAction {
  return {
    type: "CREATE_BLOCK",
    block
  };
}

export function deleteBlock(id: string): DeleteBlockAction {
  return {
    type: "DELETE_BLOCK",
    id
  };
}

export function startDragging(): StartDraggingAction {
  return {
    type: "START_DRAGGING"
  };
}

export function stopDragging(): StopDraggingAction {
  return {
    type: "STOP_DRAGGING"
  };
}
