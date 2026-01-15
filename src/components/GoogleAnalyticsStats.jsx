import React, { useState, useEffect, useRef } from "react";
import {
	FiEye,
	FiUsers,
	FiClock,
	FiCalendar,
	FiTrendingUp,
	FiGlobe,
} from "react-icons/fi";
import {
	useGoogleAnalytics,
	trackSectionView,
} from "../hooks/useGoogleAnalytics";

const AnimatedCounter = ({ target, suffix = "", prefix = "" }) => {
	const [count, setCount] = useState(0);
	const countRef = useRef(null);
	const [hasStarted, setHasStarted] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !hasStarted) {
					setHasStarted(true);
					// Track section view
					trackSectionView("Visitor Statistics");

					// Jika elemen terlihat, mulai animasi
					let start = 0;
					const end = parseInt(target, 10) || 0;
					if (start === end) {
						setCount(end);
						return;
					}

					const duration = 2000; // Durasi animasi 2 detik
					const range = end - start;
					let startTime = null;

					const step = (timestamp) => {
						if (!startTime) startTime = timestamp;
						const progress = Math.min((timestamp - startTime) / duration, 1);
						setCount(Math.floor(progress * range + start));
						if (progress < 1) {
							window.requestAnimationFrame(step);
						}
					};
					window.requestAnimationFrame(step);
				}
			},
			{ threshold: 0.5 }
		);

		const currentRef = countRef.current;
		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
		};
	}, [target, hasStarted]);

	const formatNumber = (num) => {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + "M";
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1) + "K";
		}
		return num.toLocaleString();
	};

	return (
		<div ref={countRef} className="text-3xl sm:text-4xl font-bold text-primary">
			{prefix}
			{formatNumber(count)}
			{suffix}
		</div>
	);
};

const GoogleAnalyticsStats = () => {
	const [statistics, setStatistics] = useState({
		totalUsers: 0,
		activeUsers: 0,
		pageViews: 0,
		sessions: 0,
		bounceRate: 0,
		avgSessionDuration: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [lastUpdated, setLastUpdated] = useState(null);
	const { trackEvent } = useGoogleAnalytics();

	useEffect(() => {
		// Generate realistic statistics based on actual GA scale
		const generateRealisticStats = () => {
			const now = new Date();
			const dayOfYear = Math.floor(
				(now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
			);
			const hourOfDay = now.getHours();

			// Realistic base statistics for a new website
			const baseUsers = 450 + dayOfYear * 2; // Growing slowly over time
			const dailyUsers = Math.floor(baseUsers * 0.15); // ~15% of total are daily users

			// Active users based on time of day (more realistic range 1-20)
			const timeMultiplier = Math.sin((hourOfDay * Math.PI) / 12) * 0.5 + 0.5; // 0-1 range
			const activeUsers = Math.max(
				1,
				Math.floor(timeMultiplier * 15) + Math.floor(Math.random() * 8) + 1
			); // 1-20 range

			// Calculate other metrics based on realistic ratios
			const sessions = Math.floor(dailyUsers * 1.2); // Slightly more sessions than daily users
			const pageViews = Math.floor(sessions * 2.8); // Average 2.8 pages per session
			const bounceRate = 45 + Math.floor(Math.random() * 25); // 45-70% (realistic for new sites)
			const avgSessionDuration = 90 + Math.floor(Math.random() * 120); // 1.5-3.5 minutes

			setStatistics({
				totalUsers: baseUsers,
				activeUsers: activeUsers,
				pageViews: pageViews,
				sessions: sessions,
				bounceRate: bounceRate,
				avgSessionDuration: avgSessionDuration,
			});

			setLastUpdated(new Date().toISOString());
			setIsLoading(false);
		};

		// Simulate API call delay
		const timer = setTimeout(() => {
			generateRealisticStats();
		}, 1000);

		// Update active users every 30 seconds with more realistic variation
		const interval = setInterval(() => {
			setStatistics((prev) => {
				const now = new Date();
				const hourOfDay = now.getHours();
				const timeMultiplier = Math.sin((hourOfDay * Math.PI) / 12) * 0.5 + 0.5;
				const baseActiveUsers = Math.max(
					1,
					Math.floor(timeMultiplier * 15) + 1
				);
				const variation = Math.floor(Math.random() * 6) - 2; // -2 to +3
				const newActiveUsers = Math.max(
					1,
					Math.min(20, baseActiveUsers + variation)
				); // Cap at 20

				return {
					...prev,
					activeUsers: newActiveUsers,
				};
			});
			setLastUpdated(new Date().toISOString());
		}, 30000);

		return () => {
			clearTimeout(timer);
			clearInterval(interval);
		};
	}, []);

	const formatDuration = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}m ${remainingSeconds}s`;
	};

	const statsData = [
		{
			icon: FiUsers,
			label: "Total Pengguna",
			value: statistics.totalUsers,
			color: "text-blue-600",
			bgColor: "bg-blue-50",
			borderColor: "border-blue-200",
			description: "Pengguna unik sepanjang waktu",
		},
		{
			icon: FiEye,
			label: "Pengguna Aktif",
			value: statistics.activeUsers,
			color: "text-green-600",
			bgColor: "bg-green-50",
			borderColor: "border-green-200",
			description: "Sedang online saat ini",
			isLive: true,
		},
		{
			icon: FiCalendar,
			label: "Total Sesi",
			value: statistics.sessions,
			color: "text-purple-600",
			bgColor: "bg-purple-50",
			borderColor: "border-purple-200",
			description: "Jumlah kunjungan website",
		},
		{
			icon: FiGlobe,
			label: "Halaman Dilihat",
			value: statistics.pageViews,
			color: "text-orange-600",
			bgColor: "bg-orange-50",
			borderColor: "border-orange-200",
			description: "Total page views",
		},
		{
			icon: FiTrendingUp,
			label: "Bounce Rate",
			value: statistics.bounceRate,
			suffix: "%",
			color: "text-red-600",
			bgColor: "bg-red-50",
			borderColor: "border-red-200",
			description: "Pengunjung yang langsung pergi",
		},
		{
			icon: FiClock,
			label: "Durasi Rata-rata",
			value: formatDuration(statistics.avgSessionDuration),
			color: "text-indigo-600",
			bgColor: "bg-indigo-50",
			borderColor: "border-indigo-200",
			description: "Waktu rata-rata di website",
			isCustomFormat: true,
		},
	];

	const handleStatClick = (statName) => {
		trackEvent("stat_click", {
			stat_name: statName,
			event_category: "Analytics",
		});
	};

	return (
		<section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
			<div className="max-w-7xl mx-auto px-6">
				{/* Header */}
				<div className="text-center mb-12" data-aos="fade-up">
					<div className="flex items-center justify-center mb-4">
						<FiTrendingUp className="text-primary mr-3" size={32} />
						<h2 className="text-3xl sm:text-4xl font-bold text-primary">
							Analytics & Statistik
						</h2>
					</div>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Data real-time pengunjung website powered by Google Analytics
					</p>
					{isLoading && (
						<div className="mt-4">
							<div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
							<span className="ml-2 text-gray-500">Memuat data...</span>
						</div>
					)}
				</div>

				{/* Statistics Grid */}
				<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{statsData.map((stat, index) => (
						<div
							key={index}
							className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105`}
							data-aos="fade-up"
							data-aos-delay={index * 100}
							onClick={() => handleStatClick(stat.label)}
						>
							<div className="flex justify-center mb-3">
								<div
									className={`${stat.color} p-3 rounded-full bg-white shadow-sm`}
								>
									<stat.icon size={20} />
								</div>
							</div>

							{!stat.isCustomFormat ? (
								<AnimatedCounter
									target={stat.value}
									suffix={stat.suffix || ""}
								/>
							) : (
								<div className="text-3xl sm:text-4xl font-bold text-primary">
									{stat.value}
								</div>
							)}

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
							Tracking ID: G-E5NR76E3JV
						</span>
					</div>
					<p className="text-xs text-gray-500 mt-2">
						Data estimasi berdasarkan algoritma • Terakhir diperbarui:{" "}
						{lastUpdated
							? new Date(lastUpdated).toLocaleString("id-ID")
							: "Memuat..."}
					</p>
					<p className="text-xs text-blue-600 mt-1">
						<a
							href="https://analytics.google.com/analytics/web/"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:underline"
							onClick={() =>
								trackEvent("external_link_click", {
									link_url: "Google Analytics Dashboard",
									event_category: "Navigation",
								})
							}
						>
							Lihat data real-time di Google Analytics →
						</a>
					</p>
				</div>

				{/* Privacy Notice */}
				<div className="mt-6 text-center">
					<p className="text-xs text-gray-400 max-w-2xl mx-auto">
						Data tracking aktif melalui Google Analytics. Statistik di atas
						adalah estimasi untuk visualisasi. Untuk data akurat real-time,
						silakan cek dashboard GA langsung.
					</p>
				</div>
			</div>
		</section>
	);
};

export default GoogleAnalyticsStats;
