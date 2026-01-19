import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AttendanceHistory = ({ memberId }) => {
	const [history, setHistory] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(true);

	const fetchHistory = useCallback(
		async (currentPage) => {
			setLoading(true);
			try {
				const response = await api.get(
					`/api/members/attendance-history/${memberId}`,
					{
						params: { page: currentPage },
					}
				);
				const data = response.data;
				// Jika halaman pertama, ganti. Jika tidak, tambahkan.
				setHistory((prev) =>
					currentPage === 1 ? data.history : [...prev, ...data.history]
				);
				setHasMore(currentPage < data.total_pages);
			} catch (error) {
				console.error("Gagal memuat riwayat absensi", error);
			} finally {
				setLoading(false);
			}
		},
		[memberId]
	);

	useEffect(() => {
		fetchHistory(1); // Muat halaman pertama saat komponen pertama kali dirender
	}, [fetchHistory]);

	const loadMore = () => {
		const nextPage = page + 1;
		setPage(nextPage);
		fetchHistory(nextPage);
	};

	const StatusBadge = ({ status }) => {
		const styles = {
			hadir: { text: "Hadir", color: "bg-green-100 text-green-800" },
			sakit: { text: "Sakit", color: "bg-yellow-100 text-yellow-800" },
			izin: { text: "Izin", color: "bg-blue-100 text-blue-800" },
			alpa: { text: "Alpa", color: "bg-red-100 text-red-800" },
		};
		const current = styles[status] || { text: "N/A", color: "bg-gray-100" };
		return (
			<span
				className={`text-xs px-2 py-1 rounded-full font-semibold ${current.color}`}
			>
				{current.text}
			</span>
		);
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h2 className="text-xl font-bold text-primary mb-4">Riwayat Absensi</h2>
			<div className="space-y-3">
				{loading && history.length === 0 ? (
					<p>Memuat riwayat...</p>
				) : history.length > 0 ? (
					history.map((item, index) => {
						const dateStr = item.attendance_date 
							? new Date(item.attendance_date + "T00:00:00").toLocaleDateString("id-ID", {
									weekday: "long",
									day: "numeric",
									month: "long",
									year: "numeric",
								})
							: "Tanggal tidak tersedia";
						
						return (
							<div
								key={index}
								className="flex justify-between items-center p-3 bg-gray-50 rounded"
							>
								<div>
									<p className="font-semibold">{dateStr}</p>
									<p className="text-sm text-gray-500">
										{item.age_group || "N/A"} ({item.start_time ? item.start_time.slice(0, 5) : "-"})
									</p>
								</div>
								<StatusBadge status={item.status} />
							</div>
						);
					})
				) : (
					<p className="text-sm text-gray-500 text-center py-4">
						Belum ada riwayat absensi.
					</p>
				)}
			</div>
			{hasMore && !loading && (
				<div className="mt-4 text-center">
					<button
						onClick={loadMore}
						className="text-sm font-semibold text-secondary hover:underline"
					>
						Tampilkan lebih banyak...
					</button>
				</div>
			)}
			{loading && history.length > 0 && (
				<p className="text-center mt-4 text-sm text-gray-500">Memuat...</p>
			)}
		</div>
	);
};

export default AttendanceHistory;
