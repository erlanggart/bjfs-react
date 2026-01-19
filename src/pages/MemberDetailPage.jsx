// File: src/pages/MemberDetailPage.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";
import { useReactToPrint } from "react-to-print"; // Impor hook
import { toPng } from "html-to-image";
import {
	FiArrowLeft,
	FiEdit,
	FiMove,
	FiKey,
	FiAlertCircle,
	FiUser,
	FiPrinter,
	FiImage,
	FiThumbsUp,
	FiThumbsDown,
	FiEye,
	FiPlus,
	FiTrash2,
	FiAward,
	FiPower,
} from "react-icons/fi";
import MemberCard from "../components/MemberCard";
import { EvaluationModal } from "../components/EvaluationComponents";
import EditableMemberHeader from "../components/EditableMemberHeader";
import MoveBranchModal from "../components/MoveBranchModal";
import PaymentHistory from "../components/PaymentHistory";
import AttendanceHistory from "../components/AttendanceHistory";
import DocumentLinks from "../components/DocumentLinks";
import { getPaymentStatus } from "../utils/paymentUtils";

const MemberDetailPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [details, setDetails] = useState(null);
	const [achievements, setAchievements] = useState([]);
	const [paymentHistory, setPaymentHistory] = useState([]);
	const [loading, setLoading] = useState(true);

	const [refreshKey, setRefreshKey] = useState(0);

	const contentRef = useRef(null); // Ref untuk komponen kartu
	const paymentHistoryRef = useRef(null); // Ref untuk section payment history
	const reactToPrintFn = useReactToPrint({ contentRef });

	const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
	const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
	const [editingEvaluationId, setEditingEvaluationId] = useState(null);
	const [reportTypeToCreate, setReportTypeToCreate] = useState("");

	const [paymentStatus, setPaymentStatus] = useState({ show: false });
	const [visibleReportsCount, setVisibleReportsCount] = useState(4);

	const fetchDetails = useCallback(async () => {
		try {
			const [detailsRes, historyRes] = await Promise.all([
				api.get(`/api/members/detail/${id}`),
				api.get(`/api/members/payment-history/${id}`),
			]);

			setDetails(detailsRes.data);
			// console.log(detailsRes.data);

			setAchievements(detailsRes.data.achievements || []);
			setPaymentHistory(historyRes.data);
		} catch (error) {
			console.error("Gagal memuat detail member", error);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		if (details?.member_info) {
			setPaymentStatus(
				getPaymentStatus(
					details.member_info.registration_date,
					details.member_info.last_payment_date,
					paymentHistory,
				),
			);
		}
	}, [details, paymentHistory]);

	const triggerRefetch = () => {
		setRefreshKey((prev) => prev + 1);
	};

	const handleScrollToPaymentHistory = () => {
		if (paymentHistoryRef.current) {
			paymentHistoryRef.current.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchDetails();
	}, [id, refreshKey, fetchDetails]);

	const handleResetPassword = (member) => {
		Swal.fire({
			title: `Reset Password ${member.full_name}?`,
			text: "Password akan diubah ke 'bjfspassword'.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			confirmButtonText: "Ya, reset!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await api.post(`/api/members/reset-password/${member.id}`);
					Swal.fire("Berhasil!", "Password member telah direset.", "success");
				} catch (err) {
					Swal.fire(
						"Gagal!",
						err.response?.data?.message || "Gagal mereset password.",
						"error",
					);
				}
			}
		});
	};

	const handleOpenAddReport = () => {
		const { report_template, position } = details.member_info;

		let finalReportType = "regular_player"; // Default
		if (report_template === "mastery") {
			finalReportType = position === "Kiper" ? "mastery_gk" : "mastery_player";
		} else {
			finalReportType = position === "Kiper" ? "regular_gk" : "regular_player";
		}

		setReportTypeToCreate(finalReportType);
		setEditingEvaluationId(null);
		setIsEvaluationModalOpen(true);
	};

	const handleOpenEditReport = (evaluationId) => {
		setEditingEvaluationId(evaluationId);
		setIsEvaluationModalOpen(true);
	};

	const handleDeleteReport = (evaluationId) => {
		Swal.fire({
			title: "Hapus Laporan Ini?",
			text: "Tindakan ini tidak dapat dibatalkan.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			confirmButtonText: "Ya, hapus!",
			cancelButtonText: "Batal",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await api.delete(`/api/members/evaluations/${evaluationId}`);
					Swal.fire("Dihapus!", "Laporan evaluasi telah dihapus.", "success");
					triggerRefetch(); // Muat ulang data
				} catch (err) {
					Swal.fire(
						"Gagal!",
						err.response?.data?.message || "Gagal menghapus laporan.",
						"error",
					);
				}
			}
		});
	};

	const handleToggleStatus = async (event) => {
		event.preventDefault();
		event.stopPropagation();
		try {
			await api.put(`/api/members/toggle-status/${details.member_info.id}`);
			Swal.fire({
				toast: true,
				position: "top-end",
				showConfirmButton: false,
				timer: 2000,
				icon: "success",
				title: `Status ${details.member_info.full_name} diubah`,
			});
			// PERBAIKAN: Panggil fungsi fetchDetails() untuk memuat ulang data
			fetchDetails();
		} catch (err) {
			console.log(err);
			Swal.fire(
				"Gagal!",
				err.response?.data?.message || "Gagal mengubah status.",
				"error",
			);
		}
	};

	const handleDownloadImage = useCallback(() => {
		if (contentRef.current === null) {
			return;
		}

		// Show loading
		Swal.fire({
			title: "Membuat kartu...",
			text: "Mohon tunggu sebentar",
			allowOutsideClick: false,
			allowEscapeKey: false,
			didOpen: () => {
				Swal.showLoading();
			},
		});

		// Wait for fonts to load before capturing
		setTimeout(() => {
			toPng(contentRef.current, {
				cacheBust: true,
				pixelRatio: 3,
				skipFonts: true, // Skip font loading check
			})
				.then((dataUrl) => {
					Swal.close();
					const link = document.createElement("a");
					link.download = `kartu-anggota-${details.member_info.full_name}.png`;
					link.href = dataUrl;
					link.click();

					Swal.fire({
						toast: true,
						position: "top-end",
						icon: "success",
						title: "Kartu berhasil diunduh",
						showConfirmButton: false,
						timer: 2000,
					});
				})
				.catch((err) => {
					console.error("Gagal membuat gambar kartu:", err);
					Swal.fire("Gagal!", "Tidak dapat mengunduh gambar kartu.", "error");
				});
		}, 500); // Wait 500ms for fonts to load
	}, [contentRef, details]);

	if (loading) return <p className="p-6">Memuat detail member...</p>;
	if (!details || !details.member_info)
		return <p className="p-6">Gagal memuat data.</p>;

	const { member_info, evaluations } = details;

	console.log("Member Details:", details);

	return (
		<div className="p-4">
			<MoveBranchModal
				isOpen={isMoveModalOpen}
				onClose={() => setIsMoveModalOpen(false)}
				refetch={fetchDetails}
				memberData={member_info}
			/>
			<EvaluationModal
				isOpen={isEvaluationModalOpen}
				onClose={() => setIsEvaluationModalOpen(false)}
				refetch={triggerRefetch}
				memberInfo={member_info}
				evaluationId={editingEvaluationId}
				reportTypeToCreate={reportTypeToCreate}
			/>

			<div style={{ position: "fixed", left: "-9999px", top: 0 }}>
				<MemberCard ref={contentRef} memberInfo={member_info} />
			</div>

			<button
				onClick={() => navigate(-1)}
				className="flex items-center gap-2 text-sm text-secondary mb-4 font-semibold"
			>
				<FiArrowLeft /> Kembali
			</button>

			{paymentStatus.show && (
				<div
					className={`border-l-4 p-4 rounded-md mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
						paymentStatus.status === "pending"
							? "bg-blue-100 border-blue-500 text-blue-800"
							: paymentStatus.isOverdue
								? "bg-red-100 border-red-500 text-red-800"
								: "bg-yellow-100 border-yellow-500 text-yellow-800"
					}`}
				>
					<div className="flex items-center gap-3">
						<FiAlertCircle size={24} className="shrink-0" />
						<div>
							<p className="font-bold">
								{paymentStatus.status === "pending"
									? "Menunggu Verifikasi Pembayaran"
									: "Pemberitahuan Iuran Bulanan"}
							</p>
							<p className="text-sm">
								{paymentStatus.status === "pending"
									? "Member telah mengunggah bukti pembayaran. Silakan verifikasi."
									: paymentStatus.isOverdue
										? `Pembayaran iuran telah jatuh tempo.`
										: `Jatuh tempo pembayaran dalam ${paymentStatus.days} hari lagi.`}
							</p>
						</div>
					</div>
					<div className="flex-shrink-0">
						<button
							onClick={handleScrollToPaymentHistory}
							className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-md"
						>
							<FiEye size={16} /> Lihat Detail
						</button>
					</div>
				</div>
			)}

			<EditableMemberHeader memberInfo={member_info} refetch={fetchDetails} />

			{/* Action Buttons */}
			<div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-6">
				<button
					onClick={handleDownloadImage}
					className="flex flex-row lg:flex-col items-center justify-center gap-2 lg:gap-3 bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:via-gray-700 hover:to-gray-900 text-white font-semibold py-4 lg:py-12 px-6 rounded-lg transition duration-200 border border-white/10 shadow-lg"
				>
					<FiImage className="text-2xl lg:text-4xl" />
					<span className="text-sm uppercase tracking-wide">Unduh Kartu</span>
				</button>
				<button
					onClick={reactToPrintFn}
					className="flex flex-row lg:flex-col items-center justify-center gap-2 lg:gap-3 bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:via-gray-700 hover:to-gray-900 text-white font-semibold py-4 lg:py-12 px-6 rounded-lg transition duration-200 border border-white/10 shadow-lg"
				>
					<FiPrinter className="text-2xl lg:text-4xl" />
					<span className="text-sm uppercase tracking-wide">Cetak Kartu</span>
				</button>
				<button
					onClick={() => setIsMoveModalOpen(true)}
					className="flex flex-row lg:flex-col items-center justify-center gap-2 lg:gap-3 bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:via-gray-700 hover:to-gray-900 text-white font-semibold py-4 lg:py-12 px-6 rounded-lg transition duration-200 border border-white/10 shadow-lg"
				>
					<FiMove className="text-2xl lg:text-4xl" />
					<span className="text-sm uppercase tracking-wide">Pindah Cabang</span>
				</button>
				<button
					onClick={() => handleResetPassword(member_info)}
					className="flex flex-row lg:flex-col items-center justify-center gap-2 lg:gap-3 bg-gradient-to-br from-red-900 via-red-800 to-red-900 hover:from-red-800 hover:via-red-700 hover:to-red-800 text-white font-semibold py-4 lg:py-12 px-6 rounded-lg transition duration-200 border border-white/10 shadow-lg"
				>
					<FiKey className="text-2xl lg:text-4xl" />
					<span className="text-sm uppercase tracking-wide">
						Reset Password
					</span>
				</button>
				<button
					onClick={handleToggleStatus}
					className={`flex flex-row lg:flex-col items-center justify-center gap-2 lg:gap-3 font-semibold py-4 lg:py-12 px-6 rounded-lg transition duration-200 border border-white/10 shadow-lg text-white ${
						member_info.status === "active"
							? "bg-gradient-to-br from-red-900 via-red-800 to-red-900 hover:from-red-800 hover:via-red-700 hover:to-red-800"
							: "bg-gradient-to-br from-green-900 via-green-800 to-green-900 hover:from-green-800 hover:via-green-700 hover:to-green-800"
					}`}
				>
					<FiPower className="text-2xl lg:text-4xl" />
					<span className="text-sm uppercase tracking-wide">
						{member_info.status === "active" ? "Nonaktifkan" : "Aktifkan"}
					</span>
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<AttendanceHistory memberId={id} />

				<div className="bg-white p-6 shadow-md rounded-md">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-bold text-primary">
							Riwayat Laporan Evaluasi
						</h2>
						<button
							onClick={handleOpenAddReport}
							className="flex items-center gap-2 text-sm bg-secondary text-white px-3 py-1 rounded-md"
						>
							<FiPlus /> Buat Laporan
						</button>
					</div>
					<div className="space-y-4">
						{evaluations.slice(0, visibleReportsCount).map(
							(
								ev, // Menggunakan slice
							) => (
								<div
									key={ev.id}
									className="bg-gray-50 p-3 rounded-md border border-slate-300 flex justify-between items-center"
								>
									<div>
										<p className="font-semibold">
											{new Date(ev.evaluation_date).toLocaleDateString(
												"id-ID",
												{ day: "numeric", month: "long", year: "numeric" },
											)}
										</p>
										<p className="text-sm text-gray-500">
											Rapor {ev.report_type}
										</p>
									</div>
									<div className="flex gap-2">
										<Link
											to={`/member/${id}/report/${ev.id}`}
											state={{ evaluation: ev, memberInfo: member_info }}
											className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
										>
											<FiEye />
										</Link>
										<button
											onClick={() => handleOpenEditReport(ev.id)}
											className="p-2 text-green-600 hover:bg-green-100 rounded-full"
										>
											<FiEdit />
										</button>
										<button
											onClick={() => handleDeleteReport(ev.id)}
											className="p-2 text-red-600 hover:bg-red-100 rounded-full"
										>
											<FiTrash2 />
										</button>
									</div>
								</div>
							),
						)}
						{evaluations.length === 0 && <p>Belum ada laporan evaluasi.</p>}
					</div>
					{evaluations.length > visibleReportsCount && ( // Tombol "Tampilkan lebih banyak"
						<div className="mt-6 text-center">
							<button
								onClick={() => setVisibleReportsCount(evaluations.length)}
								className="text-sm font-semibold text-secondary hover:underline"
							>
								Tampilkan Semua ({evaluations.length}) Laporan
							</button>
						</div>
					)}
				</div>

				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-bold text-primary mb-4">
						Prestasi yang Diraih
					</h2>
					<div className="space-y-3 max-h-96 overflow-y-auto pr-2">
						{achievements.length > 0 ? (
							achievements.map((ach) => (
								<div
									key={ach.id}
									className="p-3 bg-yellow-50 rounded-md border border-yellow-200 flex justify-between items-start"
								>
									<div>
										<p className="font-bold text-yellow-800 flex items-center gap-2">
											<FiAward /> {ach.achievement_name}
										</p>
										<p className="text-xs text-gray-500 mt-1">
											{new Date(ach.event_date).toLocaleDateString("id-ID", {
												year: "numeric",
												month: "long",
											})}
										</p>
										{ach.notes && (
											<p className="text-xs text-gray-600 italic mt-1">
												"{ach.notes}"
											</p>
										)}
									</div>
								</div>
							))
						) : (
							<p className="text-sm text-gray-500">
								Belum ada prestasi yang dicatat.
							</p>
						)}
					</div>
				</div>

				<DocumentLinks memberInfo={member_info} />

				<div className="col-span-2" ref={paymentHistoryRef}>
					<PaymentHistory memberId={id} refetchParent={triggerRefetch} />
				</div>
			</div>
		</div>
	);
};

export default MemberDetailPage;
