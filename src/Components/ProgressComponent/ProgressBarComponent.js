import React from "react";
import "./ProgressBarComponent.css";

const ProgressBarComponent = ({ containerWidth, progress, progressColor }) => {
  return (
    <div
      style={{
        width: containerWidth,
        height: 10,
        borderRadius: "5px",
        backgroundColor: "#ddd",
      }}
    >
      <div
        style={{
          backgroundColor: progressColor,
          positon: "absolute",
          maxWidth: `${progress}%`,
          height: 8,
          borderRadius: 15,
        }}
      ></div>
    </div>
  );
};

export default ProgressBarComponent;
