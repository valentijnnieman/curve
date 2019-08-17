import * as React from "react";
import "./Button.css";

export default (props: any) => {
  const buttonClass = `button floating-action-button ${props.className}`;
  return (
    <div className={buttonClass} onClick={props.onClick}>
      {props.children}
    </div>
  );
};
