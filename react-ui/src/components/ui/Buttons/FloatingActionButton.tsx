import * as React from "react";
import "./Button.css";

interface FloatingActionButtonProps {
  label?: string;
  primary?: boolean;
  secondary?: boolean;
  onClick?: (event: React.MouseEvent<any>) => void;
  style?: object;
  children?: any;
  type?: string;
  mini?: boolean;
  className?: string;
}

export default (props: FloatingActionButtonProps) => {
  const buttonClass = `button floating-action-button ${props.className}`;
  return (
    <div className={buttonClass} onClick={props.onClick}>
      {props.label}
      {props.children}
    </div>
  );
};
