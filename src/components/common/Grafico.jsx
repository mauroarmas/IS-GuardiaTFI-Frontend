import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const Grafico = ({ arrayLabels = [], arrayData = [], colores=[], total }) => {
  const labelsWithCounts = arrayLabels.map((label, idx) => {
    const val = arrayData[idx] ?? 0;
    return `${label} ${val}`;
  });

  const data = {
    labels: [],
    datasets: [
      {
        data: arrayData,
        backgroundColor: [
          "rgba(255, 31, 31, 0.6)",
          "rgba(255, 85, 33, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(40, 236, 73, 0.6)",
          "rgba(27, 154, 240, 0.6)",
        ],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false, // ❌ oculta la leyenda
      },
      tooltip: {
        enabled: true, // si querés ver el valor cuando pasás el mouse
      },
    },
    maintainAspectRatio: false, // ⭐ importante
  };

  return (
    <div style={{ width: "380px", height: "150px", display: "flex" }} className="d-flex align-items-center justify-content-center">
      
      <ul style={{ marginRight: "20px" }}>
        <h5>Total: {total}</h5>
        {arrayLabels.map((label, idx) => (
          <li key={idx} style={{ fontSize: "15px", marginBottom: "2px", fontWeight: "500" }}>
            <bold className="me-2">{colores[idx]}</bold>
            {label}: {arrayData[idx] || 0}
          </li>
        ))}
      </ul>

      <div style={{ width: "150px", height: "150px" }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default Grafico;
