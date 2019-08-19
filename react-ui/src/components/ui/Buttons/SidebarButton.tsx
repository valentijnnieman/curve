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
  open?: boolean;
  openClassName?: string;
  closedClassName?: string;
}

export default (props: SidebarButtonProps) => {
  const buttonClass = `button sidebar-button ${props.className} ${
    props.open ? props.openClassName || "" : props.closedClassName || ""
  }`;
  return (
    <div className={buttonClass} onClick={props.onClick}>
      |{props.children}
    </div>
  );
};
