import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsSolidGauge from "highcharts/modules/solid-gauge";

if (typeof Highcharts === "object") {
  HighchartsMore(Highcharts);
  HighchartsSolidGauge(Highcharts);
}

const Pointer = ({ degrees }) => {
  const container = React.useRef(null);
  const [data, setData] = useState(degrees);

  useEffect(() => {
    Highcharts.chart(container.current, {
      chart: {
        type: "gauge",
        alignTicks: false,
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
      },

      title: {
        text: "Orientation Relative to Starting",
      },

      pane: {
        startAngle: 0,
        endAngle: 360,
      },

      yAxis: [
        {
          min: 0,
          max: 360,
          lineColor: "#339",
          tickColor: "#339",
          minorTickColor: "#339",
          offset: -25,
          lineWidth: 2,
          labels: {
            distance: -20,
            rotation: "auto",
          },
          tickLength: 5,
          minorTickLength: 5,
          endOnTick: false,
        },
        {
          min: 0,
          max: 124,
          tickPosition: "outside",
          lineColor: "#933",
          lineWidth: 2,
          minorTickPosition: "outside",
          tickColor: "#933",
          minorTickColor: "#933",
          tickLength: 5,
          minorTickLength: 5,
          labels: {
            distance: 12,
            rotation: "auto",
          },
          offset: -20,
          endOnTick: false,
        },
      ],

      series: [
        {
          name: "Direction",
          data: [degrees],
          dataLabels: {
            format:
              '<span style="color:#339">{y} Deg</span><br/>' +
              '<span style="color:#933">{(multiply y 0.621):.0f} Deg</span>',
            backgroundColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1,
              },
              stops: [
                [0, "#DDD"],
                [1, "#FFF"],
              ],
            },
          },
          tooltip: {
            valueSuffix: " Deg",
          },
        },
      ],
    });
  });
  return <div ref={container}></div>;
};

export default Pointer;
