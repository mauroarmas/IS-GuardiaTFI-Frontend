import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Container } from "react-bootstrap";

// Registrar componentes de Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const PruebaGrafico = ({ arrayLabels = [], arrayData = [] }) => {
  const data = {
    labels: arrayLabels,
    datasets: [
      {
        label: "Cantidad de Proyectos",
        data: arrayData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },

    },
  };

  return (
    <Container>
      <Pie data={data} options={options} />
    </Container>
  );
};

export default PruebaGrafico;
