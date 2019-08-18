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
  const buttonClass = `button raised-button submit-button ${props.className}`;
  return (
    <input
      type="submit"
      value={props.label}
      className={buttonClass}
      onClick={props.onClick}
    />
  );
};
