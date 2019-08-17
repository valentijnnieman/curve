import * as React from "react";

export default (props: any) => {
  return (
    <li className="menu-item" onClick={props.onClick}>
      {props.children}
    </li>
  );
};
