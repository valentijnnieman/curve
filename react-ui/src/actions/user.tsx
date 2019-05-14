import { fetchSynths } from "./state";

export interface UserLoginAction {
  type: "USER_LOGIN";
  name: string;
  id: number;
}
export function userLogin(name: string, id: number): UserLoginAction {
  return {
    type: "USER_LOGIN",
    name,
    id
  };
}
export interface UserLogoutAction {
  type: "USER_LOGOUT";
}
export function userLogout(): UserLogoutAction {
  return {
    type: "USER_LOGOUT"
  };
}

interface FetchErrorsAction {
  type: "FETCH_ERRORS";
  message: string;
}

function fetchErrors(message: string): FetchErrorsAction {
  return {
    type: "FETCH_ERRORS",
    message
  };
}

export function login(name: string, password: string) {
  return function(dispatch: any) {
    const data = {
      name,
      password
    };
    return fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin",
      body: JSON.stringify(data)
    })
      .then(response => {
        if (
          response.status === 200 ||
          response.status === 201 ||
          response.status === 304
        ) {
          return response.json();
        } else {
          throw Error("Could not log in with those credentials.");
        }
      })
      .then(json => {
        if (json.errors) {
          throw Error("Unable to log in!");
        } else {
          dispatch(fetchSynths(json.id));
          dispatch(userLogin(json.name, json.id));
        }
      })
      .catch((error: Error) => dispatch(fetchErrors(error.message)));
  };
}

export function register(name: string, email: string, password: string) {
  return function(dispatch: any) {
    const data = {
      name,
      email,
      password
    };
    return fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin",
      body: JSON.stringify(data)
    })
      .then(response => {
        if (
          response.status === 200 ||
          response.status === 201 ||
          response.status === 304
        ) {
          return response.json();
        } else {
          throw Error("A user with those credentials already exists.");
        }
      })
      .then(json => {
        if (json.errors) {
          throw Error("Unable to log in!");
        } else {
          dispatch(userLogin(json.name, json.id));
        }
      })
      .catch((error: Error) => dispatch(fetchErrors(error.message)));
  };
}

export function logout() {
  return function(dispatch: any) {
    return fetch("/api/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin"
    })
      .then(response => {
        if (response.status === 200 || response.status === 201) {
          dispatch(userLogout());
        } else {
          throw Error("Unrecognized name and password combination");
        }
      })
      .catch((error: Error) => dispatch(fetchErrors(error.message)));
  };
}

export function fetchUser() {
  return function(dispatch: any) {
    return fetch("/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin"
    })
      .then(response => {
        return response.json();
      })
      .catch(error => window.console.error(error))
      .then(json => {
        dispatch(fetchSynths(json.id));
        dispatch(userLogin(json.name, json.id));
      });
  };
}
