import * as React from "react";
import "./Drawer.css";

export default (props: any) => {
  let containerElement;
  if (props.open && !props.static) {
    containerElement = (
      <div
        className="drawer-container"
        onClick={() => {
          props.onRequestChange();
        }}
      />
    );
  }
  return (
    <div>
      {containerElement}
      <div
        className={`drawer ${props.open ? "" : "drawer--closed"} ${
          props.right ? "drawer--right" : ""
        }`}
      >
        {props.children}
      </div>
    </div>
  );
};
