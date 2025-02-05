import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto"; // Asegúrate de tener Chart.js instalado
import { auditApi, moduleApi } from "../api/axios"; // Importar API de auditoría y módulos

const AuditStatistics = () => {
    const [statistics, setStatistics] = useState([]);
    const [chart, setChart] = useState([]);
    const [modules, setModules] = useState([]); // Lista de módulos
    const [totals, setTotals] = useState({ insert: 0, update: 0, delete: 0 });
    const [filters, setFilters] = useState({
        start_date: "",
        end_date: "",
        event: "",
        module: "", // Nuevo filtro por módulo
    });
    const [isFetching, setIsFetching] = useState(false); // Estado para mostrar "Cargando..."

    const eventOptions = [
        { value: "", label: "Todos los eventos" },
        { value: "INSERT", label: "Crear" },
        { value: "UPDATE", label: "Actualizar" },
        { value: "DELETE", label: "Eliminar" },
    ];

    // Obtener estadísticas desde la API
    const fetchStatistics = async () => {
        if (filters.start_date && filters.end_date && filters.start_date > filters.end_date) {
            alert("La fecha de inicio no puede ser mayor que la fecha de finalización.");
            return;
        }

        setIsFetching(true);
        console.log("Filtros enviados al backend:", filters); // Log de filtros enviados


        try {
            const response = await auditApi.getAuditStatistics({
                ...filters,
                module: filters.module.toUpperCase(), // Enviar módulo en mayúsculas
            });

            console.log("Datos recibidos del backend:", response.data); // Log de datos recibidos
            setStatistics(response.data);

            // Calcular totales de eventos
            const stats = response.data.statistics || [];
            setStatistics(stats);
            const insertTotal = stats
                .filter((stat) => stat.event === "INSERT")
                .reduce((acc, curr) => acc + curr.total, 0);
            const updateTotal = stats
                .filter((stat) => stat.event === "UPDATE")
                .reduce((acc, curr) => acc + curr.total, 0);
            const deleteTotal = stats
                .filter((stat) => stat.event === "DELETE")
                .reduce((acc, curr) => acc + curr.total, 0);

            setTotals({ insert: insertTotal, update: updateTotal, delete: deleteTotal });
            console.log("Totales de eventos:", totals); // Log de totales de eventos
            updateChart(stats, "auditChart1", "bar"); // Gráfico de barras
            updateChart(stats, "auditChart2", "pie"); // Gráfico de pastel
        } catch (error) {
            // console.error("Error al obtener estadísticas:", error);
            console.log(error);
        } finally {
            setIsFetching(false);
        }
    };

    // Obtener la lista de módulos desde el backend
    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await moduleApi.getModules();
                console.log("Módulos cargados:", response.data.modules); // Log de módulos cargados
                setModules(response.data.modules || []);
            } catch (error) {
                console.error("Error al cargar los módulos:", error);
            }
        };

        fetchModules();
    }, []);

    // Manejar cambios en los filtros
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    // Actualizar gráfico
    const updateChart = (data, chartId, chartType) => {
        const chartContainer = document.getElementById(chartId)?.parentNode;

        if (!chartContainer) {
            console.error(`El contenedor para el gráfico con ID "${chartId}" no existe.`);
            return;
        }

        // Limpiar canvas existente
        const existingChart = chart.find((chart) => chart.id === chartId);
        if (existingChart) {
            existingChart.instance.destroy();
        }

        chartContainer.innerHTML = `<canvas id="${chartId}"></canvas>`;
        const ctx = document.getElementById(chartId).getContext("2d");

        const newChart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: data.map((stat) => `${stat.event} (${stat.origin_service})`),
                datasets: [
                    {
                        label: "Cantidad",
                        data: data.map((stat) => stat.total),
                        backgroundColor: [
                            "rgba(75, 192, 192, 0.6)",
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                            "rgba(153, 102, 255, 0.6)",
                            "rgba(255, 159, 64, 0.6)",
                        ],
                        borderColor: [
                            "rgba(75, 192, 192, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)",
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: `Gráfico (${chartType})` },
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, grid: { color: "rgba(200, 200, 200, 0.2)" } },
                },
            },
        });

        setChart((prevCharts) => [
            ...prevCharts.filter((chart) => chart.id !== chartId),
            { id: chartId, instance: newChart },
        ]);
    };


    return (
        <div className="audit-statistics px-4 py-6">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                {/* Contenedor de filtros */}
                <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                    <div className="flex flex-col w-full md:w-auto">
                        <label className="text-sm font-medium text-gray-700 dark:text-white">
                            Fecha de Inicio
                        </label>
                        <input
                            type="date"
                            name="start_date"
                            value={filters.start_date}
                            onChange={handleFilterChange}
                            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col w-full md:w-auto">
                        <label className="text-sm font-medium text-gray-700 dark:text-white">
                            Fecha de Finalización
                        </label>
                        <input
                            type="date"
                            name="end_date"
                            value={filters.end_date}
                            onChange={handleFilterChange}
                            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col w-full md:w-auto">
                        <label className="text-sm font-medium text-gray-700 dark:text-white">
                            Evento
                        </label>
                        <select
                            name="event"
                            value={filters.event}
                            onChange={handleFilterChange}
                            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            {eventOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Nuevo filtro por Módulo */}
                    <div className="flex flex-col w-full md:w-auto">
                        <label className="text-sm font-medium text-gray-700 dark:text-white">
                            Módulo
                        </label>
                        <select
                            name="module"
                            value={filters.module}
                            onChange={handleFilterChange}
                            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos los módulos</option>
                            {modules.map((module, index) => (
                                <option key={index} value={module.name}>
                                    {module.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end w-full md:w-auto">
                        <button
                            onClick={fetchStatistics}
                            className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
                        >
                            {isFetching ? "Cargando..." : "Aplicar Filtros"}
                        </button>
                    </div>
                </div>
                {/* Tarjetas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-100 bg-opacity-50 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold text-green-700">INSERT</h3>
                        <p className="text-2xl font-semibold">{totals.insert}</p>
                        <p className="text-sm text-gray-600">Total de inserciones</p>
                    </div>
                    <div className="bg-blue-100 bg-opacity-50 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold text-blue-700">UPDATE</h3>
                        <p className="text-2xl font-semibold">{totals.update}</p>
                        <p className="text-sm text-gray-600">Total de actualizaciones</p>
                    </div>
                    <div className="bg-red-100 bg-opacity-50 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold text-red-700">DELETE</h3>
                        <p className="text-2xl font-semibold">{totals.delete}</p>
                        <p className="text-sm text-gray-600">Total de eliminaciones</p>
                    </div>
                </div>
                {/* Contenedor de gráficos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Gráfico 1 */}
                    <div className="bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
                        <h4 className="text-center text-lg font-medium text-gray-700 dark:text-white mb-4">
                            Gráfico de Barras
                        </h4>
                        <div className="relative" style={{ height: "400px" }}>
                            <canvas id="auditChart1"></canvas>
                        </div>
                    </div>

                    {/* Gráfico 2 */}
                    <div className="bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
                        <h4 className="text-center text-lg font-medium text-gray-700 dark:text-white mb-4">
                            Gráfico de Pastel
                        </h4>
                        <div className="relative" style={{ height: "400px" }}>
                            <canvas id="auditChart2"></canvas>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    );
};

export default AuditStatistics;
