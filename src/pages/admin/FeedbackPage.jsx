// File: src/pages/admin/FeedbackPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
	FiMessageSquare,
	FiUser,
	FiHome,
	FiClock,
	FiArchive,
	FiEye,
	FiCheck,
	FiCornerUpLeft,
} from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FeedbackCard = ({ feedback, onStatusChange }) => {
	const handleStatusUpdate = (newStatus) => {
		Swal.fire({
			title: "Ubah Status Feedback?",
			text: `Anda akan mengubah status menjadi "${newStatus}".`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#1A2347",
			cancelButtonColor: "#d33",
			confirmButtonText: "Ya, ubah!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await axios.put(`/api/feedback/${feedback.id}/status`, {
						id: feedback.id,
						status: newStatus,
					});
					Swal.fire("Berhasil!", "Status feedback telah diubah.", "success");
					onStatusChange(); // Memanggil fungsi untuk memuat ulang data
				} catch (error) {
					Swal.fire("Gagal", "Gagal mengubah status feedback.", "error");
				}
			}
		});
	};

	const [showReplyForm, setShowReplyForm] = useState(false);
	const [replyText, setReplyText] = useState("");

	const handleSendReply = async () => {
		if (replyText.trim() === "") return;
		try {
			await axios.post(`/api/feedback/${feedback.id}/reply`, {
				feedback_id: feedback.id,
				reply_content: replyText,
			});
			Swal.fire("Terkirim!", "Balasan Anda telah berhasil dikirim.", "success");
			onStatusChange(); // Memuat ulang data
			setShowReplyForm(false);
			setReplyText("");
		} catch (error) {
			Swal.fire("Gagal", "Gagal mengirim balasan.", "error");
		}
	};
	return (
		<div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-secondary">
			<div className="flex items-start gap-4">
				<img
					src={
						feedback.member_avatar
							? `${API_BASE_URL}${feedback.member_avatar}`
							: `https://placehold.co/48x48/E0E0E0/757575?text=${feedback.member_name.charAt(
									0,
								)}`
					}
					alt={feedback.member_name}
					className="w-12 h-12 rounded-full object-cover"
				/>
				<div className="flex-grow">
					<div className="flex justify-between items-start">
						<div>
							<p className="font-bold text-primary">{feedback.member_name}</p>

							<div className="flex items-center gap-2">
								<p className="text-xs text-white bg-secondary px-1 rounded inline-block">
									{feedback.member_id}
								</p>
								<p className="text-xs text-gray-500">{feedback.branch_name}</p>
							</div>
						</div>
						<p className="text-xs text-gray-400 flex items-center gap-1">
							<FiClock size={12} />
							{new Date(feedback.submitted_at).toLocaleDateString("id-ID", {
								day: "numeric",
								month: "short",
								year: "numeric",
							})}
						</p>
					</div>
					<p className="text-gray-700 mt-3 text-sm">{feedback.content}</p>
				</div>
			</div>
			<div className="flex justify-end gap-2 mt-4 pt-4 border-t">
				{feedback.status !== "read" && (
					<button
						onClick={() => handleStatusUpdate("read")}
						className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded"
					>
						<FiEye size={12} /> Tandai Dibaca
					</button>
				)}
				{feedback.status !== "archived" && (
					<button
						onClick={() => handleStatusUpdate("archived")}
						className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 font-semibold px-2 py-1 rounded"
					>
						<FiArchive size={12} /> Arsipkan
					</button>
				)}
			</div>

			{feedback.reply_content && (
				<div className="mt-4 pt-4 border-t border-dashed bg-gray-50 p-3 rounded-lg">
					<p className="text-xs font-semibold text-primary flex items-center gap-1">
						<FiCornerUpLeft /> Balasan dari {feedback.replier_username}:
					</p>
					<p className="text-sm text-gray-600 italic mt-1">
						"{feedback.reply_content}"
					</p>
				</div>
			)}

			{/* Tampilkan form atau tombol balas */}
			{!feedback.reply_content && (
				<div className="flex justify-end mt-4 pt-4 border-t">
					{showReplyForm ? (
						<div className="w-full">
							<textarea
								value={replyText}
								onChange={(e) => setReplyText(e.target.value)}
								rows="3"
								className="w-full p-2 border rounded-md"
								placeholder="Tulis balasan Anda..."
							></textarea>
							<div className="flex justify-end gap-2 mt-2">
								<button
									onClick={() => setShowReplyForm(false)}
									className="text-xs text-gray-600 px-3 py-1 rounded-md hover:bg-gray-200"
								>
									Batal
								</button>
								<button
									onClick={handleSendReply}
									className="text-sm bg-primary text-white font-semibold px-3 py-1 rounded-md"
								>
									Kirim
								</button>
							</div>
						</div>
					) : (
						<button
							onClick={() => setShowReplyForm(true)}
							className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded"
						>
							<FiCornerUpLeft size={12} /> Balas
						</button>
					)}
				</div>
			)}
		</div>
	);
};

const FeedbackPage = () => {
	const [allFeedback, setAllFeedback] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("unread");

	const fetchFeedback = useCallback(async () => {
		setLoading(true);
		try {
			const response = await axios.get("/api/feedback");
			setAllFeedback(Array.isArray(response.data) ? response.data : []);
		} catch (error) {
			Swal.fire("Error", "Gagal memuat data feedback.", "error");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchFeedback();
	}, [fetchFeedback]);

	const filteredFeedback = useMemo(() => {
		return allFeedback.filter((item) => item.status === activeTab);
	}, [allFeedback, activeTab]);

	return (
		<div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
			<h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
				<FiMessageSquare /> Kotak Masuk Kritik & Saran
			</h1>

			<div className="flex border-b mb-6">
				<button
					onClick={() => setActiveTab("unread")}
					className={`px-4 py-2 text-sm font-semibold ${
						activeTab === "unread"
							? "border-b-2 border-secondary text-secondary"
							: "text-gray-500"
					}`}
				>
					Belum Dibaca
				</button>
				<button
					onClick={() => setActiveTab("read")}
					className={`px-4 py-2 text-sm font-semibold ${
						activeTab === "read"
							? "border-b-2 border-secondary text-secondary"
							: "text-gray-500"
					}`}
				>
					Sudah Dibaca
				</button>
				<button
					onClick={() => setActiveTab("archived")}
					className={`px-4 py-2 text-sm font-semibold ${
						activeTab === "archived"
							? "border-b-2 border-secondary text-secondary"
							: "text-gray-500"
					}`}
				>
					Diarsipkan
				</button>
			</div>

			<div className="space-y-4">
				{loading ? (
					<p className="text-center">Memuat feedback...</p>
				) : filteredFeedback.length > 0 ? (
					filteredFeedback.map((item) => (
						<FeedbackCard
							key={item.id}
							feedback={item}
							onStatusChange={fetchFeedback}
						/>
					))
				) : (
					<p className="text-center text-gray-500 py-8">
						Tidak ada feedback di tab ini.
					</p>
				)}
			</div>
		</div>
	);
};

export default FeedbackPage;
