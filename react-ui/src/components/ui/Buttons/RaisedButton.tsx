import * as React from "react";
import "./RaisedButton.css";
import "./Button.css";

interface RaisedButtonProps {
  label?: string;
  primary?: boolean;
  onClick?: () => void;
  style?: object;
  children?: any;
  type?: string;
  mini?: boolean;
  className?: string;
}

export default (props: RaisedButtonProps) => {
  const buttonClass = `button raised-button ${props.className}`;
  return (
    <div className={buttonClass} onClick={props.onClick}>
      {props.label}
      {props.children}
    </div>
  );
};
