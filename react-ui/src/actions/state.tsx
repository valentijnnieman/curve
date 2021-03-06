import { BlockDataOptions } from "../types/blockData";

// import { BlockDataOptions } from "../types/blockData";

export interface LoadStateAction {
  type: "LOAD_STATE";
  id: number;
  blockOptions: Array<Object>;
  name: string;
  slug: string;
}

export interface LoadSynthsAction {
  type: "LOAD_SYNTHS";
  synths: Array<any>;
}

export interface RetrieveBlocksAction {
  type: "RETRIEVE_BLOCKS";
}

interface FetchErrorsAction {
  type: "FETCH_ERRORS";
  message: string;
}

interface FetchSuccessAction {
  type: "FETCH_SUCCESS";
  message: string;
  name: string;
  slug: string;
}

export function loadState(
  id: number,
  blockOptions: Array<Object>,
  name: string,
  slug: string
): LoadStateAction {
  return {
    type: "LOAD_STATE",
    id,
    blockOptions,
    name,
    slug
  };
}

export function loadSynths(synths: Array<string>): LoadSynthsAction {
  return {
    type: "LOAD_SYNTHS",
    synths
  };
}

export function retrieveBlocks(): RetrieveBlocksAction {
  return {
    type: "RETRIEVE_BLOCKS"
  };
}

function fetchErrors(message: string): FetchErrorsAction {
  return {
    type: "FETCH_ERRORS",
    message
  };
}

function fetchSuccess(
  message: string,
  name: string,
  slug: string
): FetchSuccessAction {
  return {
    type: "FETCH_SUCCESS",
    message,
    name,
    slug
  };
}

export function saveState(
  blocks: Array<BlockDataOptions>,
  name: string,
  id: number
) {
  return function(dispatch: any) {
    const data = {
      name,
      data: blocks,
      userId: id
    };
    return fetch("/api/synth/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(
        response => response.json(),
        error => window.console.log("error: ", error)
      )
      .then(json => {
        // we got it
        if (json.errors) {
          dispatch(
            fetchErrors(
              "That name is already taken! Please try a different name."
            )
          );
        } else {
          dispatch(fetchSuccess("Synth saved!", json.name, json.slug));
        }
      });
  };
}

export function updateState(
  blocks: Array<BlockDataOptions>,
  name: string,
  synthId: number,
  userId: number
) {
  return function(dispatch: any) {
    const data = {
      name,
      data: blocks,
      id: synthId,
      userId: userId
    };
    return fetch("/api/synth/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(
        response => response.json(),
        error => window.console.log("error: ", error)
      )
      .then(json => {
        // we got it
        if (json.errors) {
          dispatch(
            fetchErrors("Couldn't update this synth - something went wrong!")
          );
        } else {
          dispatch(fetchSuccess("Synth saved!", json.name, json.slug));
        }
      });
  };
}

export function fetchState(name: string) {
  return function(dispatch: any) {
    return fetch("/api/synth/" + name)
      .then(
        response => response.json(),
        error => window.console.log("Error: ", error)
      )
      .then(json => {
        dispatch(
          loadState(json[0].id, json[0].data, json[0].name, json[0].slug)
        );
      })
      .catch(e => {
        window.console.log(e);
      });
  };
}

export function fetchSynths(id: number) {
  return function(dispatch: any) {
    return fetch("/api/synths/" + id)
      .then(
        response => {
          return response.json();
        },
        error => window.console.log("Error: ", error)
      )
      .then(json => {
        dispatch(loadSynths(json));
      })
      .catch(e => {
        window.console.log(e);
      });
  };
}
