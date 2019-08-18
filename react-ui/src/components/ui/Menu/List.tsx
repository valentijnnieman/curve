import * as React from "react";
import "./List.css";

export default (props: any) => {
  return <ul className="list">{props.children}</ul>;
};
