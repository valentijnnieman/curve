import * as React from "react";
import "./RaisedButton.css";
import "./Button.css";

interface SubmitButtonProps {
  label?: string;
  primary?: boolean;
  onClick?: () => void;
  style?: object;
  children?: any;
  type?: string;
  mini?: boolean;
  className?: string;
}

export default (props: SubmitButtonProps) => {
  const buttonClass = `button raised-button ${props.className}`;
  return (
    <div>
      {props.label}
      <input type="submit" className={buttonClass} onClick={props.onClick} />
      {props.children}
    </div>
  );
};
