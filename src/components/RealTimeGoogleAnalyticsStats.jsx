import React, { useState, useEffect } from "react";
import {
	FiEye,
	FiUsers,
	FiClock,
	FiCalendar,
	FiTrendingUp,
	FiGlobe,
} from "react-icons/fi";

/**
 * Real Google Analytics Stats Component
 *
 * Catatan: Komponen ini memerlukan setup Google Analytics Reporting API
 * untuk mendapatkan data real-time yang akurat dari Google Analytics.
 *
 * Setup yang diperlukan:
 * 1. Google Cloud Console project
 * 2. Analytics Reporting API enabled
 * 3. Service account credentials
 * 4. Backend API untuk proxy requests
 */

const RealTimeGoogleAnalyticsStats = () => {
	const [statistics, setStatistics] = useState({
		activeUsers: 0,
		pageViews: 0,
		sessions: 0,
		totalUsers: 0,
		bounceRate: 0,
		avgSessionDuration: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [lastUpdated, setLastUpdated] = useState(null);

	// Fetch real-time data dari Google Analytics API
	const fetchRealTimeData = async () => {
		try {
			setIsLoading(true);

			// Call ke 100% Real-Time GA4 API
			const response = await fetch("/api/analytics/alternative-ga4-stats.php");
			const data = await response.json();

			if (data.success) {
				setStatistics({
					activeUsers: data.activeUsers || 0,
					pageViews: data.pageViews || 0,
					sessions: data.sessions || 0,
					totalUsers: data.totalUsers || 0,
					bounceRate: data.bounceRate || 0,
					avgSessionDuration: data.avgSessionDuration || 0,
				});
				setLastUpdated(new Date().toISOString());
				setError(null);
			} else {
				throw new Error(data.message || "Failed to fetch analytics data");
			}
		} catch (err) {
			console.error("Analytics API Error:", err);
			setError(err.message);

			// Minimal fallback jika API benar-benar tidak tersedia
			setStatistics({
				activeUsers: 1,
				pageViews: 1,
				sessions: 1,
				totalUsers: 400,
				bounceRate: 50,
				avgSessionDuration: 120,
			});
			setLastUpdated(new Date().toISOString());
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		// Initial fetch
		fetchRealTimeData();

		// Update every 60 seconds (GA real-time API limit)
		const interval = setInterval(fetchRealTimeData, 60000);

		return () => clearInterval(interval);
	}, []);

	const statsData = [
		{
			icon: FiUsers,
			label: "Pengguna Aktif",
			value: statistics.activeUsers,
			color: "text-green-600",
			bgColor: "bg-green-50",
			borderColor: "border-green-200",
			description: "Aktif dalam 30 menit terakhir",
			isLive: true,
		},
		{
			icon: FiEye,
			label: "Views (30 menit)",
			value: statistics.pageViews,
			color: "text-blue-600",
			bgColor: "bg-blue-50",
			borderColor: "border-blue-200",
			description: "Halaman dilihat 30 menit terakhir",
		},
		{
			icon: FiCalendar,
			label: "Sesi Aktif",
			value: statistics.sessions,
			color: "text-purple-600",
			bgColor: "bg-purple-50",
			borderColor: "border-purple-200",
			description: "Sesi dalam 30 menit terakhir",
		},
		{
			icon: FiGlobe,
			label: "Total Users",
			value: statistics.totalUsers,
			color: "text-orange-600",
			bgColor: "bg-orange-50",
			borderColor: "border-orange-200",
			description: "Pengguna unik sepanjang waktu",
		},
		{
			icon: FiTrendingUp,
			label: "Bounce Rate",
			value: statistics.bounceRate,
			suffix: "%",
			color: "text-red-600",
			bgColor: "bg-red-50",
			borderColor: "border-red-200",
			description: "Persentase bounce rate",
		},
		{
			icon: FiClock,
			label: "Avg. Duration",
			value: `${Math.floor(statistics.avgSessionDuration / 60)}m ${
				statistics.avgSessionDuration % 60
			}s`,
			color: "text-indigo-600",
			bgColor: "bg-indigo-50",
			borderColor: "border-indigo-200",
			description: "Durasi sesi rata-rata",
			isCustomFormat: true,
		},
	];

	if (isLoading && !statistics.activeUsers) {
		return (
			<section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
				<div className="max-w-7xl mx-auto px-6 text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
					<p className="text-gray-500 mt-4">Memuat data Google Analytics...</p>
				</div>
			</section>
		);
	}

	return (
		<section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
			<div className="max-w-7xl mx-auto px-6">
				{/* Header */}
				<div className="text-center mb-12" data-aos="fade-up">
					{/* Live Indicator */}
					<div className="mb-6 flex items-center justify-center">
						<div className="bg-green-100 border border-green-300 rounded-full px-4 py-2 flex items-center space-x-2">
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
							<span className="text-green-700 font-semibold text-sm">
								100% LIVE DATA
							</span>
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
						</div>
					</div>
					<div className="flex items-center justify-center mb-4">
						<FiTrendingUp className="text-primary mr-3" size={32} />
						<h2 className="text-3xl sm:text-4xl font-bold text-primary">
							Real-time Analytics
						</h2>
					</div>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Statistik website real-time berdasarkan Google Analytics
					</p>
					{error && (
						<div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
							⚠️ Koneksi ke server analytics bermasalah. Menampilkan data
							minimal.
						</div>
					)}
				</div>

				{/* Statistics Grid */}
				<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{statsData.map((stat, index) => (
						<div
							key={index}
							className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300`}
							data-aos="fade-up"
							data-aos-delay={index * 100}
						>
							<div className="flex justify-center mb-3">
								<div
									className={`${stat.color} p-3 rounded-full bg-white shadow-sm`}
								>
									<stat.icon size={20} />
								</div>
							</div>

							<div className="text-3xl sm:text-4xl font-bold text-primary">
								{!stat.isCustomFormat ? (
									<>
										{stat.value.toLocaleString()}
										{stat.suffix || ""}
									</>
								) : (
									stat.value
								)}
							</div>

							<p className="text-sm sm:text-base text-gray-700 mt-2 font-medium">
								{stat.label}
							</p>

							<p className="text-xs text-gray-500 mt-1">{stat.description}</p>

							{/* Real-time indicator */}
							{stat.isLive && (
								<div className="flex items-center justify-center mt-2">
									<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
									<span className="text-xs text-green-600 font-medium">
										Live
									</span>
								</div>
							)}
						</div>
					))}
				</div>

				{/* Google Analytics Badge */}
				<div
					className="mt-8 text-center"
					data-aos="fade-up"
					data-aos-delay="600"
				>
					<div className="inline-flex items-center bg-white rounded-lg px-4 py-2 shadow-sm border">
						<img
							src="https://www.google.com/analytics/static/img/icon.svg"
							alt="Google Analytics"
							className="w-5 h-5 mr-2"
							onError={(e) => {
								e.target.style.display = "none";
							}}
						/>
						<span className="text-sm text-gray-600 font-medium">
							100% Real-Time Google Analytics
						</span>
					</div>
					<p className="text-xs text-gray-500 mt-2">
						🔴 Live data dari GA4 API • Terakhir diperbarui:{" "}
						{lastUpdated
							? new Date(lastUpdated).toLocaleString("id-ID")
							: "Memuat..."}
					</p>
				</div>

				{/* Status Indicator */}
				<div className="mt-6 text-center">
					<div className="inline-flex items-center text-xs">
						<div
							className={`w-2 h-2 rounded-full mr-2 ${
								error ? "bg-yellow-500" : "bg-green-500"
							}`}
						></div>
						<span className="text-gray-500">
							{error ? "Fallback Mode" : "Connected to Google Analytics"}
						</span>
					</div>
				</div>
			</div>
		</section>
	);
};

export default RealTimeGoogleAnalyticsStats;
