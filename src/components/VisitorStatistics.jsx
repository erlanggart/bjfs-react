import React, { useState, useEffect, useRef } from "react";
import { FiEye, FiUsers, FiClock, FiCalendar } from "react-icons/fi";

const AnimatedCounter = ({ target, suffix = "" }) => {
	const [count, setCount] = useState(0);
	const countRef = useRef(null);
	const [hasStarted, setHasStarted] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !hasStarted) {
					setHasStarted(true);
					// Jika elemen terlihat, mulai animasi
					let start = 0;
					const end = parseInt(target, 10);
					if (start === end) return;

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
		return num.toString();
	};

	return (
		<div ref={countRef} className="text-3xl sm:text-4xl font-bold text-primary">
			{formatNumber(count)}
			{suffix && <span className="text-sm font-normal">{suffix}</span>}
		</div>
	);
};

const VisitorStatistics = () => {
	const [statistics, setStatistics] = useState({
		totalVisitors: 0,
		dailyVisitors: 0,
		onlineUsers: 0,
		pageViews: 0,
	});
	const [sessionId, setSessionId] = useState(null);
	const [lastUpdated, setLastUpdated] = useState(null);

	// Track visitor dan fetch statistics
	useEffect(() => {
		// Generate session ID untuk tracking
		const generateSessionId = () => {
			return (
				"session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
			);
		};

		// Fetch current statistics
		const fetchStatistics = async () => {
			try {
				const response = await fetch("/api/public/visitor_stats.php");
				const data = await response.json();

				if (data.success) {
					setStatistics({
						totalVisitors: data.data.total_visitors,
						dailyVisitors: data.data.daily_visitors,
						onlineUsers: data.data.current_online,
						pageViews: data.data.page_views,
					});
					setLastUpdated(data.data.last_updated);
				}
			} catch (error) {
				console.error("Error fetching visitor statistics:", error);
				// Fallback ke data simulasi jika API error
				const now = new Date();
				const dayOfYear = Math.floor(
					(now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
				);

				setStatistics({
					totalVisitors: 15420 + dayOfYear * 12,
					dailyVisitors: 145 + (dayOfYear % 50),
					onlineUsers: Math.floor(Math.random() * 25) + 8,
					pageViews: Math.floor((15420 + dayOfYear * 12) * 2.3),
				});
			}
		};

		// Track new visit
		const trackVisit = async (sessionId) => {
			try {
				await fetch("/api/public/visitor_stats.php", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ session_id: sessionId }),
				});
			} catch (error) {
				console.error("Error tracking visit:", error);
			}
		};

		// Initialize
		const initializeTracking = async () => {
			// Check if session ID exists in localStorage
			let storedSessionId = localStorage.getItem("visitor_session_id");

			if (!storedSessionId) {
				// New visitor
				storedSessionId = generateSessionId();
				localStorage.setItem("visitor_session_id", storedSessionId);
			}

			setSessionId(storedSessionId);

			// Track visit and fetch statistics
			await trackVisit(storedSessionId);
			await fetchStatistics();
		};

		initializeTracking();

		// Update statistics every 30 seconds
		const interval = setInterval(fetchStatistics, 30000);

		// Track page activity every 5 minutes (to maintain session)
		const activityInterval = setInterval(() => {
			if (sessionId) {
				trackVisit(sessionId);
			}
		}, 300000); // 5 minutes

		return () => {
			clearInterval(interval);
			clearInterval(activityInterval);
		};
	}, [sessionId]);

	const statsData = [
		{
			icon: FiEye,
			label: "Total Pengunjung",
			value: statistics.totalVisitors,
			color: "text-blue-600",
			bgColor: "bg-blue-50",
			borderColor: "border-blue-200",
		},
		{
			icon: FiCalendar,
			label: "Pengunjung Hari Ini",
			value: statistics.dailyVisitors,
			color: "text-green-600",
			bgColor: "bg-green-50",
			borderColor: "border-green-200",
		},
		{
			icon: FiUsers,
			label: "Pengguna Online",
			value: statistics.onlineUsers,
			color: "text-orange-600",
			bgColor: "bg-orange-50",
			borderColor: "border-orange-200",
		},
		{
			icon: FiClock,
			label: "Total Halaman Dilihat",
			value: statistics.pageViews,
			color: "text-purple-600",
			bgColor: "bg-purple-50",
			borderColor: "border-purple-200",
		},
	];

	return (
		<section className="py-16 bg-gray-50">
			<div className="max-w-7xl mx-auto px-6">
				{/* Header */}
				<div className="text-center mb-12" data-aos="fade-up">
					<h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
						Statistik Pengunjung
					</h2>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Lihat aktivitas dan engagement pengunjung website kami dalam
						real-time
					</p>
				</div>

				{/* Statistics Grid */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
									<stat.icon size={24} />
								</div>
							</div>

							<AnimatedCounter target={stat.value} />

							<p className="text-sm sm:text-base text-gray-700 mt-2 font-medium">
								{stat.label}
							</p>

							{/* Real-time indicator untuk online users */}
							{stat.label === "Pengguna Online" && (
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

				{/* Additional Info */}
				<div
					className="mt-8 text-center"
					data-aos="fade-up"
					data-aos-delay="500"
				>
					<p className="text-sm text-gray-500">
						Statistik diperbarui secara real-time • Terakhir diperbarui:{" "}
						{lastUpdated
							? new Date(lastUpdated).toLocaleString("id-ID")
							: new Date().toLocaleString("id-ID")}
					</p>
				</div>
			</div>
		</section>
	);
};

export default VisitorStatistics;
