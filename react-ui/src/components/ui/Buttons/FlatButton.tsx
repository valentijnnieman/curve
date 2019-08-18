import * as React from "react";
import "./FlatButton.css";
import "./Button.css";

interface FlatButtonProps {
  label?: string;
  primary?: boolean;
  onClick?: () => void;
  style?: object;
  children?: any;
  disabled?: boolean;
}

export default (props: FlatButtonProps) => {
  return (
    <div className="flat-button" onClick={props.onClick}>
      {props.label}
    </div>
  );
};
