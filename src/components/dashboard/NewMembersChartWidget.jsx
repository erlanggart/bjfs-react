// File: src/components/dashboard/NewMembersChartWidget.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	LineElement,
	PointElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import ChartLoader from "./ChartLoader";
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	LineElement,
	PointElement,
	Title,
	Tooltip,
	Legend
);

const NewMembersChart = ({ chartData }) => {
	if (
		!chartData ||
		!chartData.labels ||
		!chartData.branches ||
		!chartData.datasets
	) {
		return <div className="text-center p-4">Memuat data grafik...</div>;
	}
	const colors = [
		"rgba(217, 30, 91, 0.7)",
		"rgba(26, 35, 71, 0.7)",
		"rgba(75, 192, 192, 0.7)",
		"rgba(255, 159, 64, 0.7)",
		"rgba(153, 102, 255, 0.7)",
	];
	const barDatasets = chartData.branches.map((branchName, index) => ({
		label: branchName,
		data: chartData.datasets[branchName],
		backgroundColor: colors[index % colors.length],
		stack: "Stack 0",
	}));
	const totals = chartData.labels.map((_, i) =>
		chartData.branches.reduce(
			(sum, branch) => sum + (chartData.datasets[branch][i] || 0),
			0
		)
	);
	const lineDataset = {
		type: "line",
		label: "Total",
		data: totals,
		borderColor: "#4a4a4a",
		backgroundColor: "#4a4a4a",
		fill: false,
		tension: 0.2,
	};
	const data = {
		labels: chartData.labels,
		datasets: [...barDatasets, lineDataset],
	};
	const options = {
		responsive: true,
		plugins: {
			legend: { position: "top" },
			title: {
				display: true,
				text: "Pertumbuhan Member Baru per Cabang (1 Tahun Terakhir)",
			},
		},
		scales: {
			x: { stacked: true },
			y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 } },
		},
	};
	return <Bar options={options} data={data} />;
};

const NewMembersChartWidget = () => {
	const [chartData, setChartData] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		axios
			.get("/api/admin/dashboard_chart_data.php")
			.then((res) => setChartData(res.data))
			.catch((err) => console.error("Gagal memuat data grafik", err))
			.finally(() => setLoading(false));
	}, []);

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			{loading ? <ChartLoader /> : <NewMembersChart chartData={chartData} />}
		</div>
	);
};
export default NewMembersChartWidget;
