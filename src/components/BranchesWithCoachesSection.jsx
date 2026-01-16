import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiAward, FiPhone, FiMapPin, FiUsers, FiUser } from "react-icons/fi";
import { FaXmark } from "react-icons/fa6";

const BranchesWithCoachesSection = () => {
	const [branchesData, setBranchesData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedCoach, setSelectedCoach] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Ambil data branches dan coaches secara paralel
				const [branchesResponse, coachesResponse] = await Promise.all([
					axios.get("/api/public/branches"),
					axios.get("/api/public/branch_admin_profiles"),
				]);

				const branches = branchesResponse.data;
				const coaches = coachesResponse.data;

				// Grup coaches berdasarkan branch_name
				const coachesByBranch = coaches.reduce((acc, coach) => {
					const branchName = coach.branch_name;
					if (!acc[branchName]) {
						acc[branchName] = [];
					}
					acc[branchName].push(coach);
					return acc;
				}, {});

				// Gabungkan data branches dengan coaches
				const branchesWithCoaches = branches.map((branch) => ({
					...branch,
					coaches: coachesByBranch[branch.name] || [],
				}));

				setBranchesData(branchesWithCoaches);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const openCoachModal = (coach) => {
		setSelectedCoach(coach);
		setIsModalOpen(true);
	};

	const closeCoachModal = () => {
		setSelectedCoach(null);
		setIsModalOpen(false);
	};

	if (loading) {
		return (
			<section className="py-20 bg-gray-50">
				<div className="container mx-auto px-6 text-center">
					<p className="text-gray-500">Memuat data cabang dan pelatih...</p>
				</div>
			</section>
		);
	}

	return (
		<>
			{/* Coach Modal */}
			{isModalOpen && selectedCoach && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
					onClick={closeCoachModal}
				>
					<div
						className="bg-white rounded-3xl w-full max-w-lg max-h-[95vh] overflow-y-auto shadow-2xl"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Close Button */}
						<div className="sticky top-0 z-30 flex justify-end p-4">
							<button
								onClick={closeCoachModal}
								className="text-white hover:text-gray-200 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full transition-all backdrop-blur-sm"
							>
								<FaXmark size={20} />
							</button>
						</div>

						{/* Modal Header dengan Gambar */}
						<div className="relative -mt-16">
							<div
								className="relative w-full aspect-square bg-gradient-to-br from-[var(--color-primary)] to-blue-700 rounded-t-3xl"
								style={{
									backgroundImage: selectedCoach.avatar
										? `url(${selectedCoach.avatar})`
										: "none",
									backgroundSize: "cover",
									backgroundPosition: "center",
								}}
							>
								{/* Gradient Overlay */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-t-3xl"></div>

								{/* Default avatar */}
								{!selectedCoach.avatar && (
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
											<FiUser className="text-white" size={64} />
										</div>
									</div>
								)}

								{/* Coach Info Overlay */}
								<div className="absolute bottom-0 left-0 right-0 text-white p-6 bg-gradient-to-t from-black/90 to-transparent">
									<div className="mb-2">
										<span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
											{selectedCoach.branch_name}
										</span>
									</div>
									<h3 className="text-2xl font-bold mb-3">
										{selectedCoach.full_name}
									</h3>
									{selectedCoach.phone_number && (
										<div className="flex items-center text-white/90">
											<div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3">
												<FiPhone size={14} />
											</div>
											<span className="text-sm font-medium">
												{selectedCoach.phone_number}
											</span>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Modal Body */}
						<div className="p-6 space-y-6">
							{/* Address Information */}
							{selectedCoach.address && (
								<div>
									<div className="flex items-center gap-3 mb-4">
										<div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center">
											<FiMapPin className="text-[var(--color-primary)]" size={20} />
										</div>
										<h4 className="text-lg font-bold text-gray-900">
											Alamat
										</h4>
									</div>
									<div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border-l-4 border-[var(--color-primary)]">
										<p className="text-sm leading-relaxed text-gray-700">
											{selectedCoach.address}
										</p>
									</div>
								</div>
							)}

							{/* Competencies */}
							{selectedCoach.competencies &&
								selectedCoach.competencies.length > 0 && (
									<div>
										<div className="flex items-center gap-3 mb-4">
											<div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center">
												<FiAward className="text-[var(--color-primary)]" size={20} />
											</div>
											<h4 className="text-lg font-bold text-gray-900">
												Kompetensi & Sertifikasi
											</h4>
										</div>
										<div className="space-y-3">
											{selectedCoach.competencies.map((competency, index) => (
												<div
													key={index}
													className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border-l-4 border-[var(--color-primary)] hover:shadow-md transition-shadow"
												>
													<div className="font-bold text-gray-900 mb-2 text-base">
														{competency.competency_name}
													</div>
													{competency.issuer && (
														<div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
															<span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full"></span>
															{competency.issuer}
														</div>
													)}
													<div className="flex flex-wrap gap-3 text-xs text-gray-500">
														{competency.date_obtained && (
															<div className="flex items-center gap-1">
																<span className="font-semibold">Diperoleh:</span>
																{new Date(
																	competency.date_obtained
																).toLocaleDateString("id-ID", {
																	year: "numeric",
																	month: "long",
																	day: "numeric",
																})}
															</div>
														)}
														{competency.expiry_date && (
															<div className="flex items-center gap-1">
																<span className="font-semibold">Berlaku hingga:</span>
																{new Date(
																	competency.expiry_date
																).toLocaleDateString("id-ID", {
																	year: "numeric",
																	month: "long",
																	day: "numeric",
																})}
															</div>
														)}
													</div>
												</div>
											))}
										</div>
									</div>
								)}
						</div>
					</div>
				</div>
			)}

			<section className="bg-gradient-to-b from-gray-50 to-white">
				<div className="max-w-7xl mx-auto px-6">
					{/* Header */}
					<div className="text-center mb-16">
						<div className="inline-block mb-4">
							<span className="px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm font-semibold" data-aos="fade-up">
								BJFS BRANCH NETWORK
							</span>
						</div>
						<h2
							className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6"
							data-aos="fade-up"
							data-aos-delay="100"
						>
							Cabang & Tim Pelatih Kami
						</h2>
						<p
							className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed"
							data-aos="fade-up"
							data-aos-delay="200"
						>
							Temui tim pelatih profesional berpengalaman dan bersertifikat yang siap membimbing setiap pemain di seluruh cabang kami
						</p>
					</div>

					{/* Branches with Coaches */}
					<div className="space-y-16">
						{branchesData.map((branch, branchIndex) => (
							<div
								key={branchIndex}
								className="relative"
								data-aos="fade-up"
								data-aos-delay={100 * branchIndex}
							>
								{/* Branch Header - Modern Design */}
								<div className="relative bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)] to-blue-700 rounded-3xl shadow-2xl overflow-hidden mb-8">
									{/* Decorative Elements */}
									<div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
									<div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
									
									<div className="relative z-10 p-8 md:p-10">
										<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-3">
													<div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
														<FiMapPin className="text-white" size={24} />
													</div>
													<h3 className="text-3xl md:text-4xl font-bold text-white">
														{branch.name}
													</h3>
												</div>
												<p className="text-gray-100 text-lg max-w-2xl pl-15">
													{branch.address || "Alamat segera hadir"}
												</p>
											</div>
											<div className="flex items-center gap-6">
												<div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30">
													<div className="flex items-center gap-3">
														<FiUsers className="text-white" size={28} />
														<div>
															<div className="text-white/80 text-sm font-medium">Total Pelatih</div>
															<div className="text-white text-2xl font-bold">
																{branch.coaches.length}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Coaches Grid - Show All */}
								<div>
									{branch.coaches.length > 0 ? (
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
											{branch.coaches.map((coach) => (
												<div
													key={coach.id}
													className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-2"
													onClick={() => openCoachModal(coach)}
												>
													{/* Coach Photo */}
													<div className="relative w-full aspect-square overflow-hidden">
														<div
															className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-blue-700 transition-transform duration-500 group-hover:scale-110"
															style={{
																backgroundImage: coach.avatar
																	? `url(${coach.avatar})`
																	: "none",
																backgroundSize: "cover",
																backgroundPosition: "center",
															}}
														>
															{/* Overlay gradient */}
															<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

															{/* Default avatar */}
															{!coach.avatar && (
																<div className="absolute inset-0 flex items-center justify-center">
																	<div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
																		<FiUser className="text-white" size={48} />
																	</div>
																</div>
															)}

															{/* Coach Name Overlay */}
															<div className="absolute bottom-0 left-0 right-0 p-5">
																<h4 className="text-white text-xl font-bold mb-2">
																	{coach.full_name}
																</h4>
																{coach.phone_number && (
																	<div className="flex items-center text-white/90 text-sm">
																		<FiPhone className="mr-2" size={14} />
																		<span>{coach.phone_number}</span>
																	</div>
																)}
															</div>
														</div>
													</div>

													{/* Coach Info */}
													<div className="p-5">
														{/* Address */}
														{coach.address && (
															<div className="mb-4">
																<div className="flex items-start gap-2 text-gray-600">
																	<FiMapPin className="flex-shrink-0 mt-1 text-[var(--color-primary)]" size={16} />
																	<div>
																		<p className="text-xs font-semibold text-gray-800 mb-1 uppercase tracking-wide">
																			Alamat
																		</p>
																		<p className="text-sm leading-relaxed text-gray-600">
																			{coach.address}
																		</p>
																	</div>
																</div>
															</div>
														)}

														{/* Competencies */}
														{coach.competencies && coach.competencies.length > 0 && (
															<div>
																<div className="flex items-center gap-2 text-[var(--color-primary)] mb-3">
																	<FiAward size={16} />
																	<span className="text-xs font-semibold uppercase tracking-wide">
																		Kompetensi & Sertifikasi
																	</span>
																</div>
																<div className="space-y-2">
																	{coach.competencies.slice(0, 2).map((competency, index) => (
																		<div
																			key={index}
																			className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg border-l-3 border-[var(--color-primary)]"
																		>
																			<div className="font-semibold text-gray-900 text-sm mb-1">
																				{competency.competency_name}
																			</div>
																			{competency.issuer && (
																				<div className="text-gray-600 text-xs mb-1">
																					{competency.issuer}
																				</div>
																			)}
																			{competency.date_obtained && (
																				<div className="text-gray-500 text-xs">
																					{new Date(competency.date_obtained).toLocaleDateString("id-ID", {
																						year: "numeric",
																						month: "short",
																					})}
																				</div>
																			)}
																		</div>
																	))}
																	{coach.competencies.length > 2 && (
																		<div className="text-center">
																			<span className="inline-block px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold rounded-full">
																				+{coach.competencies.length - 2} Sertifikasi Lainnya
																			</span>
																		</div>
																	)}
																</div>
															</div>
														)}

														{/* View Details Button */}
														<div className="mt-4 pt-4 border-t border-gray-100">
															<div className="flex items-center justify-center text-[var(--color-primary)] text-sm font-semibold group-hover:text-blue-700 transition-colors">
																<span>Lihat Detail Lengkap</span>
																<svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
																</svg>
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="text-center py-16 bg-gray-50 rounded-2xl">
											<div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
												<FiUsers className="text-gray-400" size={32} />
											</div>
											<p className="text-gray-500 text-lg font-medium">
												Informasi pelatih untuk cabang ini akan segera diperbarui
											</p>
										</div>
									)}
								</div>
							</div>
						))}
					</div>

					{branchesData.length === 0 && (
						<div className="text-center py-20 bg-gray-50 rounded-3xl">
							<div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
								<FiMapPin className="text-gray-400" size={40} />
							</div>
							<h3 className="text-2xl font-bold text-gray-800 mb-2">Belum Ada Cabang</h3>
							<p className="text-gray-500 text-lg">
								Data cabang akan segera tersedia.
							</p>
						</div>
					)}
				</div>
			</section>
		</>
	);
};

export default BranchesWithCoachesSection;
