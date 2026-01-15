import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiAward, FiPhone, FiMapPin } from "react-icons/fi";

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL ||
	"http://localhost/bogorjunior/bogor_junior_api";

const CoachProfilesSection = () => {
	const [coaches, setCoaches] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCoaches = async () => {
			try {
				const response = await axios.get(
					`/api/public/branch_admin_profiles.php`
				);
				setCoaches(response.data);
			} catch (error) {
				console.error("Error fetching coaches:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCoaches();
	}, []);

	if (loading) {
		return (
			<section className="py-16 bg-gray-50">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center text-primary mb-12">
						Para Pelatih Kami
					</h2>
					<p className="text-center text-gray-500">Memuat data pelatih...</p>
				</div>
			</section>
		);
	}

	return (
		<section className="py-16 bg-gray-50">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold text-center text-primary mb-4">
					Para Pelatih Kami
				</h2>
				<p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
					Tim pelatih berpengalaman dan tersertifikasi yang siap membimbing
					perjalanan sepak bola Anda
				</p>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
					{coaches.map((coach) => (
						<div
							key={coach.id}
							className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
						>
							{/* Avatar */}
							<div className="relative h-32 bg-gradient-to-br from-primary to-secondary">
								{coach.avatar ? (
									<img
										src={coach.avatar}
										alt={coach.full_name}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
											<span className="text-white text-lg font-bold">
												{coach.full_name.charAt(0)}
											</span>
										</div>
									</div>
								)}
							</div>

							{/* Content */}
							<div className="p-3">
								<h3 className="text-sm font-bold text-gray-800 mb-2 leading-tight">
									{coach.full_name}
								</h3>

								{/* Branch Info */}
								{coach.branch_name && (
									<div className="flex items-center text-gray-600 mb-2">
										<FiMapPin
											className="mr-1 text-secondary flex-shrink-0"
											size={12}
										/>
										<span className="text-xs">Cabang {coach.branch_name}</span>
									</div>
								)}

								{/* Address */}
								{coach.address && (
									<div className="flex items-start text-gray-600 mb-2">
										<FiMapPin
											className="mr-1 text-secondary flex-shrink-0 mt-0.5"
											size={12}
										/>
										<span className="text-xs leading-tight line-clamp-2">
											{coach.address}
										</span>
									</div>
								)}

								{/* Contact */}
								{coach.phone_number && (
									<div className="flex items-center text-gray-600 mb-2">
										<FiPhone
											className="mr-1 text-secondary flex-shrink-0"
											size={12}
										/>
										<span className="text-xs">{coach.phone_number}</span>
									</div>
								)}

								{/* Competencies */}
								{coach.competencies && coach.competencies.length > 0 && (
									<div>
										<h4 className="flex items-center text-primary font-semibold mb-1 text-xs">
											<FiAward className="mr-1" size={12} />
											Sertifikasi
										</h4>
										<div className="space-y-1">
											{coach.competencies
												.slice(0, 2)
												.map((competency, index) => (
													<div
														key={index}
														className="bg-green-50 rounded p-1.5 border border-green-200"
													>
														<p className="font-medium text-green-800 text-xs leading-tight">
															{competency.competency_name}
														</p>
														{competency.issuer && (
															<p className="text-xs text-gray-500 mt-0.5 truncate">
																{competency.issuer}
															</p>
														)}
													</div>
												))}
											{coach.competencies.length > 2 && (
												<p className="text-xs text-gray-400 text-center mt-1">
													+{coach.competencies.length - 2} lainnya
												</p>
											)}
										</div>
									</div>
								)}

								{(!coach.competencies || coach.competencies.length === 0) && (
									<div className="text-center py-1">
										<p className="text-gray-400 text-xs italic">
											Belum ada sertifikasi
										</p>
									</div>
								)}
							</div>
						</div>
					))}
				</div>

				{coaches.length === 0 && (
					<div className="text-center py-12">
						<p className="text-gray-500 text-lg">
							Belum ada data pelatih yang tersedia.
						</p>
					</div>
				)}
			</div>
		</section>
	);
};

export default CoachProfilesSection;
