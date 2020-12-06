import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChart = (data, casesType) => {
  const chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint, // get difference between 2 dates and get number of new cases between the 2 date
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};
function LineGraph({casesType ="cases" ,...props}) {
  const [data, setData] = useState({});

  useEffect(() => {
    const getData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all")
        .then((response) => response.json())
        .then((data) => {
          let chartData = buildChart(data,casesType);
          setData(chartData);
        });
    };
    getData();
  }, [casesType]);

  return (
    <div className= {props.className}>
      
     {/* check if empty */}
      {data?.length > 0 && (
              <Line
              data={{
                datasets: [
                  {
                    backgroundColor: "rgba(245, 111, 22, 0.774)",
                   
                    data: data,
                  },
                ],
              }}
              options={options}
            />
         
      )}
      </div>
  );

}

export default LineGraph;
