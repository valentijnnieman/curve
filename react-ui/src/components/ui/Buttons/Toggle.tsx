import * as React from "react";

export default (props: any) => {
  return (
    <input
      type="checkbox"
      onClick={props.onClick}
      className={props.className}
    />
  );
};
