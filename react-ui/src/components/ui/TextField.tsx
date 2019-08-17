import * as React from "react";
import "./TextField.css";

interface TextFieldProps {
  id?: string;
  floatingLabelText: string;
  name?: string;
  value?: number | string;
  defaultValue?: number;
  onChange: (e: any) => void;
  type: string;
  step?: number;
  className?: string;
  errorText?: string;
  errorStyle?: object;
}

export default (props: TextFieldProps) => {
  const textClass = `textfield ${props.className}`;
  return (
    <div className="textfield-container">
      <label>{props.floatingLabelText}</label>
      <input
        name={props.name}
        onChange={props.onChange}
        value={props.value}
        type={props.type}
        step={props.step}
        className={textClass}
      />
      <span>{props.errorText}</span>
    </div>
  );
};
