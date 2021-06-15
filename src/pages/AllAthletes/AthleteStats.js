import React from "react";
import { useHistory, useParams } from "react-router";
import Reports from "../Reports/Reports";

export default function AthleteStats(props) {
  var params = useParams();
  var Id = params.AthleteId;
  // var history = useHistory();
  window.history.pushState(null, "", "/all-athletes/reports");
  return Id ? (
    <div>
      <Reports Id={Id} />
    </div>
  ) : (
    ""
  );
}
