// import { BlockDataOptions } from "../types/blockData";

export interface LoadStateAction {
  type: "LOAD_STATE";
  blockOptions: Array<Object>;
}

export function loadState(blockOptions: Array<Object>): LoadStateAction {
  return {
    type: "LOAD_STATE",
    blockOptions
  };
}

export function fetchState(name: string) {
  return function(dispatch: any) {
    return fetch("/synth/" + name)
      .then(
        response => response.json(),
        error => window.console.log("Error: ", error)
      )
      .then(json => {
        window.console.log(json[0].data);
        window.console.log(typeof json[0].data);
        dispatch(loadState(json[0].data));
      });
  };
}
