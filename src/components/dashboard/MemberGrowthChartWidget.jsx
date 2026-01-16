// File: src/components/dashboard/MemberGrowthChartWidget.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from "chart.js";
import ChartLoader from "./ChartLoader";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler
);

const MemberGrowthChart = ({ chartData }) => {
	if (
		!chartData ||
		!chartData.labels ||
		!chartData.branches ||
		!chartData.datasets
	) {
		return <div className="text-center p-4">Memuat data grafik...</div>;
	}

	const colors = [
		"rgba(217, 30, 91, 1)", // Secondary
		"rgba(26, 35, 71, 1)", // Primary
		"rgba(75, 192, 192, 1)", // Teal
		"rgba(255, 159, 64, 1)", // Orange
		"rgba(153, 102, 255, 1)", // Purple
		"rgba(54, 162, 235, 1)", // Blue
		"rgba(255, 206, 86, 1)", // Yellow
	];

	const datasets = chartData.branches.map((branchName, index) => {
		const color = colors[index % colors.length];
		return {
			label: branchName,
			data: chartData.datasets[branchName],
			borderColor: color,
			backgroundColor: color.replace("1)", "0.1)"), // Ubah opacity untuk area fill
			fill: true,
			tension: 0.4,
		};
	});

	const data = {
		labels: chartData.labels,
		datasets: datasets,
	};

	const options = {
		responsive: true,
		plugins: {
			legend: { position: "top" },
			title: {
				display: true,
				text: "Total Member Aktif per Cabang (1 Tahun Terakhir)",
			},
		},
		scales: {
			y: { beginAtZero: true },
		},
	};

	return <Line options={options} data={data} />;
};

const MemberGrowthChartWidget = () => {
	const [chartData, setChartData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios
			.get("/api/admin/dashboard-member-count-chart")
			.then((res) => setChartData(res.data))
			.catch((err) =>
				console.error("Gagal memuat data grafik pertumbuhan member", err)
			)
			.finally(() => setLoading(false));
	}, []);

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			{loading ? <ChartLoader /> : <MemberGrowthChart chartData={chartData} />}
		</div>
	);
};

export default MemberGrowthChartWidget;
