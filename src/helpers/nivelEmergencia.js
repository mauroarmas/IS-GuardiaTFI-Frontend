export function getColorByUrgencyLevel(level) {
  const nivel = nivelesEmergencia.find((n) => n.id === level);
  const nombre = nivel ? nivel.color + " " + nivel.nombre : "Nivel Desconocido";
  return nombre;
}

export const nivelesEmergencia = [
  {
    id: 1,
    nombre: "Critica",
    color: "🔴",
  },
  {
    id: 2,
    nombre: "Emergencia",
    color: "🟠",
  },
  {
    id: 3,
    nombre: "Urgencia",
    color: "🟡 ",
  },
  {
    id: 4,
    nombre: "Urgencia Menor",
    color: "🟢",
  },
  {
    id: 5,
    nombre: "Sin Urgencia",
    color: "🔵 ",
  },
];


