import React, { useState } from "react";
import Swal from "sweetalert2";
import api from "../../services/api";
import { FiAward } from "react-icons/fi";

// Komponen Form Tambah Kompetensi
const AddCompetencyForm = ({ refetch }) => {
	const [formData, setFormData] = useState({
		name: "",
		issuer: "",
		date_obtained: "",
		certificate_number: "",
		description: "",
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await api.post("/api/branch_admins/competencies", {
				competency_name: formData.name,
				issuer: formData.issuer,
				date_obtained: formData.date_obtained,
				certificate_number: formData.certificate_number,
				description: formData.description,
			});
			Swal.fire("Sukses!", "Kompetensi baru berhasil ditambahkan.", "success");
			setFormData({
				name: "",
				issuer: "",
				date_obtained: "",
				certificate_number: "",
				description: "",
			});
			refetch();
		} catch {
			Swal.fire("Gagal", "Gagal menambahkan kompetensi.", "error");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
			<h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
				<FiAward /> Tambah Kompetensi / Sertifikasi / Pengalaman
			</h2>
			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Nama Kompetensi/Sertifikat/Pengalaman/Pendidiakan *
					</label>
					<input
						type="text"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						placeholder="Pelatihan Kepelatihan Sepak Bola, Psikologi, Ahli Gizi, dsb."
						className="w-full p-3 border rounded-md"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Penerbit/Lembaga/Institusi
					</label>
					<input
						type="text"
						value={formData.issuer}
						onChange={(e) =>
							setFormData({ ...formData, issuer: e.target.value })
						}
						placeholder="etc., Universitas Indonesia, SSB, dsb."
						className="w-full p-3 border rounded-md"
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Tanggal Diperoleh
						</label>
						<input
							type="date"
							value={formData.date_obtained}
							onChange={(e) =>
								setFormData({ ...formData, date_obtained: e.target.value })
							}
							className="w-full p-3 border rounded-md"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Nomor Sertifikat (Jika Ada)
						</label>
						<input
							type="text"
							value={formData.certificate_number}
							onChange={(e) =>
								setFormData({ ...formData, certificate_number: e.target.value })
							}
							placeholder="Nomor Sertifikat"
							className="w-full p-3 border rounded-md"
						/>
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Deskripsi Kompetensi (Opsional)
					</label>
					<textarea
						value={formData.description}
						onChange={(e) =>
							setFormData({ ...formData, description: e.target.value })
						}
						placeholder="Deskripsi kompetensi (opsional)"
						rows="3"
						className="w-full p-3 border rounded-md"
					></textarea>
				</div>
				<button
					type="submit"
					className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-secondary/90 transition-colors"
				>
					Simpan Kompetensi
				</button>
			</div>
		</form>
	);
};

export default AddCompetencyForm;
