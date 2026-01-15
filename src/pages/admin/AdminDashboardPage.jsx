// File: src/pages/admin/DashboardPage.jsx
import React, { useState } from "react";
import NewMembersChartWidget from "../../components/dashboard/NewMembersChartWidget";
import PaymentAnalyticsWidget from "../../components/dashboard/PaymentAnalyticsWidget";
import MemberActivityWidget from "../../components/dashboard/MemberActivityWidget";
import MemberGrowthChartWidget from "../../components/dashboard/MemberGrowthChartWidget";
import ReportAnalyticsWidget from "../../components/dashboard/RepoertAnalyticsWidget";

const DashboardPage = () => {
	// State baru untuk mengontrol grafik mana yang aktif
	const [activeChart, setActiveChart] = useState("newMembers"); // 'newMembers' atau 'growth'

	return (
		<div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
			<h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Admin</h1>
			<div className="space-y-6">
				{/* --- Blok Grafik Dinamis BARU --- */}
				<div className="">
					{/* Tombol Toggle */}
					<div className="bg-white flex items-center justify-between mb-6 rounded-lg shadow-md">
						<h1 className="text-lg font-semibold p-6 text-gray-700">
							Grafik Member
						</h1>
						<div className="flex justify-end space-x-4">
							<button
								onClick={() => setActiveChart("newMembers")}
								className={`px-4 py-2 text-sm font-semibold transition-colors ${
									activeChart === "newMembers"
										? "border-b-2 border-secondary text-secondary"
										: "text-gray-500 hover:text-gray-700"
								}`}
							>
								New Member
							</button>
							<button
								onClick={() => setActiveChart("growth")}
								className={`px-4 py-2 text-sm font-semibold transition-colors ${
									activeChart === "growth"
										? "border-b-2 border-secondary text-secondary"
										: "text-gray-500 hover:text-gray-700"
								}`}
							>
								Total Pertumbuhan Member
							</button>
						</div>
					</div>

					{/* Render Grafik secara Kondisional */}
					<div>
						{activeChart === "newMembers" ? (
							<NewMembersChartWidget />
						) : (
							<MemberGrowthChartWidget />
						)}
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
