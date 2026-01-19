import React, { useState, useEffect } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

const MoveBranchModal = ({ isOpen, onClose, refetch, memberData }) => {
	const [branches, setBranches] = useState([]);
	const [selectedBranch, setSelectedBranch] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (isOpen) {
			const fetchBranches = async () => {
				try {
					const response = await api.get("/api/branches");
					setBranches(response.data);
					// Set default value ke cabang saat ini jika ada
					if (response.data.length > 0) {
						setSelectedBranch(memberData.branch_id);
					}
				} catch (error) {
					console.error("Gagal memuat cabang", error);
				}
			};
			fetchBranches();
		}
	}, [isOpen, memberData]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await api.put(`/api/members/move-branch/${memberData.id}`, {
				new_branch_id: selectedBranch,
			});
			Swal.fire(
				"Berhasil!",
				`${memberData.full_name} telah dipindahkan.`,
				"success"
			);
			refetch();
			onClose();
		} catch (err) {
			Swal.fire(
				"Gagal!",
				err.response?.data?.message || "Gagal memindahkan member.",
				"error"
			);
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg p-8 w-full max-w-md relative shadow-xl">
				<h2 className="text-xl font-bold mb-4 text-gray-800">
					Pindahkan Member
				</h2>
				<p className="text-sm text-gray-600 mb-4">
					Pindahkan <strong>{memberData.full_name}</strong> ke cabang lain.
				</p>
				<form onSubmit={handleSubmit}>
					<select
						value={selectedBranch}
						onChange={(e) => setSelectedBranch(e.target.value)}
						className="w-full p-2 border rounded-md"
					>
						{branches.map((branch) => (
							<option key={branch.id} value={branch.id}>
								{branch.name}
							</option>
						))}
					</select>
					<div className="flex justify-end gap-4 pt-6">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
						>
							Batal
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-4 py-2 bg-secondary text-white rounded-lg disabled:opacity-50"
						>
							{loading ? "Memindahkan..." : "Pindahkan"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default MoveBranchModal;
