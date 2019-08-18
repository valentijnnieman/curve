import * as React from "react";
import "./Toggle.css";

export default (props: any) => {
  return (
    <label className="toggle">
      <input
        type="checkbox"
        onClick={props.onClick}
        className={props.className}
      />
      <span className="toggle-slider" />
    </label>
  );
};
