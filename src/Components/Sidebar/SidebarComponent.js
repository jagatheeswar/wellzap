import React from "react";
import { useHistory } from "react-router";
import "./Sidebar.css";

function SidebarComponent({ logo, name, path }) {
  const history = useHistory();
  return (
    <div className="drawer__container" onClick={() => history.push(`/${path}`)}>
      <img src={`/assets/${logo}.png`} width="25px" height="25px" alt="" />
      <h1>{name}</h1>
    </div>
  );
}

export default SidebarComponent;
