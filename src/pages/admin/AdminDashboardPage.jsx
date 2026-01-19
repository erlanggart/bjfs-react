// File: src/pages/admin/DashboardPage.jsx
import React, { useState } from "react";
import NewMembersChartWidget from "../../components/dashboard/NewMembersChartWidget";
import PaymentAnalyticsWidget from "../../components/dashboard/PaymentAnalyticsWidget";
import MemberActivityWidget from "../../components/dashboard/MemberActivityWidget";
import MemberGrowthChartWidget from "../../components/dashboard/MemberGrowthChartWidget";
import ReportAnalyticsWidget from "../../components/dashboard/RepoertAnalyticsWidget";
import { FiUserPlus, FiTrendingUp } from "react-icons/fi";

const DashboardPage = () => {
	// State baru untuk mengontrol grafik mana yang aktif
	const [activeChart, setActiveChart] = useState("newMembers"); // 'newMembers' atau 'growth'

	return (
		<div className="p-4 lg:p-6">
			{/* Header dengan gradient background */}
			<div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-6 lg:p-8 mb-6 rounded-2xl shadow-xl">
				<div className="absolute inset-0 opacity-10" style={{
					backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
					backgroundSize: '20px 20px'
				}}></div>
				<div className="relative">
					<h1 className="text-3xl lg:text-4xl font-bold text-center text-white mb-2">
						Dashboard Admin
					</h1>
					<p className="text-center text-blue-100 text-sm lg:text-base">
						Ringkasan statistik dan analitik platform Bogor Junior Football School
					</p>
				</div>
			</div>

			<div className="space-y-6">
				{/* --- Blok Grafik Dinamis dengan Design Baru --- */}
				<div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden">
					{/* Header dengan Toggle Buttons */}
					<div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 p-4 lg:p-6">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<div>
								<h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-1">
									Grafik Member
								</h2>
								<p className="text-sm text-gray-500">
									Lihat perkembangan member dalam 12 bulan terakhir
								</p>
							</div>
							
							{/* Toggle Buttons dengan Design Modern */}
							<div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl shadow-inner">
								<button
									onClick={() => setActiveChart("newMembers")}
									className={`flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg font-semibold text-sm lg:text-base transition-all duration-300 ${
										activeChart === "newMembers"
											? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105"
											: "text-gray-600 hover:text-gray-800 hover:bg-white/50"
									}`}
								>
									<FiUserPlus className={`text-lg ${activeChart === "newMembers" ? "animate-pulse" : ""}`} />
									<span className="hidden sm:inline">New Member</span>
									<span className="sm:hidden">New</span>
								</button>
								<button
									onClick={() => setActiveChart("growth")}
									className={`flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg font-semibold text-sm lg:text-base transition-all duration-300 ${
										activeChart === "growth"
											? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg transform scale-105"
											: "text-gray-600 hover:text-gray-800 hover:bg-white/50"
									}`}
								>
									<FiTrendingUp className={`text-lg ${activeChart === "growth" ? "animate-pulse" : ""}`} />
									<span className="hidden sm:inline">Pertumbuhan</span>
									<span className="sm:hidden">Growth</span>
								</button>
							</div>
						</div>
					</div>

					{/* Render Grafik dengan Transition */}
					<div className="p-4 lg:p-6 bg-white">
						<div className="transition-all duration-500 ease-in-out">
							{activeChart === "newMembers" ? (
								<NewMembersChartWidget />
							) : (
								<MemberGrowthChartWidget />
							)}
						</div>
					</div>
				</div>

				<MemberActivityWidget />

				{/* Widget Lainnya */}
				<PaymentAnalyticsWidget />

				<ReportAnalyticsWidget />
			</div>
		</div>
	);
};

export default DashboardPage;
