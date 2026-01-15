// File: src/components/admin/AddUserModal.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiX } from "react-icons/fi";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext"; // Impor useAuth

const AddUserModal = ({ isOpen, onClose, role, refetch, defaultBranchId }) => {
	const { user } = useAuth(); // Dapatkan data user yang sedang login
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		full_name: "",
		branch_id: "",
		date_of_birth: "",
	});
	const [branches, setBranches] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (isOpen) {
			// Reset form
			setFormData({
				username: "",
				password: "",
				full_name: "",
				branch_id: "",
				date_of_birth: "",
			});
			setBranches([]); // Kosongkan daftar cabang

			// PERBAIKAN: Logika kondisional berdasarkan peran
			if (user?.role === "admin") {
				// Jika super admin, ambil daftar semua cabang
				const fetchBranches = async () => {
					try {
						const response = await axios.get("/api/branches/list.php");
						setBranches(response.data);
						if (response.data.length > 0) {
							// Set default ke cabang pertama atau ke cabang yang dipilih dari halaman detail
							setFormData((prev) => ({
								...prev,
								branch_id: defaultBranchId || response.data[0].id,
							}));
						}
					} catch (err) {
						Swal.fire("Error", "Gagal memuat daftar cabang.", "error");
					}
				};
				fetchBranches();
			} else if (user?.role === "admin_cabang") {
				// Jika admin cabang, langsung gunakan branch_id dari props
				setFormData((prev) => ({ ...prev, branch_id: defaultBranchId }));
			}
		}
	}, [isOpen, user, defaultBranchId]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (
			!formData.username ||
			!formData.password ||
			!formData.full_name ||
			!formData.branch_id
		) {
			Swal.fire(
				"Validasi Gagal",
				"Semua field yang ditandai wajib diisi.",
				"warning"
			);
			return;
		}
		if (role === "member" && !formData.date_of_birth) {
			Swal.fire(
				"Validasi Gagal",
				"Tanggal lahir wajib diisi untuk member.",
				"warning"
			);
			return;
		}

		setLoading(true);
		try {
			const payload = { ...formData, role };
			await axios.post("/api/admin/create_user.php", payload);
			Swal.fire({
				title: "Berhasil!",
				text: "Pengguna baru berhasil ditambahkan.",
				icon: "success",
				timer: 2000,
				showConfirmButton: false,
			});
			refetch();
			onClose();
		} catch (err) {
			Swal.fire({
				title: "Oops...",
				text: err.response?.data?.message || "Terjadi kesalahan.",
				icon: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg p-8 w-full max-w-lg relative shadow-xl text-gray-800">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
				>
					<FiX size={24} />
				</button>
				<h2 className="text-2xl font-bold mb-6">
					Tambah {role === "admin_cabang" ? "Admin Cabang" : "Member"} Baru
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<InputField
						label="Username"
						name="username"
						value={formData.username}
						onChange={handleChange}
						required
					/>
					<InputField
						label="Password"
						name="password"
						type="password"
						value={formData.password}
						onChange={handleChange}
						required
					/>
					<InputField
						label="Nama Lengkap"
						name="full_name"
						value={formData.full_name}
						onChange={handleChange}
						required
					/>

					{/* Hanya tampilkan dropdown jika user adalah admin */}
					{user?.role === "admin" && (
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Cabang
							</label>
							<select
								name="branch_id"
								value={formData.branch_id}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D91E5B]"
							>
								{branches.length === 0 && <option>Memuat cabang...</option>}
								{branches.map((branch) => (
									<option key={branch.id} value={branch.id}>
										{branch.name}
									</option>
								))}
							</select>
						</div>
					)}

					{role === "member" && (
						<InputField
							label="Tanggal Lahir"
							name="date_of_birth"
							type="date"
							value={formData.date_of_birth}
							onChange={handleChange}
							required
						/>
					)}

					<div className="flex justify-end gap-4 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
						>
							Batal
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-4 py-2 bg-[#D91E5B] text-white rounded-lg disabled:opacity-50"
						>
							{loading ? "Menyimpan..." : "Simpan Pengguna"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

const InputField = ({ label, ...props }) => (
	<div>
		<label className="block text-sm font-medium text-gray-700 mb-1">
			{label} <span className="text-red-500">*</span>
		</label>
		<input
			{...props}
			className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D91E5B]"
		/>
	</div>
);

export default AddUserModal;
