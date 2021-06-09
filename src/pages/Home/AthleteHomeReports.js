import React from "react";
import Compliance_report from "../Reports/Compliance_report";

function AthleteHomeReports() {
  return (
    <div className="home__reports">
      <h1>Reports</h1>
      <div className="home__reportsMainContainer">
        <div className="home__reportsLeftContainer">
          <h1>Compliance</h1>
          <div style={{ width: "100%" }}>
            <Compliance_report height={200} />
          </div>
        </div>
        <div className="home__reportsRightContainer">
          <h1>Payments</h1>
          <div
            style={{ width: "100%", height: "200px", backgroundColor: "grey" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default AthleteHomeReports;
