import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Container } from "react-bootstrap";

// Registrar componentes de Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const Grafico = ({ arrayLabels = [], arrayData = [] }) => {
  // Construir labels que incluyan el conteo al lado: "Etiqueta (n)"
  const labelsWithCounts = Array.isArray(arrayLabels)
    ? arrayLabels.map((label, idx) => {
        const val = Array.isArray(arrayData) && arrayData[idx] != null ? arrayData[idx] : 0;
        return `${label} ${val}`;
      })
    : [];
  const data = {
    labels: labelsWithCounts,
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
        borderColor: [
          "rgba(255, 31, 31, 0.6)",
          "rgba(255, 85, 33, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(40, 236, 73, 0.6)",
          "rgba(27, 154, 240, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {

    plugins: {
      legend: {
        // Mostrar la leyenda en forma de lista vertical
        position: "left",
        labels: {
          boxWidth: 12,
          padding: 8,
        },
      },
    },
    
  };

  return <Doughnut data={data} options={options} />;
};

export default Grafico;
