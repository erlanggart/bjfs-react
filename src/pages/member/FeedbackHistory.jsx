// File: src/pages/member/FeedbackHistoryPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiMessageSquare, FiCornerUpLeft } from "react-icons/fi";
import FeedbackForm from "../../components/FeedbackForm";

const FeedbackHistoryPage = () => {
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(true);

	const [refreshKey, setRefreshKey] = useState(0); // Untuk memicu refresh

	// Fungsi untuk memuat ulang data, akan dipanggil setelah form berhasil disubmit
	const triggerRefetch = () => setRefreshKey((prev) => prev + 1);

	useEffect(() => {
		const fetchHistory = async () => {
			try {
				const response = await axios.get("/api/members/my_feedback.php");
				setHistory(Array.isArray(response.data) ? response.data : []);
			} catch (error) {
				console.error("Gagal memuat riwayat feedback", error);
			} finally {
				setLoading(false);
			}
		};
		fetchHistory();
	}, [refreshKey]);

	return (
		<div className="p-4 sm:p-6">
			<FeedbackForm onUploadSuccess={triggerRefetch} />

			<div className="bg-white rounded-xl shadow-lg p-6 mt-6">
				<h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
					<FiMessageSquare /> Riwayat Kritik & Saran Saya
				</h1>
				<div className="max-w-4xl mx-auto space-y-4">
					{loading ? (
						<p>Memuat...</p>
					) : history.length > 0 ? (
						history.map((item) => (
							<div
								key={item.id}
								className="bg-white border border-slate-200 rounded-lg shadow-md p-5"
							>
								<p className="text-xs text-gray-400">
									{new Date(item.submitted_at).toLocaleString("id-ID")}
								</p>
								<p className="text-gray-700 mt-2">"{item.content}"</p>
								{item.reply_content && (
									<div className="mt-4 pt-4 border-t border-dashed bg-gray-50 p-3 rounded-lg">
										<p className="text-xs font-semibold text-primary flex items-center gap-1">
											<FiCornerUpLeft /> Balasan dari {item.replier_username}:
										</p>
										<p className="text-sm text-gray-600 italic mt-1">
											"{item.reply_content}"
										</p>
									</div>
								)}
							</div>
						))
					) : (
						<p>Anda belum pernah mengirim feedback.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default FeedbackHistoryPage;
