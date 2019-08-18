import * as React from "react";

export default (props: any) => {
  return (
    <li
      onClick={(e: any) => {
        e.stopPropagation();
        props.onClick(props.value);
      }}
      className="dropdown-item"
    >
      {props.value}
    </li>
  );
};
