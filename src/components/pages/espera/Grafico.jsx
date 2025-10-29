import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Container } from "react-bootstrap";

// Registrar componentes de Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const Grafico = ({ arrayLabels = [], arrayData = [] }) => {
  const data = {
    labels: arrayLabels,
    datasets: [
      {
        label: "Cantidad de Ingresos",
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
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },

    },
  };

  return (
    <Container>
      <Pie data={data} options={options} />
    </Container>
  );
};

export default Grafico;
