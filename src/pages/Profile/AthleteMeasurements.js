import React from "react";
import Header from "../../Components/Header/Header";
import Notification from "../../Components/Notifications/Notification";
import Sidebar from "../../Components/Sidebar/Sidebar";
import "./Profile.css";

function AthleteMeasurements() {
  return (
    <div className="athleteMeasurements">
      <div className="athleteProfile__leftContainer">
        <Header />
        <h2>Anthropometric Measurements</h2>
        <div className="athleteMeasurements__container">
          <form>
            <h4>Height*</h4>
            <input type="text" placeholder="Enter Height" />
            <h4>Weight*</h4>
            <input type="text" placeholder="Enter Weight" />
            <h4>Fat Percentage</h4>
            <input type="text" placeholder="Enter Fat Percentage" />
            <h4>Muscle Percentage</h4>
            <input type="text" placeholder="Enter Muscle Percentage" />
            <h6>*Compulsory Fields</h6>
          </form>
          <div className="athleteMeasurements__Button">Save Form</div>
        </div>
      </div>
    </div>
  );
}

export default AthleteMeasurements;
