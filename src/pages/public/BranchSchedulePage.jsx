// File: src/pages/public/BranchSchedulePage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiClock, FiUsers, FiCalendar } from "react-icons/fi";
import axios from "axios";
import Header from "../../layouts/Header";
import { Footer } from "../../layouts/Footer";

const BranchSchedulePage = () => {
	const [branches, setBranches] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		window.scrollTo(0, 0);
		fetchBranchesWithSchedules();
	}, []);

	const fetchBranchesWithSchedules = async () => {
		try {
			setLoading(true);
			// Fetch branches and schedules
			const [branchesRes, schedulesRes] = await Promise.all([
				axios.get("/api/public/list_branches.php"),
				axios.get("/api/public/list_schedules.php"),
			]);

			const branchesData = branchesRes.data;
			const schedulesData = schedulesRes.data;

			// Group schedules by branch name
			const schedulesByBranch = schedulesData.reduce((acc, schedule) => {
				const branchName = schedule.branch_name;
				if (!acc[branchName]) {
					acc[branchName] = [];
				}
				acc[branchName].push(schedule);
				return acc;
			}, {});

			// Combine data - list_branches.php already includes member_count
			const branchesWithData = branchesData.map((branch) => {
				return {
					name: branch.name,
					location: branch.address, // Backend uses 'address', frontend uses 'location'
					schedules: schedulesByBranch[branch.name] || [],
					activeMembers: branch.member_count || 0, // member_count from backend
					totalMembers: branch.member_count || 0,
				};
			});

			setBranches(branchesWithData);
		} catch (err) {
			console.error("Error fetching data:", err);
			setError("Gagal memuat data. Silakan coba lagi.");
		} finally {
			setLoading(false);
		}
	};

	const formatDay = (day) => {
		// Day already in Indonesian from database
		return day;
	};

	const formatTime = (time) => {
		if (!time) return "-";
		return time.substring(0, 5); // Get HH:MM from HH:MM:SS
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<Header />

			{/* Back Button */}
			<div className="container mx-auto px-6 py-6">
				<Link
					to="/"
					className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
				>
					<FiArrowLeft className="text-xl" />
					<span>Kembali ke Home</span>
				</Link>
			</div>

			{/* Hero Section */}
			<section className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-12">
				<div className="container mx-auto px-6">
					<div className="text-center max-w-3xl mx-auto">
						<h1
							className="text-4xl md:text-5xl font-bold mb-4"
							style={{ color: "var(--color-primary)" }}
						>
							Jadwal Latihan Cabang BJFS
						</h1>
						<p className="text-xl text-gray-600">
							Temukan jadwal latihan yang sesuai untuk buah hati Anda
						</p>
					</div>
				</div>
			</section>

			{/* Branches List */}
			<section className="py-12">
				<div className="container mx-auto px-6 max-w-6xl">
					{loading ? (
						<div className="text-center py-20">
							<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
							<p className="mt-4 text-gray-600">Memuat data...</p>
						</div>
					) : error ? (
						<div className="text-center py-20">
							<p className="text-red-500">{error}</p>
						</div>
					) : (
						<div className="space-y-8">
							{branches.map((branch) => (
								<div
									key={branch.name}
									className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4"
									style={{ borderLeftColor: "var(--color-primary)" }}
								>
									{/* Branch Header */}
									<div
										className="p-6"
										style={{
											background:
												"linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.1) 0%, rgba(var(--color-secondary-rgb), 0.05) 100%)",
										}}
									>
										<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
											<div>
												<h2
													className="text-2xl md:text-3xl font-bold mb-2"
													style={{ color: "var(--color-primary)" }}
												>
													{branch.name}
												</h2>
												<div className="flex items-start gap-2 text-gray-600">
													<FiMapPin className="text-lg mt-1 flex-shrink-0" />
													<p className="text-sm">{branch.location}</p>
												</div>
											</div>
											<div className="flex gap-4">
												<div className="bg-white rounded-lg px-4 py-3 shadow-sm text-center">
													<FiUsers
														className="text-2xl mx-auto mb-1"
														style={{ color: "var(--color-primary)" }}
													/>
													<p className="text-2xl font-bold text-gray-800">
														{branch.activeMembers}
													</p>
													<p className="text-xs text-gray-500">Member Aktif</p>
												</div>
												<div className="bg-white rounded-lg px-4 py-3 shadow-sm text-center">
													<FiCalendar
														className="text-2xl mx-auto mb-1"
														style={{ color: "var(--color-secondary)" }}
													/>
													<p className="text-2xl font-bold text-gray-800">
														{branch.schedules.length}
													</p>
													<p className="text-xs text-gray-500">Jadwal</p>
												</div>
											</div>
										</div>
									</div>

									{/* Schedules */}
									<div className="p-6">
										{branch.schedules.length > 0 ? (
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
												{branch.schedules.map((schedule) => (
													<div
														key={schedule.id}
														className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-primary transition-colors"
													>
														<div className="flex items-center gap-2 mb-3">
															<FiCalendar
																className="text-lg"
																style={{ color: "var(--color-primary)" }}
															/>
															<span className="font-bold text-gray-800">
																{formatDay(schedule.day)}
															</span>
														</div>
														<div className="space-y-2 text-sm">
															<div className="flex items-center gap-2 text-gray-600">
																<FiClock className="text-base" />
																<span>
																	{formatTime(schedule.start_time)} -{" "}
																	{formatTime(schedule.end_time)}
																</span>
															</div>
															<div className="flex items-center gap-2 text-gray-600">
																<FiUsers className="text-base" />
																<span>{schedule.age_group || "Semua Usia"}</span>
															</div>
														</div>
													</div>
												))}
											</div>
										) : (
											<p className="text-center text-gray-500 py-4">
												Belum ada jadwal tersedia
											</p>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</section>

			{/* CTA Section */}
			<section className="bg-gradient-to-r from-rose-500 to-[var(--color-secondary)] py-16">
				<div className="container mx-auto px-6 text-center">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						Sudah Menemukan Jadwal yang Cocok?
					</h2>
					<p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
						Daftar trial gratis sekarang dan rasakan pengalaman Futsal Character
						Building bersama BJFS
					</p>
					<a
						href="https://wa.me/6281315261946?text=Halo%20BJFS,%20saya%20ingin%20daftar%20Trial%20Gratis"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:shadow-xl transition-all hover:scale-105"
					>
						Daftar Trial Gratis Sekarang
					</a>
				</div>
			</section>

			{/* Footer */}
			<Footer />
		</div>
	);
};

export default BranchSchedulePage;
