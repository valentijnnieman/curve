import * as React from "react";

export default (props: any) => {
  const itemClass = `menu-item ${props.disabled ? "menu-item--disabled" : ""} ${props.className || ""}`;
  return (
    <li
      className={itemClass}
      onClick={() => {
        if (!props.disabled) {
          props.onClick();
        }
      }}
    >
      {props.children}
    </li>
  );
};
