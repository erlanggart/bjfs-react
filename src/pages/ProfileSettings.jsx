// File: src/pages/ProfileSettingsPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import {
	FiCamera,
	FiUser,
	FiPhone,
	FiLock,
	FiUpload,
	FiCheckCircle,
	FiFileText,
	FiTrash2,
	FiEdit2,
	FiCalendar,
	FiUserPlus,
	FiMapPin,
	FiSave,
	FiX,
	FiAward,
	FiEdit,
	FiFile,
} from "react-icons/fi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Komponen BARU untuk menangani logika upload/view dokumen
const DocumentUploadField = ({
	docType,
	docUrl,
	label,
	onFileChange,
	fileName,
	onDelete,
}) => {
	if (docUrl) {
		return (
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					{label}
				</label>
				<div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
					<div className="flex items-center gap-2 text-green-700">
						<FiCheckCircle />
						<span className="font-semibold text-sm">
							Dokumen Sudah Terunggah
						</span>
					</div>
					<div className="flex flex-col  md:flex-row items-center gap-2">
						<a
							href={`${API_BASE_URL}${docUrl}`}
							target="_blank"
							rel="noopener noreferrer"
							className="py-1 px-6 bg-slate-200 rounded text-sm font-semibold text-secondary hover:underline"
						>
							Lihat
						</a>
						<button
							type="button"
							onClick={() => onDelete(docType)}
							className="flex items-center py-1 px-2 rounded bg-red-500 text-white gap-2 hover:text-red-700"
						>
							<FiTrash2 size={16} /> Hapus
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-1">
				{label}
			</label>
			<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
				<div className="space-y-1 text-center">
					<FiFileText className="mx-auto h-12 w-12 text-gray-400" />
					<div className="flex text-sm text-gray-600">
						<label
							htmlFor={docType}
							className="relative cursor-pointer bg-white rounded-md font-medium text-secondary hover:text-primary focus-within:outline-none"
						>
							<span>Pilih file</span>
							<input
								id={docType}
								name={docType}
								type="file"
								className="sr-only"
								onChange={onFileChange}
							/>
						</label>
						<p className="pl-1">atau seret dan lepas</p>
					</div>
					<p className="text-xs text-gray-500">
						{fileName || "PNG, JPG, PDF hingga 2MB"}
					</p>
				</div>
			</div>
		</div>
	);
};

const AchievementItem = ({ achievement, onUpdate, onDelete }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: achievement.achievement_name,
		date: achievement.event_date,
		notes: achievement.notes || "",
	});

	const handleSave = () => {
		onUpdate(achievement.id, formData);
		setIsEditing(false);
	};

	if (isEditing) {
		return (
			<div className="p-3 bg-blue-50 rounded-md border border-blue-200 space-y-2">
				<input
					type="text"
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					className="w-full p-1 border rounded-md text-sm font-bold"
				/>
				<input
					type="date"
					value={formData.date}
					onChange={(e) => setFormData({ ...formData, date: e.target.value })}
					className="w-full p-1 border rounded-md text-xs"
				/>
				<textarea
					value={formData.notes}
					onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
					placeholder="Catatan"
					rows="2"
					className="w-full p-1 border rounded-md text-xs"
				></textarea>
				<div className="flex justify-end gap-2">
					<button
						onClick={() => setIsEditing(false)}
						className="p-1 text-gray-500"
					>
						<FiX />
					</button>
					<button onClick={handleSave} className="p-1 text-green-600">
						<FiSave />
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="p-3 bg-yellow-50 rounded-md border border-yellow-200 flex justify-between items-start">
			<div>
				<p className="font-bold text-yellow-800 flex items-center gap-2">
					<FiAward /> {achievement.achievement_name}
				</p>
				<p className="text-xs text-gray-500 mt-1">
					{new Date(achievement.event_date).toLocaleDateString("id-ID", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</p>
				{achievement.notes && (
					<p className="text-xs text-gray-600 italic mt-1">
						"{achievement.notes}"
					</p>
				)}
			</div>
			<div className="flex gap-1">
				<button
					onClick={() => setIsEditing(true)}
					className="p-1 text-gray-500 hover:text-blue-600"
				>
					<FiEdit size={14} />
				</button>
				<button
					onClick={() => onDelete(achievement.id)}
					className="p-1 text-gray-500 hover:text-red-600"
				>
					<FiTrash2 size={14} />
				</button>
			</div>
		</div>
	);
};

// Komponen untuk mengelola kompetensi branch admin
const CompetencyItem = ({ competency, onUpdate, onDelete }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: competency.competency_name,
		issuer: competency.issuer || "",
		date_obtained: competency.date_obtained || "",
		certificate_number: competency.certificate_number || "",
		description: competency.description || "",
	});

	const handleSave = () => {
		onUpdate(competency.id, formData);
		setIsEditing(false);
	};

	if (isEditing) {
		return (
			<div className="p-4 bg-blue-50 rounded-md border border-blue-200 space-y-3">
				<input
					type="text"
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					placeholder="Nama Kompetensi/Sertifikat"
					className="w-full p-2 border rounded-md text-sm font-semibold"
				/>
				<input
					type="text"
					value={formData.issuer}
					onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
					placeholder="Penerbit/Lembaga"
					className="w-full p-2 border rounded-md text-sm"
				/>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					<input
						type="date"
						value={formData.date_obtained}
						onChange={(e) =>
							setFormData({ ...formData, date_obtained: e.target.value })
						}
						className="w-full p-2 border rounded-md text-sm"
					/>
					<input
						type="text"
						value={formData.certificate_number}
						onChange={(e) =>
							setFormData({ ...formData, certificate_number: e.target.value })
						}
						placeholder="Nomor Sertifikat"
						className="w-full p-2 border rounded-md text-sm"
					/>
				</div>
				<textarea
					value={formData.description}
					onChange={(e) =>
						setFormData({ ...formData, description: e.target.value })
					}
					placeholder="Deskripsi kompetensi"
					rows="3"
					className="w-full p-2 border rounded-md text-sm"
				></textarea>
				<div className="flex justify-end gap-2">
					<button
						onClick={() => setIsEditing(false)}
						className="px-3 py-1 text-gray-500 hover:text-gray-700"
					>
						<FiX />
					</button>
					<button
						onClick={handleSave}
						className="px-3 py-1 text-green-600 hover:text-green-800"
					>
						<FiSave />
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="p-4 bg-green-50 rounded-md border border-green-200">
			<div className="flex justify-between items-start">
				<div className="flex-1">
					<h3 className="font-bold text-green-800 flex items-center gap-2">
						<FiAward /> {competency.competency_name}
					</h3>
					{competency.issuer && (
						<p className="text-sm text-gray-600 mt-1">
							<span className="font-medium">Penerbit:</span> {competency.issuer}
						</p>
					)}
					<div className="flex flex-col md:flex-row md:gap-4 mt-2">
						{competency.date_obtained && (
							<p className="text-xs text-gray-500">
								<span className="font-medium">Tanggal:</span>{" "}
								{new Date(competency.date_obtained).toLocaleDateString(
									"id-ID",
									{
										year: "numeric",
										month: "long",
										day: "numeric",
									}
								)}
							</p>
						)}
						{competency.certificate_number && (
							<p className="text-xs text-gray-500">
								<span className="font-medium">No. Sertifikat:</span>{" "}
								{competency.certificate_number}
							</p>
						)}
					</div>
					{competency.description && (
						<p className="text-sm text-gray-600 italic mt-2">
							"{competency.description}"
						</p>
					)}
				</div>
				<div className="flex gap-2 ml-4">
					<button
						onClick={() => setIsEditing(true)}
						className="p-1 text-gray-500 hover:text-blue-600"
					>
						<FiEdit size={16} />
					</button>
					<button
						onClick={() => onDelete(competency.id)}
						className="p-1 text-gray-500 hover:text-red-600"
					>
						<FiTrash2 size={16} />
					</button>
				</div>
			</div>
		</div>
	);
};

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
			await axios.post("/api/branch_admins/add_competency.php", {
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
		} catch (error) {
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

// Komponen Form Tambah Prestasi
const AddAchievementForm = ({ refetch }) => {
	const [name, setName] = useState("");
	const [date, setDate] = useState("");
	const [notes, setNotes] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post("/api/members/achievements", {
				achievement_name: name,
				event_date: date,
				notes: notes,
			});
			Swal.fire("Sukses!", "Prestasi baru berhasil ditambahkan.", "success");
			setName("");
			setDate("");
			setNotes("");
			refetch();
		} catch (error) {
			Swal.fire("Gagal", "Gagal menambahkan prestasi.", "error");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
			<h2 className="text-xl font-bold text-primary mb-4">
				Tambah Prestasi Baru
			</h2>
			<div className="space-y-4">
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Nama Prestasi (e.g., Juara 1)"
					className="w-full p-2 border rounded-md"
					required
				/>
				<input
					type="date"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					className="w-full p-2 border rounded-md"
					required
				/>
				<textarea
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					placeholder="Catatan (opsional)"
					rows="3"
					className="w-full p-2 border rounded-md"
				></textarea>
				<button
					type="submit"
					className="w-full bg-secondary text-white font-bold py-2 rounded-lg"
				>
					Simpan Prestasi
				</button>
			</div>
		</form>
	);
};

const ProfileSettingsPage = () => {
	const { user, logout } = useAuth();

	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	// State untuk form
	const [username, setUsername] = useState("");
	const [fullName, setFullName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");

	const [dateOfBirth, setDateOfBirth] = useState(""); // State baru
	const [registrationDate, setRegistrationDate] = useState(""); // State baru
	const [address, setAddress] = useState(""); // State baru

	const [avatarFile, setAvatarFile] = useState(null);
	const [avatarPreview, setAvatarPreview] = useState("");
	const [passwords, setPasswords] = useState({
		current: "",
		new: "",
		confirm: "",
	});

	const [signatureMode, setSignatureMode] = useState("draw"); // 'draw' atau 'upload'
	const [signatureFile, setSignatureFile] = useState(null);
	const [signaturePreview, setSignaturePreview] = useState("");
	const [achievements, setAchievements] = useState([]);
	const [competencies, setCompetencies] = useState([]);
	const [refreshKey, setRefreshKey] = useState(0);
	const sigCanvas = useRef({});

	const [documents, setDocuments] = useState({
		kk: null,
		akte: null,
		biodata: null,
	});

	const [passwordVisibility, setPasswordVisibility] = useState({
		current: false,
		new: false,
		confirm: false,
	});

	const triggerRefetch = () => setRefreshKey((prev) => prev + 1);

	const fetchProfile = async () => {
		try {
			const requests = [axios.get("/api/users/my-profile")];

			// Tambahkan request sesuai role
			if (user.role === "member") {
				requests.push(axios.get("/api/members/my-achievements"));
			} else if (user.role === "admin_cabang") {
				requests.push(axios.get("/api/branch_admins/my_competencies.php"));
			}

			const responses = await Promise.all(requests);

			// Backend returns { success: true, profile: {...} }
			const profileData = responses[0].data.profile;
			setProfile(profileData);

			if (user.role === "member") {
				setAchievements(responses[1]?.data || []);
			} else if (user.role === "admin_cabang") {
				setCompetencies(responses[1]?.data || []);
			}

			setUsername(profileData.username || "");
			setFullName(profileData.full_name || "");
			setPhoneNumber(profileData.phone_number || "");
			setDateOfBirth(profileData.date_of_birth || "");
			setAddress(profileData.address || "");
			setRegistrationDate(
				profileData.registration_date
					? profileData.registration_date.split(" ")[0]
					: ""
			);
			setAvatarPreview(profileData.avatar);
		} catch (error) {
			Swal.fire("Error", "Gagal memuat data profil.", "error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user) fetchProfile();
	}, [user, refreshKey]);

	const handleDocumentChange = (e) => {
		const { name, files } = e.target;
		if (files[0]) {
			setDocuments((prev) => ({ ...prev, [name]: files[0] }));
		}
	};

	const handleDocumentUpload = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		let fileCount = 0;
		if (documents.kk) {
			formData.append("kk", documents.kk);
			fileCount++;
		}
		if (documents.akte) {
			formData.append("akte", documents.akte);
			fileCount++;
		}
		if (documents.biodata) {
			formData.append("biodata", documents.biodata);
			fileCount++;
		}

		if (fileCount === 0) {
			Swal.fire("Info", "Pilih minimal satu file untuk diunggah.", "info");
			return;
		}

		try {
			await axios.post("/api/members/upload-documents", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			Swal.fire("Sukses", "Dokumen Anda berhasil diunggah!", "success");
			fetchProfile();
		} catch (error) {
			Swal.fire(
				"Gagal",
				error.response?.data?.message || "Gagal mengunggah dokumen.",
				"error"
			);
		}
	};

	const handleDocumentDelete = async (docType) => {
		Swal.fire({
			title: "Hapus Dokumen Ini?",
			text: "Tindakan ini tidak dapat dibatalkan.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			confirmButtonText: "Ya, hapus!",
			cancelButtonText: "Batal",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await axios.delete("/api/members/delete-document", {
						doc_type: docType,
					});
					Swal.fire("Dihapus!", "Dokumen telah berhasil dihapus.", "success");
					fetchProfile(); // Muat ulang data profil untuk menampilkan form upload lagi
				} catch (err) {
					Swal.fire(
						"Gagal!",
						err.response?.data?.message || "Gagal menghapus dokumen.",
						"error"
					);
				}
			}
		});
	};

	const handleLogout = async () => {
		await logout();
		navigate("/login");
	};

	const handleAvatarChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setAvatarFile(file);
			setAvatarPreview(URL.createObjectURL(file));
		}
	};

	const handleAvatarUpload = async () => {
		if (!avatarFile) return;
		const formData = new FormData();
		formData.append("avatar", avatarFile);
		try {
			await axios.post("/api/users/upload_avatar.php", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			Swal.fire("Sukses", "Foto profil berhasil diperbarui!", "success");
		} catch (error) {
			Swal.fire(
				"Gagal",
				error.response?.data?.message || "Gagal mengunggah foto.",
				"error"
			);
		}
	};

	const handleProfileUpdate = async (e) => {
		e.preventDefault();
		try {
			await axios.put("/api/users/update-profile", {
				username: username,
				full_name: fullName,
				phone_number: phoneNumber,
				address: address, // Kirim data baru
				date_of_birth: dateOfBirth, // Kirim data baru
				registration_date: registrationDate, // Kirim data baru
			});
			Swal.fire("Sukses", "Informasi profil berhasil diperbarui!", "success");
		} catch (error) {
			Swal.fire(
				"Gagal",
				error.response?.data?.message || "Gagal memperbarui profil.",
				"error"
			);
		}
	};

	const handlePasswordChange = async (e) => {
		e.preventDefault();
		if (passwords.new !== passwords.confirm) {
			Swal.fire(
				"Oops...",
				"Password baru dan konfirmasi tidak cocok.",
				"warning"
			);
			return;
		}
		try {
			await axios.post("/api/users/change_password.php", {
				current_password: passwords.current,
				new_password: passwords.new,
			});
			Swal.fire("Sukses", "Password berhasil diubah!", "success");
			setPasswords({ current: "", new: "", confirm: "" });
		} catch (error) {
			Swal.fire(
				"Gagal",
				error.response?.data?.message || "Gagal mengubah password.",
				"error"
			);
		}
	};

	const handleSignatureChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSignatureFile(file);
			setSignaturePreview(URL.createObjectURL(file));
		}
	};

	const handleSaveSignature = async () => {
		if (signatureMode === "draw") {
			if (sigCanvas.current.isEmpty()) {
				Swal.fire(
					"Info",
					"Silakan gambar tanda tangan Anda terlebih dahulu.",
					"info"
				);
				return;
			}
			const signatureData = sigCanvas.current.toDataURL();
			try {
				await axios.post("/api/users/save_signature.php", {
					signature: signatureData,
				});
				Swal.fire("Sukses", "Tanda tangan berhasil disimpan!", "success");
			} catch (error) {
				Swal.fire("Gagal", "Gagal menyimpan tanda tangan.", "error");
			}
		} else {
			// Mode 'upload'
			if (!signatureFile) {
				Swal.fire(
					"Info",
					"Pilih file gambar tanda tangan terlebih dahulu.",
					"info"
				);
				return;
			}
			const formData = new FormData();
			formData.append("signature", signatureFile);
			try {
				await axios.post("/api/users/save_signature.php", formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
				Swal.fire("Sukses", "Tanda tangan berhasil diunggah!", "success");
			} catch (error) {
				Swal.fire(
					"Gagal",
					error.response?.data?.message || "Gagal mengunggah tanda tangan.",
					"error"
				);
			}
		}
	};

	const handleUpdateAchievement = async (id, data) => {
		try {
			await axios.put(`/api/members/achievements/${id}`, {
				achievement_name: data.name,
				event_date: data.date,
				notes: data.notes,
			});
			Swal.fire("Sukses!", "Prestasi berhasil diperbarui.", "success");
			triggerRefetch();
		} catch (error) {
			Swal.fire("Gagal", "Gagal memperbarui prestasi.", "error");
		}
	};

	const handleDeleteAchievement = (id) => {
		Swal.fire({
			title: "Hapus Prestasi Ini?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			confirmButtonText: "Ya, hapus!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await axios.delete(`/api/members/achievements/${id}`);
					Swal.fire("Dihapus!", "Prestasi telah dihapus.", "success");
					triggerRefetch();
				} catch (err) {
					Swal.fire("Gagal!", "Gagal menghapus prestasi.", "error");
				}
			}
		});
	};

	const handleUpdateCompetency = async (id, data) => {
		try {
			await axios.post("/api/branch_admins/update_competency.php", {
				id: id,
				competency_name: data.name,
				issuer: data.issuer,
				date_obtained: data.date_obtained,
				certificate_number: data.certificate_number,
				description: data.description,
			});
			Swal.fire("Sukses!", "Kompetensi berhasil diperbarui.", "success");
			triggerRefetch();
		} catch (error) {
			Swal.fire("Gagal", "Gagal memperbarui kompetensi.", "error");
		}
	};

	const handleDeleteCompetency = (id) => {
		Swal.fire({
			title: "Hapus Kompetensi Ini?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			confirmButtonText: "Ya, hapus!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await axios.post("/api/branch_admins/delete_competency.php", {
						id: id,
					});
					Swal.fire("Dihapus!", "Kompetensi telah dihapus.", "success");
					triggerRefetch();
				} catch (err) {
					Swal.fire("Gagal!", "Gagal menghapus kompetensi.", "error");
				}
			}
		});
	};

	const togglePasswordVisibility = (field) => {
		setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
	};

	if (loading) return <p className="text-center p-10">Memuat...</p>;

	return (
		<div className="p-4 sm:p-6 bg-gray-100 min-h-full">
			<div className="max-w-4xl mx-auto space-y-6">
				{user && user.role !== "admin" && (
					<>
						{/* Avatar Section */}
						<div className="bg-white rounded-xl shadow-lg p-6 text-center">
							<h2 className="text-xl font-bold text-gray-800 mb-4">
								Foto Profil
							</h2>
							<div className="relative w-32 h-32 mx-auto mb-4">
								<img
									src={
										avatarPreview
											? avatarPreview.startsWith("blob:")
												? avatarPreview
												: avatarPreview
											: `https://placehold.co/128x128/E0E0E0/757575?text=${
													fullName ? fullName.charAt(0) : "U"
											  }`
									}
									alt="Avatar Preview"
									className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
								/>
								<label
									htmlFor="avatar-upload"
									className="absolute -bottom-0 -right-0 bg-secondary text-white p-2 rounded-full cursor-pointer hover:opacity-90"
								>
									<FiCamera />
									<input
										id="avatar-upload"
										type="file"
										accept="image/*"
										className="hidden"
										onChange={handleAvatarChange}
									/>
								</label>
							</div>
							<button
								onClick={handleAvatarUpload}
								disabled={!avatarFile}
								className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg disabled:bg-gray-400"
							>
								Simpan Foto
							</button>
						</div>
						{/* Profile Info Section */}
						<form
							onSubmit={handleProfileUpdate}
							className="bg-white rounded-xl shadow-lg p-6"
						>
							<h2 className="text-xl font-bold text-gray-800 mb-4">
								Informasi Pribadi & Akun
							</h2>
							<div className="space-y-4">
								<InputField
									icon={<FiUser />}
									label="Username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									placeholder="Masukkan username Anda"
								/>
								<InputField
									icon={<FiUser />}
									label="Nama Lengkap"
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
								/>
								<InputField
									icon={<FiPhone />}
									label="Nomor Telepon"
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
									placeholder="Contoh: 08123456789"
								/>

								<TextareaField
									icon={<FiMapPin />}
									label="Alamat"
									value={address}
									onChange={(e) => setAddress(e.target.value)}
									placeholder="Masukkan alamat lengkap"
									disabled={user?.role === "admin"}
								/>

								{/* Input untuk Tanggal Lahir & Registrasi - hidden untuk admin_cabang */}
								{user?.role !== "admin_cabang" && (
									<>
										<InputField
											icon={<FiCalendar />}
											label="Tanggal Lahir"
											type="date"
											value={dateOfBirth}
											onChange={(e) => setDateOfBirth(e.target.value)}
											disabled={user?.role === "admin"}
										/>
										<InputField
											icon={<FiUserPlus />}
											label="Tanggal Awal Gabung"
											type="date"
											value={registrationDate}
											onChange={(e) => setRegistrationDate(e.target.value)}
											disabled={user?.role === "admin"}
										/>
									</>
								)}
							</div>
							<div className="text-right mt-6">
								<button
									type="submit"
									className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg"
								>
									Simpan Perubahan
								</button>
							</div>
						</form>
					</>
				)}

				{user && user.role === "admin_cabang" && (
					<div className="bg-white rounded-xl shadow-lg p-6">
						<h2 className="text-xl font-bold text-gray-800 mb-4">
							Tanda Tangan Digital
						</h2>

						{/* Tombol Pilihan Mode */}
						<div className="flex border border-gray-200 rounded-lg p-1 mb-4 w-min">
							<button
								onClick={() => setSignatureMode("draw")}
								className={`flex items-center gap-2 px-3 py-1 text-sm rounded-md ${
									signatureMode === "draw"
										? "bg-secondary text-white"
										: "text-gray-500"
								}`}
							>
								<FiEdit2 /> Gambar
							</button>
							<button
								onClick={() => setSignatureMode("upload")}
								className={`flex items-center gap-2 px-3 py-1 text-sm rounded-md ${
									signatureMode === "upload"
										? "bg-secondary text-white"
										: "text-gray-500"
								}`}
							>
								<FiUpload /> Unggah
							</button>
						</div>

						{signatureMode === "draw" ? (
							<div>
								<div className="border rounded-md">
									<SignatureCanvas
										ref={sigCanvas}
										penColor="black"
										canvasProps={{ className: "w-full h-48" }}
									/>
								</div>
								<button
									onClick={() => sigCanvas.current.clear()}
									className="text-xs text-gray-500 mt-2 hover:underline"
								>
									Bersihkan Kanvas
								</button>
							</div>
						) : (
							<div className="flex flex-col sm:flex-row items-center gap-6">
								<div className="w-full sm:w-1/2">
									<label
										htmlFor="signature-upload"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Pilih File (PNG/JPG)
									</label>
									<input
										id="signature-upload"
										type="file"
										accept="image/png, image/jpeg"
										onChange={handleSignatureChange}
										className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20"
									/>
								</div>
								<div className="w-full sm:w-1/2">
									<p className="text-sm font-medium text-gray-700 mb-1">
										Preview
									</p>
									<div className="border rounded-md p-2 h-32 flex items-center justify-center bg-gray-50">
										{signaturePreview ? (
											<img
												src={signaturePreview}
												alt="Preview Tanda Tangan"
												className="max-h-full max-w-full"
											/>
										) : (
											<p className="text-xs text-gray-400">Tidak ada gambar</p>
										)}
									</div>
								</div>
							</div>
						)}

						<div className="text-right mt-6">
							<button
								onClick={handleSaveSignature}
								className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg"
							>
								Simpan Tanda Tangan
							</button>
						</div>
					</div>
				)}

				{/* Form Unggah Dokumen (Hanya untuk Member) */}
				{user && user.role === "member" && (
					<form
						onSubmit={handleDocumentUpload}
						className="bg-white rounded-xl shadow-lg p-6"
					>
						<h2 className="text-xl font-bold text-gray-800 mb-4">
							Unggah Dokumen Pendukung
						</h2>
						<div className="space-y-4">
							<DocumentUploadField
								docType="kk"
								docUrl={profile?.kk_url}
								label="Kartu Keluarga (KK)"
								onFileChange={handleDocumentChange}
								fileName={documents.kk?.name}
								onDelete={handleDocumentDelete}
							/>
							<DocumentUploadField
								docType="akte"
								docUrl={profile?.akte_url}
								label="Akte Lahir"
								onFileChange={handleDocumentChange}
								fileName={documents.akte?.name}
								onDelete={handleDocumentDelete}
							/>
							<DocumentUploadField
								docType="biodata"
								docUrl={profile?.biodata_url}
								label="Biodata"
								onFileChange={handleDocumentChange}
								fileName={documents.biodata?.name}
								onDelete={handleDocumentDelete}
							/>
						</div>
						<div className="text-right mt-6">
							<button
								type="submit"
								className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg"
							>
								Unggah Dokumen Terpilih
							</button>
						</div>
					</form>
				)}

				{user && user.role === "member" && (
					<>
						<AddAchievementForm refetch={triggerRefetch} />

						<div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
							<h2 className="text-xl font-bold text-primary mb-4">
								Prestasi Saya
							</h2>
							<div className="space-y-3 max-h-[80vh] overflow-y-auto pr-2">
								{achievements.length > 0 ? (
									achievements.map((ach) => (
										<AchievementItem
											key={ach.id}
											achievement={ach}
											onUpdate={handleUpdateAchievement}
											onDelete={handleDeleteAchievement}
										/>
									))
								) : (
									<p className="text-sm text-gray-500">
										Belum ada prestasi yang ditambahkan.
									</p>
								)}
							</div>
						</div>
					</>
				)}

				{/* Kompetencies Section untuk Admin Cabang */}
				{user && user.role === "admin_cabang" && (
					<>
						<AddCompetencyForm refetch={triggerRefetch} />

						<div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
							<h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
								<FiAward /> Kompetensi & Sertifikasi Saya
							</h2>
							<div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
								{competencies.length > 0 ? (
									competencies.map((comp) => (
										<CompetencyItem
											key={comp.id}
											competency={comp}
											onUpdate={handleUpdateCompetency}
											onDelete={handleDeleteCompetency}
										/>
									))
								) : (
									<p className="text-sm text-gray-500 text-center py-8">
										Belum ada kompetensi yang ditambahkan.
									</p>
								)}
							</div>
						</div>
					</>
				)}

				{/* Password Section */}
				<form
					onSubmit={handlePasswordChange}
					className="bg-white rounded-xl shadow-lg p-6"
				>
					<h2 className="text-xl font-bold text-gray-800 mb-4">
						Ubah Password
					</h2>
					<div className="space-y-4">
						<PasswordField
							label="Password Saat Ini"
							value={passwords.current}
							isVisible={passwordVisibility.current}
							onToggle={() => togglePasswordVisibility("current")}
							onChange={(e) =>
								setPasswords((p) => ({ ...p, current: e.target.value }))
							}
						/>
						<PasswordField
							label="Password Baru"
							value={passwords.new}
							isVisible={passwordVisibility.new}
							onToggle={() => togglePasswordVisibility("new")}
							onChange={(e) =>
								setPasswords((p) => ({ ...p, new: e.target.value }))
							}
						/>
						<PasswordField
							label="Konfirmasi Password Baru"
							value={passwords.confirm}
							isVisible={passwordVisibility.confirm}
							onToggle={() => togglePasswordVisibility("confirm")}
							onChange={(e) =>
								setPasswords((p) => ({ ...p, confirm: e.target.value }))
							}
						/>
					</div>
					<div className="text-right mt-6">
						<button
							type="submit"
							className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg"
						>
							Ubah Password
						</button>
					</div>
				</form>
				<button
					onClick={handleLogout}
					className="px-4 py-2 w-full  bg-secondary text-white text-sm font-semibold rounded-lg disabled:bg-gray-400"
				>
					Logout
				</button>
			</div>
		</div>
	);
};

// Komponen helper untuk input field biasa
const InputField = ({ icon, label, ...props }) => (
	<div>
		<label className="block text-sm font-medium text-gray-700 mb-1">
			{label}
		</label>
		<div className="relative">
			<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
				{icon}
			</span>
			<input
				{...props}
				className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-secondary"
			/>
		</div>
	</div>
);

const TextareaField = ({ icon, label, ...props }) => (
	<div>
		<label className="block text-sm font-medium text-gray-700 mb-1">
			{label}
		</label>
		<div className="relative">
			<span className="absolute top-3 left-0 flex items-center pl-3 text-gray-400">
				{icon}
			</span>
			<textarea
				{...props}
				rows="3"
				className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-secondary"
			/>
		</div>
	</div>
);

// Komponen helper khusus untuk input password dengan tombol view/hide
const PasswordField = ({ label, value, onChange, isVisible, onToggle }) => (
	<div>
		<label className="block text-sm font-medium text-gray-700 mb-1">
			{label}
		</label>
		<div className="relative">
			<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
				<FiLock />
			</span>
			<input
				type={isVisible ? "text" : "password"}
				value={value}
				onChange={onChange}
				className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-secondary"
			/>
			<button
				type="button"
				onClick={onToggle}
				className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
			>
				{isVisible ? <FaEyeSlash /> : <FaEye />}
			</button>
		</div>
	</div>
);

export default ProfileSettingsPage;
