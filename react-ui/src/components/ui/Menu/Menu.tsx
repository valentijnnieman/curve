import * as React from "react";
import "./Menu.css";

export default (props: any) => {
  return <ul className="menu">{props.children}</ul>;
};
