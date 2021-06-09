import React from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const Dropdown_ = (props) => {
  var options = props.options;
  console.log(options);
  const defaultOption = options[0].text;

  return (
    <span>
      <Dropdown
        className="dropdown_charts"
        options={options}
        value={defaultOption}
        onChange={(val) => {
          props.change_graph(val.value);
        }}
        placeholder="Select an option"
      />
    </span>
  );
};

export default Dropdown_;
