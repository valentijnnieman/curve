import * as React from "react";
import "../ui/Dialog.css";

export default (props: any) => {
  let containerElement;
  if (props.open) {
    containerElement = (
      <div
        className="dialog-container"
        onClick={(e: any) => {
          if (props.closable) {
            e.stopPropagation();
            props.onRequestClose();
          }
        }}
      />
    );
  }
  return (
    <div>
      {containerElement}
      <div className={`dialog ${props.open ? "" : "dialog--closed"}`}>
        <h2>
          <i>{props.title}</i>
        </h2>
        {props.children}
      </div>
    </div>
  );
};
