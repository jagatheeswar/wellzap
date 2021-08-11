import React from "react";
import { useHistory, useParams, useLocation } from "react-router";
import Reports from "../Reports/Reports";

export default function AthleteStats(props) {
  var params = useParams();
  const location = useLocation();
  //var Id = params.AthleteId;
  var Id = location.state?.AthleteId;
  console.log(location.state);

  // var history = useHistory();
  //window.history.pushState(null, "", "/all-athletes/reports");
  return (
    <div>
      <Reports Id={Id} />
    </div>
  );
}
