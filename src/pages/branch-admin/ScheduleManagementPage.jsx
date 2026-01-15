// File: src/pages/branch-admin/ScheduleManagementPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiPlus, FiEdit, FiClock, FiPower } from "react-icons/fi";
import { Link } from "react-router-dom";

// Komponen Modal (bisa dibuat di file terpisah)
const ScheduleModal = ({ isOpen, onClose, refetch, scheduleData }) => {
	const isEditMode = !!scheduleData;
	const [formData, setFormData] = useState({
		age_group: "",
		day_of_week: "Senin",
		start_time: "16:00",
		end_time: "17:30",
		location: "",
		min_age: "",
		max_age: "", // Tambahkan state baru
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (isEditMode) {
			setFormData({
				age_group: scheduleData.age_group,
				day_of_week: scheduleData.day_of_week,
				start_time: scheduleData.start_time,
				end_time: scheduleData.end_time,
				location: scheduleData.location || "",
				min_age: scheduleData.min_age || "", // Isi data usia
				max_age: scheduleData.max_age || "",
			});
		} else {
			// Reset form untuk mode tambah
			setFormData({
				age_group: "",
				day_of_week: "Senin",
				start_time: "16:00",
				end_time: "17:30",
				location: "",
				min_age: "",
				max_age: "",
			});
		}
	}, [scheduleData, isEditMode]);

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const url = isEditMode
			? "/api/schedules/update.php"
			: "/api/schedules/create.php";
		const payload = isEditMode
			? { ...formData, id: scheduleData.id }
			: formData;

		try {
			await axios.post(url, payload);
			Swal.fire(
				"Berhasil!",
				`Jadwal telah berhasil ${isEditMode ? "diperbarui" : "dibuat"}.`,
				"success"
			);
			refetch();
			onClose();
		} catch (err) {
			Swal.fire(
				"Gagal!",
				err.response?.data?.message || "Terjadi kesalahan.",
				"error"
			);
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<h2 className="text-xl font-bold mb-4">
					{isEditMode ? "Edit Jadwal" : "Tambah Jadwal Baru"}
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						name="age_group"
						value={formData.age_group}
						onChange={handleChange}
						placeholder="Nama Kelompok (e.g., U-12)"
						required
						className="w-full p-2 border rounded"
					/>

					{/* Input Rentang Usia BARU */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-xs">Usia Min (Opsional)</label>
							<input
								name="min_age"
								type="number"
								value={formData.min_age}
								onChange={handleChange}
								placeholder="Contoh: 7"
								className="w-full p-2 border rounded"
							/>
						</div>
						<div>
							<label className="text-xs">Usia Max (Opsional)</label>
							<input
								name="max_age"
								type="number"
								value={formData.max_age}
								onChange={handleChange}
								placeholder="Contoh: 9"
								className="w-full p-2 border rounded"
							/>
						</div>
					</div>
					<p className="text-xs text-gray-500 -mt-2">
						Kosongkan jika jadwal ini untuk semua umur.
					</p>

					<select
						name="day_of_week"
						value={formData.day_of_week}
						onChange={handleChange}
						className="w-full p-2 border rounded"
					>
						{[
							"Senin",
							"Selasa",
							"Rabu",
							"Kamis",
							"Jumat",
							"Sabtu",
							"Minggu",
						].map((day) => (
							<option key={day} value={day}>
								{day}
							</option>
						))}
					</select>
					<div className="flex gap-4">
						<input
							name="start_time"
							type="time"
							value={formData.start_time}
							onChange={handleChange}
							required
							className="w-full p-2 border rounded"
						/>
						<input
							name="end_time"
							type="time"
							value={formData.end_time}
							onChange={handleChange}
							required
							className="w-full p-2 border rounded"
						/>
					</div>
					<input
						name="location"
						value={formData.location}
						onChange={handleChange}
						placeholder="Lokasi Latihan"
						className="w-full p-2 border rounded"
					/>
					<div className="flex justify-end gap-2 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-200 rounded"
						>
							Batal
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-4 py-2 bg-secondary text-white rounded"
						>
							{loading ? "Menyimpan..." : "Simpan"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

const ScheduleManagementPage = () => {
	const [schedules, setSchedules] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingSchedule, setEditingSchedule] = useState(null);

	const fetchSchedules = useCallback(async () => {
		setLoading(true);
		try {
			const response = await axios.get("/api/schedules/list_by_branch.php");
			setSchedules(response.data);
		} catch {
			Swal.fire("Error", "Gagal memuat data jadwal.", "error");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchSchedules();
	}, [fetchSchedules]);

	const handleAdd = () => {
		setEditingSchedule(null);
		setIsModalOpen(true);
	};

	const handleEdit = (schedule) => {
		setEditingSchedule(schedule);
		setIsModalOpen(true);
	};

	const handleToggleStatus = (schedule) => {
		const action = schedule.is_active === 1 ? "nonaktifkan" : "aktifkan";
		const actionPast = schedule.is_active === 1 ? "dinonaktifkan" : "diaktifkan";
		
		Swal.fire({
			title: `${action === "nonaktifkan" ? "Nonaktifkan" : "Aktifkan"} Jadwal?`,
			text: action === "nonaktifkan" 
				? "Jadwal tidak akan muncul di halaman absensi, tapi data absensi lama tetap tersimpan."
				: "Jadwal akan kembali muncul di halaman absensi.",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: action === "nonaktifkan" ? "#d33" : "#10b981",
			confirmButtonText: `Ya, ${action}!`,
			cancelButtonText: "Batal",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await axios.post("/api/schedules/toggle_status.php", { 
						id: schedule.id 
					});
					Swal.fire(
						"Berhasil!", 
						`Jadwal telah ${actionPast}.`, 
						"success"
					);
					fetchSchedules();
				} catch (err) {
					Swal.fire(
						"Gagal!",
						err.response?.data?.message || `Gagal ${action} jadwal.`,
						"error"
					);
				}
			}
		});
	};

	return (
		<div className="p-4 bg-gray-100 min-h-screen">
			<ScheduleModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				refetch={fetchSchedules}
				scheduleData={editingSchedule}
			/>

			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Manajemen Jadwal</h1>
				<button
					onClick={handleAdd}
					className="p-2 bg-secondary text-white rounded-full shadow-lg"
				>
					<FiPlus size={24} />
				</button>
			</div>

			{loading ? (
				<p>Memuat jadwal...</p>
			) : (
				<div className="space-y-3">
					{schedules.length > 0 ? (
						schedules.map((s) => (
							<div
								key={s.id}
								className={`bg-white p-4 rounded-lg shadow-md flex items-center justify-between transition-opacity ${
									s.is_active === 0 ? "opacity-50" : ""
								}`}
							>
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<p className={`font-bold text-lg ${s.is_active === 1 ? "text-primary" : "text-gray-400"}`}>
											{s.age_group} - {s.day_of_week}
										</p>
										<span
											className={`text-xs px-2 py-1 rounded-full font-semibold ${
												s.is_active === 1
													? "bg-green-100 text-green-700"
													: "bg-gray-200 text-gray-600"
											}`}
										>
											{s.is_active === 1 ? "Aktif" : "Nonaktif"}
										</span>
									</div>
									<p className="text-sm text-gray-600 flex items-center gap-2">
										<FiClock size={14} /> {s.start_time.substring(0, 5)} -{" "}
										{s.end_time.substring(0, 5)}
									</p>
									{s.location && (
										<p className="text-xs text-gray-500 mt-1">📍 {s.location}</p>
									)}
								</div>
								<div className="flex gap-2">
									<button
										onClick={() => handleEdit(s)}
										className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
										title="Edit Jadwal"
									>
										<FiEdit size={18} />
									</button>
									<button
										onClick={() => handleToggleStatus(s)}
										className={`p-2 rounded-lg transition-colors ${
											s.is_active === 1
												? "text-orange-600 hover:bg-orange-50"
												: "text-green-600 hover:bg-green-50"
										}`}
										title={s.is_active === 1 ? "Nonaktifkan Jadwal" : "Aktifkan Jadwal"}
									>
										<FiPower size={18} />
									</button>
								</div>
							</div>
						))
					) : (
						<p className="text-center text-gray-500 mt-8">
							Belum ada jadwal. Silakan tambahkan.
						</p>
					)}
				</div>
			)}

			<div className="mt-8 text-center">
				<Link
					to="/absensi"
					className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md"
				>
					Kembali ke Halaman Absensi
				</Link>
			</div>
		</div>
	);
};

export default ScheduleManagementPage;
