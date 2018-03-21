import * as React from "react";
import "./Card.css";
import Draggable from "react-draggable";

const Card: React.SFC = ({ children }) => (
  <Draggable>
    <div className="card">
      <div className="card-content">{children}</div>
    </div>
  </Draggable>
);

export default Card;
