import React, { useState, useEffect } from "react";
import {
	FiCalendar,
	FiUsers,
	FiEye,
	FiClock,
	FiTrendingUp,
	FiRefreshCw,
	FiBarChart2 as FiBarChart3,
} from "react-icons/fi";

/**
 * Historical Google Analytics Stats Component
 * Menampilkan data pengunjung: hari ini, minggu ini, bulan ini
 */
const HistoricalAnalyticsStats = () => {
	const [historicalData, setHistoricalData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [lastUpdated, setLastUpdated] = useState(null);
	const [selectedPeriod, setSelectedPeriod] = useState("today");

	// Fetch historical data
	const fetchHistoricalData = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/analytics/historical-stats.php");
			const data = await response.json();

			if (data.success) {
				setHistoricalData(data.periods);
				setLastUpdated(new Date().toLocaleTimeString("id-ID"));

				if (process.env.NODE_ENV === "development") {
					console.log(
						"Historical GA data updated:",
						data.source,
						data.timestamp
					);
				}
			} else {
				throw new Error(data.message || "Failed to fetch historical data");
			}
		} catch (error) {
			console.error("Error fetching historical analytics:", error);
			setError("Gagal memuat data analytics historis");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchHistoricalData();

		// Auto-refresh every 5 minutes
		const interval = setInterval(fetchHistoricalData, 300000);
		return () => clearInterval(interval);
	}, []);

	// Format duration
	const formatDuration = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}m ${remainingSeconds}s`;
	};

	// Format number
	const formatNumber = (number) => {
		if (number >= 1000) {
			return (number / 1000).toFixed(1) + "K";
		}
		return number.toString();
	};

	// Get period data
	const getPeriodData = (period) => {
		return historicalData ? historicalData[period] : null;
	};

	// Period selector
	const periods = [
		{
			key: "today",
			label: "Hari Ini",
			icon: FiCalendar,
			color: "text-blue-600",
		},
		{
			key: "thisWeek",
			label: "Minggu Ini",
			icon: FiBarChart3,
			color: "text-green-600",
		},
		{
			key: "thisMonth",
			label: "Bulan Ini",
			icon: FiTrendingUp,
			color: "text-purple-600",
		},
		{
			key: "last7Days",
			label: "7 Hari",
			icon: FiClock,
			color: "text-orange-600",
		},
		{
			key: "last30Days",
			label: "30 Hari",
			icon: FiUsers,
			color: "text-indigo-600",
		},
	];

	if (loading && !historicalData) {
		return (
			<section className="py-12 bg-white">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
						<p className="text-gray-500 mt-4">
							Memuat data historical analytics...
						</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-12 bg-white">
			<div className="max-w-7xl mx-auto px-6">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="flex items-center justify-center mb-4">
						<FiBarChart3 className="text-primary mr-3" size={28} />
						<h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
							Statistik Pengunjung
						</h2>
					</div>
					<p className="text-gray-600 max-w-2xl mx-auto">
						Data pengunjung website dari Google Analytics untuk periode berbeda
					</p>

					{/* Update Info */}
					{lastUpdated && (
						<div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
							<FiRefreshCw size={14} />
							<span>Terakhir diperbarui: {lastUpdated}</span>
						</div>
					)}
				</div>

				{/* Period Selector */}
				<div className="mb-8">
					<div className="flex flex-wrap justify-center gap-2 mb-6">
						{periods.map((period) => {
							const IconComponent = period.icon;
							const isActive = selectedPeriod === period.key;

							return (
								<button
									key={period.key}
									onClick={() => setSelectedPeriod(period.key)}
									className={`
                                        flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                                        ${
																					isActive
																						? "bg-primary text-white shadow-lg transform scale-105"
																						: "bg-gray-100 text-gray-700 hover:bg-gray-200"
																				}
                                    `}
								>
									<IconComponent
										size={16}
										className={isActive ? "text-white" : period.color}
									/>
									<span className="text-sm">{period.label}</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Selected Period Display */}
				{historicalData && (
					<div className="mb-8">
						{periods.map((period) => {
							if (selectedPeriod !== period.key) return null;

							const data = getPeriodData(period.key);
							if (!data) return null;

							return (
								<div
									key={period.key}
									className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200"
								>
									{/* Period Header */}
									<div className="text-center mb-6">
										<div className="flex items-center justify-center mb-2">
											<period.icon
												className={`${period.color} mr-2`}
												size={24}
											/>
											<h3 className="text-xl font-bold text-gray-900">
												{data.label}
											</h3>
										</div>
										<p className="text-sm text-gray-600">{data.dateRange}</p>
									</div>

									{/* Metrics Grid */}
									<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
										{/* Users */}
										<div className="bg-white rounded-lg p-4 border border-blue-200 text-center">
											<div className="flex items-center justify-center mb-2">
												<FiUsers className="text-blue-600 mr-2" size={20} />
												<span className="text-sm font-medium text-gray-600">
													Pengunjung
												</span>
											</div>
											<div className="text-2xl font-bold text-blue-600">
												{formatNumber(data.users)}
											</div>
										</div>

										{/* Sessions */}
										<div className="bg-white rounded-lg p-4 border border-green-200 text-center">
											<div className="flex items-center justify-center mb-2">
												<FiBarChart3
													className="text-green-600 mr-2"
													size={20}
												/>
												<span className="text-sm font-medium text-gray-600">
													Sesi
												</span>
											</div>
											<div className="text-2xl font-bold text-green-600">
												{formatNumber(data.sessions)}
											</div>
										</div>

										{/* Page Views */}
										<div className="bg-white rounded-lg p-4 border border-purple-200 text-center">
											<div className="flex items-center justify-center mb-2">
												<FiEye className="text-purple-600 mr-2" size={20} />
												<span className="text-sm font-medium text-gray-600">
													Halaman
												</span>
											</div>
											<div className="text-2xl font-bold text-purple-600">
												{formatNumber(data.pageViews)}
											</div>
										</div>

										{/* Bounce Rate */}
										<div className="bg-white rounded-lg p-4 border border-orange-200 text-center">
											<div className="flex items-center justify-center mb-2">
												<FiTrendingUp
													className="text-orange-600 mr-2"
													size={20}
												/>
												<span className="text-sm font-medium text-gray-600">
													Bounce Rate
												</span>
											</div>
											<div className="text-2xl font-bold text-orange-600">
												{data.bounceRate}%
											</div>
										</div>

										{/* Avg Duration */}
										<div className="bg-white rounded-lg p-4 border border-indigo-200 text-center">
											<div className="flex items-center justify-center mb-2">
												<FiClock className="text-indigo-600 mr-2" size={20} />
												<span className="text-sm font-medium text-gray-600">
													Durasi Avg
												</span>
											</div>
											<div className="text-lg font-bold text-indigo-600">
												{formatDuration(data.avgSessionDuration)}
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}

				{/* All Periods Overview */}
				{historicalData && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
						{periods.map((period) => {
							const data = getPeriodData(period.key);
							if (!data) return null;

							const IconComponent = period.icon;

							return (
								<div
									key={period.key}
									className={`
                                        bg-white rounded-xl p-4 border-2 transition-all duration-200 cursor-pointer
                                        ${
																					selectedPeriod === period.key
																						? "border-primary shadow-lg transform scale-105"
																						: "border-gray-200 hover:border-gray-300 hover:shadow-md"
																				}
                                    `}
									onClick={() => setSelectedPeriod(period.key)}
								>
									<div className="flex items-center justify-between mb-3">
										<IconComponent className={period.color} size={20} />
										<span className="text-xs text-gray-500 font-medium">
											{period.label}
										</span>
									</div>

									<div className="space-y-2">
										<div className="flex justify-between items-center">
											<span className="text-xs text-gray-600">Pengunjung</span>
											<span className="font-bold text-gray-900">
												{formatNumber(data.users)}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-xs text-gray-600">Halaman</span>
											<span className="font-bold text-gray-900">
												{formatNumber(data.pageViews)}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-xs text-gray-600">Durasi</span>
											<span className="font-bold text-gray-900">
												{formatDuration(data.avgSessionDuration)}
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}

				{/* Error State */}
				{error && (
					<div className="text-center py-8">
						<div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
							<p className="text-red-600 font-medium">{error}</p>
							<button
								onClick={fetchHistoricalData}
								className="mt-2 text-red-700 hover:text-red-800 font-medium"
							>
								Coba Lagi
							</button>
						</div>
					</div>
				)}

				{/* Powered by */}
				<div className="text-center mt-8 pt-4 border-t border-gray-200">
					<div className="flex items-center justify-center space-x-2">
						<img
							src="https://www.google.com/analytics/images/google-analytics-logo.svg"
							alt="Google Analytics"
							className="w-5 h-5"
							onError={(e) => {
								e.target.style.display = "none";
							}}
						/>
						<span className="text-sm text-gray-600 font-medium">
							Historical Data from Google Analytics
						</span>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HistoricalAnalyticsStats;
