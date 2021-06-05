import React from "react";
import { Dropdown } from "semantic-ui-react";

const friendOptions = [
  {
    key: "1",
    text: "Water",
    value: "Water",
  },
  {
    key: "2",
    text: "carbs",
    value: "carbs",
  },
  {
    key: "3",
    text: "cal",
    value: "cal",
  },
  {
    key: "4",
    text: "water",
    value: "water",
  },
];

const Dropdown_ = () => (
  <span>
    <Dropdown
      inline
      options={friendOptions}
      defaultValue={friendOptions[0].value}
    />
  </span>
);

export default Dropdown_;
const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href =
  "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);
