import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto"; // Asegúrate de tener Chart.js instalado
import { auditApi } from "../api/axios";

const AuditStatistics = () => {
    const [statistics, setStatistics] = useState([]);
    const [chart, setChart] = useState(null);
    const [filters, setFilters] = useState({
        start_date: "",
        end_date: "",
        event: "",
    });
    const [isFetching, setIsFetching] = useState(false); // Estado para mostrar "Cargando..."

    const eventOptions = [
        { value: "", label: "Todos los eventos" },
        { value: "CREATE", label: "Crear" },
        { value: "UPDATE", label: "Actualizar" },
        { value: "DELETE", label: "Eliminar" },
        { value: "TOGGLE_ACTIVE", label: "Cambiar estado" },
        { value: "ASSIGN_ROLE", label: "Asignar Rol" },
        { value: "REMOVE_ROLE", label: "Remover Rol" },
    ];

    // Obtener estadísticas desde la API
    const fetchStatistics = async () => {
        // Validar fechas antes de enviar la solicitud
        if (filters.start_date && filters.end_date && filters.start_date > filters.end_date) {
            alert("La fecha de inicio no puede ser mayor que la fecha de finalización.");
            return;
        }

        setIsFetching(true);
        try {
            const response = await auditApi.getAuditStatistics(filters);
            setStatistics(response.data);
            updateChart(response.data);
        } catch (error) {
            console.error("Error al obtener estadísticas:", error);
        } finally {
            setIsFetching(false);
        }
    };

    // Inicializar o actualizar el gráfico
    const updateChart = (data) => {
        if (chart) {
            chart.destroy(); // Destruir el gráfico anterior si existe
        }

        const ctx = document.getElementById("auditChart").getContext("2d");
        const newChart = new Chart(ctx, {
            type: "bar",
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
                maintainAspectRatio: false, // Asegura que el gráfico se adapte a su contenedor
                plugins: {
                    legend: {
                        position: "top",
                    },
                    title: {
                        display: true,
                        text: "Estadísticas de Auditoría",
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            autoSkip: true,
                            maxRotation: 45,
                            minRotation: 0,
                        },
                        grid: {
                            display: false,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: "rgba(200, 200, 200, 0.2)",
                        },
                    },
                },
            },
        });

        setChart(newChart);
    };

    // Manejar cambios en los filtros
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
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
                    <div className="flex items-end w-full md:w-auto">
                        <button
                            onClick={fetchStatistics}
                            className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
                        >
                            {isFetching ? "Cargando..." : "Aplicar Filtros"}
                        </button>
                    </div>
                </div>

                {/* Contenedor del gráfico */}
                <div className="bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
                    <div className="relative" style={{ height: "400px" }}>
                        <canvas id="auditChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditStatistics;
