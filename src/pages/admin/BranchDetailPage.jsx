// File: src/pages/admin/BranchDetailPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useDebounce } from "use-debounce";
import {
	FiSearch,
	FiPlus,
	FiUserPlus,
	FiTrash2,
	FiToggleLeft,
	FiToggleRight,
	FiClock,
	FiChevronLeft,
	FiChevronRight,
	FiX,
	FiSave,
	FiEdit,
} from "react-icons/fi";
import AddUserModal from "../../components/admin/AddUserModal";
import BranchAttendanceSummary from "../../components/branches/BranchAttendanceSummary";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditableBranchInfo = ({ branchInfo, refetch }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState(branchInfo.name);
	const [address, setAddress] = useState(branchInfo.address || "");
	const [loading, setLoading] = useState(false);
	const [reportTemplate, setReportTemplate] = useState(
		branchInfo.report_template,
	);

	const handleSave = async () => {
		if (!name) {
			Swal.fire("Validasi Gagal", "Nama cabang tidak boleh kosong.", "warning");
			return;
		}
		setLoading(true);
		try {
			await axios.put(`/api/branches/${branchInfo.id}`, {
				id: branchInfo.id,
				name,
				address,
				report_template: reportTemplate,
			});
			Swal.fire("Berhasil!", "Data cabang telah diperbarui.", "success");
			setIsEditing(false);
			refetch(); // Memuat ulang semua data di halaman parent
		} catch (err) {
			Swal.fire(
				"Gagal!",
				err.response?.data?.message || "Gagal memperbarui cabang.",
				"error",
			);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setName(branchInfo.name);
		setAddress(branchInfo.address || "");
		setIsEditing(false);
	};

	return (
		<div className="bg-white text-slate-700 p-6 rounded-lg shadow-md relative">
			{isEditing ? (
				<div>
					<p className="text-sm mb-1">Nama Cabang</p>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full mb-4 bg-slate-100 text-xl font-bold p-2 rounded-md focus:outline-none focus:ring-2 ring-secondary"
					/>
					<p className="text-sm mb-1">Alamat</p>
					<textarea
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						rows="2"
						className="w-full bg-slate-100 text-sm p-2  rounded-md focus:outline-none focus:ring-2 ring-secondary"
						placeholder="Alamat cabang"
					/>
					<div className="mt-2">
						<p className="text-sm mb-1">Tipe Rapor</p>
						<select
							value={reportTemplate}
							onChange={(e) => setReportTemplate(e.target.value)}
							className="w-full bg-slate-100 p-2 rounded-md text-sm"
						>
							<option value="regular">Reguler</option>
							<option value="mastery">Mastery Class</option>
						</select>
					</div>
					<div className="flex justify-end gap-2 mt-4">
						<button
							onClick={handleCancel}
							className="p-2 text-secondary hover:bg-[var(--color-secondary)] hover:text-white rounded"
						>
							<FiX />
						</button>
						<button
							onClick={handleSave}
							disabled={loading}
							className="flex items-center gap-2 px-3 py-1 bg-secondary  text-white rounded-md text-sm font-semibold disabled:opacity-50"
						>
							<FiSave /> {loading ? "Menyimpan..." : "Simpan"}
						</button>
					</div>
				</div>
			) : (
				<div>
					<button
						onClick={() => setIsEditing(true)}
						className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full"
					>
						<FiEdit />
					</button>
					<div className="flex items-center gap-2 mb-2">
						<h2 className="text-xl font-bold ">{branchInfo.name}</h2>
						<p className="font-mono text-xs bg-secondary text-white px-2 py-1 rounded-full inline-block">
							{branchInfo.id}
						</p>
					</div>
					<p className="text-sm">
						{branchInfo.address || "Belum ada alamat terdaftar."}
					</p>
					<p className="text-sm mt-2">
						Tipe Rapor:{" "}
						<strong className="capitalize">{branchInfo.report_template}</strong>
					</p>
				</div>
			)}
		</div>
	);
};

const BranchDetailPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [branchData, setBranchData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
	const [currentPage, setCurrentPage] = useState(1);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalRole, setModalRole] = useState("member");

	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			const response = await axios.get(`/api/branches/detail`, {
				params: { id, page: currentPage, search: debouncedSearchTerm },
			});
			setBranchData(response.data);
		} catch (err) {
			setError("Gagal memuat detail cabang.");
		} finally {
			setLoading(false);
		}
	}, [id, currentPage, debouncedSearchTerm]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearchTerm]);

	const handleOpenModal = (role) => {
		setModalRole(role);
		setIsModalOpen(true);
	};

	const handleRemoveAdmin = (admin) => {
		Swal.fire({
			title: `Hapus Admin ${admin.full_name}?`,
			text: "Tindakan ini akan menghapus akun pengguna secara permanen.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			confirmButtonText: "Ya, hapus!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await axios.post("/api/admin/remove-admin", {
						user_id: admin.user_id,
					});
					Swal.fire("Dihapus!", "Admin telah dihapus.", "success");
					fetchData();
				} catch (err) {
					Swal.fire(
						"Gagal!",
						err.response?.data?.message || "Gagal menghapus admin.",
						"error",
					);
				}
			}
		});
	};

	const handleToggleStatus = async (member) => {
		try {
			await axios.put(`/api/members/toggle-status/${member.id}`, {
				member_id: member.id,
			});
			Swal.fire({
				toast: true,
				position: "top-end",
				showConfirmButton: false,
				timer: 2000,
				icon: "success",
				title: `Status ${member.full_name} diubah`,
			});
			fetchData();
		} catch (err) {
			Swal.fire(
				"Gagal!",
				err.response?.data?.message || "Gagal mengubah status.",
				"error",
			);
		}
	};

	if (loading && !branchData)
		return <p className="p-6">Memuat data cabang...</p>;
	if (error) return <p className="p-6 text-red-500">{error}</p>;
	if (!branchData) return <p className="p-6">Data cabang tidak ditemukan.</p>;

	const { branch_info, admins, schedules, members } = branchData;

	return (
		<div>
			<AddUserModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				role={modalRole}
				refetch={fetchData}
				defaultBranchId={id}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
				{/* Kolom Kiri: Info & Admin */}
				<div className="lg:col-span-2 space-y-6">
					<EditableBranchInfo branchInfo={branch_info} refetch={fetchData} />

					<div className="bg-white p-6 rounded-lg shadow-md">
						<div className="flex justify-between items-center mb-3">
							<h2 className="text-xl font-bold ">Admin Pengelola</h2>
							<button
								onClick={() => handleOpenModal("admin_cabang")}
								className="flex items-center gap-2 text-sm bg-primary text-white hover:bg-[var(--color-secondary)] hover:text-white px-3 py-1 rounded-md"
							>
								<FiUserPlus /> Tambah Admin
							</button>
						</div>
						<div className="space-y-2">
							{admins.length > 0 ? (
								admins.map((admin) => (
									<div
										key={admin.user_id}
										className="flex bg-slate-100 justify-between items-center p-2 rounded-xl"
									>
										<div className="flex items-center gap-3">
											<img
												src={`https://placehold.co/40x40/E0E0E0/757575?text=${admin.full_name.charAt(
													0,
												)}`}
												alt={admin.full_name}
												className="w-10 h-10 rounded-full object-cover "
											/>
											<div className="text-sm ">
												<p className="font-semibold">{admin.full_name}</p>
												<p className="text-xs ">username : {admin.username}</p>
											</div>
										</div>
										<button
											onClick={() => handleRemoveAdmin(admin)}
											className="text-secondary p-3 hover:bg-[var(--color-secondary)] hover:text-white rounded-md transition-colors"
										>
											<FiTrash2 />
										</button>
									</div>
								))
							) : (
								<p className="text-sm text-gray-500">Belum ada admin.</p>
							)}
						</div>
					</div>
				</div>

				{/* Kolom Kanan: Jadwal */}
				<div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-bold mb-3">Jadwal Latihan</h2>
					<div className="space-y-3 max-h-96 overflow-y-auto pr-2">
						{schedules.length > 0 ? (
							schedules.map((schedule) => (
								<div
									key={schedule.id}
									className="p-3 bg-gray-50 rounded-md text-primary "
								>
									<p className="font-bold items-center ">
										{schedule.age_group} - {schedule.day_of_week}
									</p>
									<p className="text-sm flex items-center gap-2">
										<FiClock size={14} /> {schedule.start_time.slice(0, 5)} -{" "}
										{schedule.end_time.slice(0, 5)}
									</p>
								</div>
							))
						) : (
							<p className="text-sm text-gray-500">Belum ada jadwal.</p>
						)}
					</div>
				</div>
			</div>

			{/* Daftar Member */}
			<div className="bg-white p-6 rounded-lg shadow-md">
				<div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
					<h2 className="text-xl font-bold">
						Daftar Member ({members.pagination.totalRecords})
					</h2>
					<div className="flex items-center gap-4 w-full md:w-auto">
						<div className="relative flex-grow">
							<FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								placeholder="Cari member..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 rounded-lg text-slate-500 bg-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
							/>
						</div>
						<button
							onClick={() => handleOpenModal("member")}
							className="flex-shrink-0 flex items-center gap-2 text-sm bg-primary text-white px-3 py-2 rounded-lg font-semibold hover:bg-[var(--color-secondary)]"
						>
							<FiPlus /> Tambah Member
						</button>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-left">
						<tbody>
							{members.data.map((member) => (
								<tr
									key={member.id}
									onClick={() => navigate(`/admin/member/${member.id}`)}
									className="border-b border-slate-200 hover:bg-slate-200 cursor-pointer transition-colors"
								>
									<td className="p-3 flex items-center gap-3">
										<img
											src={
												member.avatar
													? `${API_BASE_URL}${member.avatar}`
													: `https://placehold.co/128x128/E0E0E0/757575?text=${
															member.full_name
																? member.full_name.charAt(0)
																: "U"
														}`
											}
											alt={member.full_name}
											className="w-14 h-14 rounded-full object-cover"
										/>
										<div>
											<p className="font-mono text-xs text-white p-1 bg-secondary rounded inline-block">
												{member.id}
											</p>
											<p className="font-semibold">{member.full_name}</p>
											<p className="font-semibold text-sm text-slate-500">
												{member.username}
											</p>
										</div>
									</td>
									<td className="p-3">
										<div className="flex items-center justify-end gap-2">
											<span
												className={`text-sm font-semibold ${
													member.status === "active"
														? "text-green-500"
														: "text-gray-500"
												}`}
											>
												{member.status === "active" ? "Aktif" : "Nonaktif"}
											</span>
											<button
												onClick={(e) => {
													e.stopPropagation();
													handleToggleStatus(member);
												}}
												className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary ${
													member.status === "active"
														? "bg-green-500"
														: "bg-gray-300"
												}`}
											>
												<span
													className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${
														member.status === "active"
															? "translate-x-6"
															: "translate-x-1"
													}`}
												/>
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{/* Paginasi */}
				{members.pagination.totalPages > 1 && (
					<div className="flex justify-between items-center mt-4 text-white">
						<button
							onClick={() => setCurrentPage((p) => p - 1)}
							disabled={currentPage === 1}
							className="flex items-center gap-2 px-3 py-1 bg-secondary rounded disabled:opacity-50"
						>
							<FiChevronLeft /> Prev
						</button>
						<span className="text-slate-700">
							Halaman {currentPage} dari {members.pagination.totalPages}
						</span>
						<button
							onClick={() => setCurrentPage((p) => p + 1)}
							disabled={currentPage === members.pagination.totalPages}
							className="flex items-center gap-2 px-3 py-1 bg-secondary rounded disabled:opacity-50"
						>
							Next <FiChevronRight />
						</button>
					</div>
				)}
			</div>

			{/* Attendance Summary Section */}
			{branch_info && (
				<BranchAttendanceSummary
					branchId={branch_info.id}
					branchName={branch_info.name}
				/>
			)}
		</div>
	);
};

export default BranchDetailPage;
