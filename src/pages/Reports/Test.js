import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js";

import "react-dropdown/style.css";

import Dropdown_ from "./Dropdown_";

function Test() {
  const [chart_data, setchart_data] = useState({});
  const [isLoading, setisLoading] = useState(true);
  const data = {
    type: "roundedBar",
    labels: [30, 31, "01", "02", "03", "04", "05"],
    datasets: [
      {
        label: "Fully Compliant",
        categoryPercentage: 1,
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "#fcd54a",
      },
      {
        label: "Partially Compliant",
        categoryPercentage: 1,
        data: [1, 0, 0, 0, 0, 0, 0],
        backgroundColor: "#d3d3d3",
      },
      {
        label: "Non Compliant",
        categoryPercentage: 1,
        data: [1, 1, 1, 0, 0, 0, 0],
        backgroundColor: "#454545",
      },
    ],
  };

  console.log(data);
  const data1 = {
    type: "roundedBar",
    labels: [30, 31, "01", "02", "03", "04", "05"],
    datasets: [
      {
        label: "Fully Compliant",
        categoryPercentage: 0.1,
        data: [1, 7, 4, 1, 6, 2, 6],
        backgroundColor: "#fcd54a",
      },
      {
        label: "Partially Compliant",
        categoryPercentage: 0.1,
        data: [1, 5, 2, 1, 3, 1, 5],
        backgroundColor: "#d3d3d3",
      },
      {
        label: "Non Compliant",
        categoryPercentage: 0.1,
        data: [2, 1, 2, 3, 1, 6, 0],
        backgroundColor: "#454545",
      },
    ],
  };
  useEffect(() => {
    setchart_data(data);
    setisLoading(!isLoading);
  }, []);

  const options = {
    maintainAspectRatio: true,

    legend: {
      display: false,
      labels: {
        // This more specific font property overrides the global property
        fontColor: "red",
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  function labels() {
    let datasets = chart_data.datasets;
    if (datasets) {
      let stack_label = Object.keys(datasets).map((item) => {
        return (
          <li style={{ display: "flex", alignItems: "center" }}>
            {" "}
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                borderWidth: 1,
                borderColor: "red",
                marginRight: 10,
                backgroundColor: datasets[item]["backgroundColor"],
              }}
            ></div>
            {datasets[item]["label"]}
          </li>
        );
      });
      return (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            , {stack_label}
          </ul>
        </div>
      );
    }
  }

  return (
    <div className="App">
      <div className="chart_container">
        <div className="chart_">
          <div
            className="chart_legend"
            style={{ color: "#808080", fontSize: 20 }}
          >
            Weekly Report
          </div>

          <div className="chart_header">
            <img
              onClick={() => {
                setchart_data(data);
              }}
              className="left_arrow"
              alt="legend"
              style={{ marginRight: "auto" }}
              src="https://cdn0.iconfinder.com/data/icons/glyphpack/26/nav-arrow-left-512.png"
            />
            <div
              className="chart_legend"
              style={{ color: "#808080", fontSize: 17 }}
            >
              30 May 2021-5 June 2021
            </div>
            <div className="stacked_labels"></div>
            <img
              onClick={() => {
                setchart_data(data1);
              }}
              className="right_arrow"
              alt="legend"
              src="https://cdn0.iconfinder.com/data/icons/glyphpack/26/nav-arrow-left-512.png"
              style={{ transform: "rotate(180deg)", marginLeft: "auto" }}
            />
          </div>
          {labels()}
          <div className="chart_bar" style={{ marginTop: 20 }}>
            <Bar width="350" height="300" data={chart_data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Test;
