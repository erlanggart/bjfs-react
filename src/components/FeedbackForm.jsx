// File: src/components/FeedbackForm.jsx
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiMessageSquare } from "react-icons/fi";

const FeedbackForm = ({ onUploadSuccess }) => {
	const [feedbackText, setFeedbackText] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (feedbackText.trim() === "") {
			Swal.fire("Oops...", "Mohon isi kritik atau saran Anda.", "warning");
			return;
		}
		setLoading(true);
		try {
			const response = await axios.post("/api/members/submit-feedback", {
				content: feedbackText,
			});
			Swal.fire("Terkirim!", response.data.message, "success");
			setFeedbackText(""); // Kosongkan form setelah berhasil
			if (onUploadSuccess) {
				onUploadSuccess(); // Panggil fungsi untuk me-refresh
			}
		} catch (error) {
			Swal.fire(
				"Gagal",
				error.response?.data?.message || "Gagal mengirim masukan.",
				"error"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white rounded-xl shadow-lg p-6">
			<h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
				<FiMessageSquare /> Kotak Kritik & Saran
			</h2>
			<p className="text-sm text-gray-500 mb-4">
				Punya masukan untuk kami? Tulis di sini agar kami bisa menjadi lebih
				baik lagi.
			</p>
			<form onSubmit={handleSubmit}>
				<textarea
					value={feedbackText}
					onChange={(e) => setFeedbackText(e.target.value)}
					rows="5"
					className="w-full p-2 border rounded-md"
					placeholder="Tulis masukan Anda di sini..."
				></textarea>
				<div className="text-right mt-4">
					<button
						type="submit"
						disabled={loading}
						className="px-6 py-2 bg-primary text-white font-semibold rounded-lg disabled:bg-gray-400"
					>
						{loading ? "Mengirim..." : "Kirim Masukan"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default FeedbackForm;
