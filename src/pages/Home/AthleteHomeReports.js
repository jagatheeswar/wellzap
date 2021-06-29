import React from "react";
import NutritionGoalProgress from "../../Components/NutritionGoalProgress/NutritionGoalProgress";
import Compliance_report from "../Reports/Compliance_report";
import Reports from "../Reports/Reports";

function AthleteHomeReports() {
  return (
    <div className="home__reports">
      <h1 style={{fontFamily: 'Open_Sans'}}>Reports</h1>
      <div className="home__reportsMainContainer">
      <Reports />
      {/*  <div className="home__reportsLeftContainer">
          <h1>Compliance</h1>
          <div style={{ width: "100%" }}>
            <Compliance_report height={150} />
          </div>
        </div>
        <div className="home__reportsRightContainer">
          <h1>Nutrition Progress</h1>
          <div style={{ width: "100%" }}>
            <div
              className="chart_container"
              style={{
                height: 200,
                backgroundColor: "white",
                alignItems: "center",
                borderRadius: 15,
              }}
            >
              <NutritionGoalProgress />
            </div>
          </div>
        </div> */}
      </div> 
    </div>
  );
}

export default AthleteHomeReports;
