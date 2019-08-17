import * as React from "react";
import "./Button.css";
import "./SidebarButton.css";

interface SidebarButtonProps {
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

export default (props: SidebarButtonProps) => {
  const buttonClass = `button sidebar-button ${props.className}`;
  return (
    <div className={buttonClass} onClick={props.onClick}>
      |{props.children}
    </div>
  );
};
