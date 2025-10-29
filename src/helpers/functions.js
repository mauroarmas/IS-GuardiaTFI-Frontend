const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Obtener día, mes y año en UTC (sin ajustar a la zona horaria local)
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Los meses son base 0
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
};

export { formatDate };
