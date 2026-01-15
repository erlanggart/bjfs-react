// File: src/components/dashboard/PaymentAnalyticsWidget.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
	FiTrendingUp,
	FiClock,
	FiChevronDown,
	FiCheckCircle,
	FiAlertTriangle,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import ChartLoader from "./ChartLoader";

// Komponen untuk statistik progress bar
const PaymentStats = ({ stats }) => {
	if (!Array.isArray(stats) || stats.length === 0) {
		return (
			<p className="text-sm text-gray-500">
				Tidak ada data statistik pembayaran untuk ditampilkan.
			</p>
		);
	}
	const totalActive = stats.reduce(
		(sum, branch) => sum + parseInt(branch.total_active_members),
		0
	);
	const totalPaid = stats.reduce(
		(sum, branch) => sum + parseInt(branch.paid_members),
		0
	);
	const overallPercentage =
		totalActive > 0 ? ((totalPaid / totalActive) * 100).toFixed(1) : 0;

	return (
		<div className="space-y-4">
			{stats.map((branch) => {
				const percentage =
					branch.total_active_members > 0
						? (
								(branch.paid_members / branch.total_active_members) *
								100
						  ).toFixed(1)
						: 0;
				return (
					<div key={branch.branch_name}>
						<div className="flex justify-between text-sm mb-1">
							<span className="font-semibold text-gray-700">
								{branch.branch_name}
							</span>
							<span className="text-gray-500">
								{branch.paid_members} / {branch.total_active_members} Member
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-4">
							<div
								className="bg-green-500 h-4 rounded-full text-center text-white text-xs font-bold"
								style={{ width: `${percentage}%` }}
							>
								{percentage > 10 && `${percentage}%`}
							</div>
						</div>
					</div>
				);
			})}
			<div className="border-t pt-4 mt-4">
				<div className="flex justify-between text-md font-bold mb-1">
					<span className="text-gray-800">Total Keseluruhan</span>
					<span className="text-gray-600">
						{totalPaid} / {totalActive} Member
					</span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-5">
					<div
						className="bg-primary h-5 rounded-full text-center text-white font-bold"
						style={{ width: `${overallPercentage}%` }}
					>
						{overallPercentage}%
					</div>
				</div>
			</div>
		</div>
	);
};

const PendingPaymentsList = ({ payments }) => {
	const [openBranch, setOpenBranch] = useState(null); // <-- Hook #1

	// PERBAIKAN: Pindahkan pemanggilan useMemo ke atas, sebelum kondisi if.
	const groupedByBranch = useMemo(() => {
		if (!Array.isArray(payments)) return {}; // Tambahkan pengecekan di dalam untuk keamanan
		return payments.reduce((acc, payment) => {
			const branch = payment.branch_name || "Tanpa Cabang";
			if (!acc[branch]) {
				acc[branch] = [];
			}
			acc[branch].push(payment);
			return acc;
		}, {});
	}, [payments]); // <-- Hook #2

	// PERBAIKAN: Kondisi if sekarang berada setelah semua hook dipanggil.
	if (!Array.isArray(payments) || payments.length === 0) {
		return (
			<p className="text-sm text-gray-500 mt-4">
				Tidak ada pembayaran yang menunggu persetujuan.
			</p>
		);
	}

	const toggleBranch = (branchName) => {
		setOpenBranch((prev) => (prev === branchName ? null : branchName));
	};

	return (
		<div className="space-y-2 max-h-screen overflow-y-auto pr-2">
			{Object.entries(groupedByBranch).map(([branchName, branchPayments]) => (
				<div key={branchName} className=" rounded-lg">
					<button
						onClick={() => toggleBranch(branchName)}
						className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100"
					>
						<span className="font-bold text-gray-700">{branchName}</span>
						<div className="flex items-center gap-2">
							<span className="text-sm font-semibold bg-primary text-white px-2 py-0.5 rounded-full">
								{branchPayments.length}
							</span>
							<FiChevronDown
								className={`transition-transform ${
									openBranch === branchName ? "rotate-180" : ""
								}`}
							/>
						</div>
					</button>
					{openBranch === branchName && (
						<div className="p-3 border-t">
							<ul className="space-y-3">
								{branchPayments.map((p) => (
									<li key={p.id}>
										<Link
											to={`/member/${p.member_id}`}
											className="flex items-center gap-3 hover:bg-gray-100 p-1 rounded-md"
										>
											<img
												src={
													p.member_avatar ||
													`https://placehold.co/40x40/E0E0E0/757575?text=${p.member_name.charAt(
														0
													)}`
												}
												alt={p.member_name}
												className="w-10 h-10 rounded-full object-cover"
											/>
											<div>
												<p className="text-sm font-semibold text-gray-800">
													{p.member_name}
												</p>
												<p className="text-xs text-gray-500">
													{new Date(p.uploaded_at).toLocaleDateString("id-ID", {
														day: "numeric",
														month: "short",
													})}
												</p>
											</div>
										</Link>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

// Komponen untuk menampilkan daftar member
const MemberListColumn = ({ title, members, icon, textColor }) => {
	const [openBranch, setOpenBranch] = useState(null); // State untuk accordion

	// Mengelompokkan member berdasarkan cabang
	const groupedByBranch = useMemo(() => {
		if (!Array.isArray(members)) return {};
		return members.reduce((acc, member) => {
			const branch = member.branch_name || "Tanpa Cabang";
			if (!acc[branch]) acc[branch] = [];
			acc[branch].push(member);
			return acc;
		}, {});
	}, [members]);

	const toggleBranch = (branchName) => {
		setOpenBranch((prev) => (prev === branchName ? null : branchName));
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow-md">
			<h3
				className={`text-lg font-bold mb-3 flex items-center gap-2 ${textColor}`}
			>
				{icon} {title} ({members.length})
			</h3>
			<div className="space-y-2 max-h-72 overflow-y-auto pr-2">
				{members.length > 0 ? (
					Object.entries(groupedByBranch).map(([branchName, branchMembers]) => (
						<div key={branchName} className="bg-slate-100 rounded-lg">
							<button
								onClick={() => toggleBranch(branchName)}
								className="w-full flex justify-between items-center p-3  hover:bg-slate-200 rounded-lg"
							>
								<span className="font-bold text-gray-700">{branchName}</span>
								<div className="flex items-center gap-2">
									<span className="text-sm font-semibold bg-primary text-white px-2 py-0.5 rounded-full">
										{branchMembers.length}
									</span>
									<FiChevronDown
										className={`transition-transform ${
											openBranch === branchName ? "rotate-180" : ""
										}`}
									/>
								</div>
							</button>
							{openBranch === branchName && (
								<div className="p-3 border-t">
									<ul className="space-y-3">
										{branchMembers.map((member) => (
											<li key={member.id}>
												<Link
													to={`/member/${member.id}`}
													className="flex items-center gap-3 hover:bg-gray-100 p-1 rounded-md"
												>
													<img
														src={
															member.avatar ||
															`https://placehold.co/40x40/E0E0E0/757575?text=${member.full_name.charAt(
																0
															)}`
														}
														alt={member.full_name}
														className="w-10 h-10 rounded-full object-cover"
													/>
													<div>
														<p className="text-sm font-semibold text-gray-800">
															{member.full_name}
														</p>
														<p className="text-xs text-gray-500">{member.id}</p>
													</div>
												</Link>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					))
				) : (
					<p className="text-sm text-gray-400 text-center py-4">
						Tidak ada data.
					</p>
				)}
			</div>
		</div>
	);
};

const PaymentAnalyticsWidget = () => {
	const currentYear = new Date().getFullYear();
	const [stats, setStats] = useState([]);
	const [paidList, setPaidList] = useState([]);
	const [unpaidList, setUnpaidList] = useState([]);
	const [pendingPayments, setPendingPayments] = useState([]);
	const [month, setMonth] = useState(new Date().getMonth() + 1);
	const [year, setYear] = useState(currentYear);
	const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
	const [loading, setLoading] = useState(true);
	const months = [
		{ value: 1, name: "Januari" },
		{ value: 2, name: "Februari" },
		{ value: 3, name: "Maret" },
		{ value: 4, name: "April" },
		{ value: 5, name: "Mei" },
		{ value: 6, name: "Juni" },
		{ value: 7, name: "Juli" },
		{ value: 8, name: "Agustus" },
		{ value: 9, name: "September" },
		{ value: 10, name: "Oktober" },
		{ value: 11, name: "November" },
		{ value: 12, name: "Desember" },
	];

	const selectedMonthName = months.find((m) => m.value == month)?.name;

	const fetchData = useCallback(() => {
		axios
			.get("/api/admin/dashboard_payment_data.php", { params: { month, year } })
			.then((res) => {
				setStats(res.data.payment_stats || []);
				setPendingPayments(res.data.pending_payments || []);
				setPaidList(res.data.paid_members_list || []);
				setUnpaidList(res.data.unpaid_members_list || []);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Gagal memuat data pembayaran", err);
				setStats([]);
				setPendingPayments([]);
				setPaidList([]);
				setUnpaidList([]);
				setLoading(false);
			});
	}, [month, year]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<div className="">
			<div className="grid grid-cols-1 lg:grid-cols-8 gap-x-8 gap-y-6">
				{/* Kolom Kiri: Analitik Pembayaran */}
				<div className="col-span-1 lg:col-span-5">
					<div className="bg-white p-6 rounded-lg shadow-md  flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
						<h2 className="text-xl font-bold text-primary flex items-center gap-2">
							<FiTrendingUp /> Analitik Pembayaran
						</h2>
						<div className="flex gap-2 w-full sm:w-xs">
							<div className="w-full bg-slate-100 p-2 rounded-md">
								<select
									value={month}
									onChange={(e) => setMonth(e.target.value)}
									className="w-full"
								>
									{months.map((m) => (
										<option key={m.value} value={m.value}>
											{m.name}
										</option>
									))}
								</select>
							</div>
							<div className="w-full bg-slate-100 p-2 rounded-md">
								<select
									value={year}
									onChange={(e) => setYear(e.target.value)}
									className="w-full "
								>
									{years.map((y) => (
										<option key={y} value={y}>
											{y}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>

					{loading ? (
						<ChartLoader />
					) : (
						<>
							{/* Progress Bar (Statistik) */}
							<div className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-6">
								<PaymentStats stats={stats} />
							</div>

							{/* Daftar Member */}
							<div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
								<MemberListColumn
									title="Sudah Membayar"
									members={paidList}
									icon={<FiCheckCircle />}
									textColor="text-green-600"
								/>
								<MemberListColumn
									title="Belum Membayar"
									members={unpaidList}
									icon={<FiAlertTriangle />}
									textColor="text-yellow-600"
								/>
							</div>
						</>
					)}
				</div>

				{/* Kolom Kanan: Daftar Pembayaran Pending */}
				<div className="bg-white p-6 rounded-lg shadow-md col-span-3">
					<h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
						<FiClock /> Menunggu Persetujuan Pembayaran
						<span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
							{pendingPayments.length}
						</span>
					</h3>
					<PendingPaymentsList payments={pendingPayments} />
				</div>
			</div>
		</div>
	);
};
export default PaymentAnalyticsWidget;
