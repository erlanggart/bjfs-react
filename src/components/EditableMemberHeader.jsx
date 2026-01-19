import React, { useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import {
	FiEdit,
	FiSave,
	FiX,
	FiPhone,
	FiCalendar,
	FiUser,
	FiDollarSign,
	FiUserPlus,
	FiShield,
	FiMapPin,
} from "react-icons/fi";
import { calculateMembershipDuration } from "../utils/memberUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditableMemberHeader = ({ memberInfo, refetch }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		full_name: memberInfo.full_name,
		phone_number: memberInfo.phone_number || "",
		date_of_birth: memberInfo.date_of_birth
			? memberInfo.date_of_birth.split("T")[0]
			: "",
		birth_place: memberInfo.birth_place || "",
		position: memberInfo.position || "Pemain",
		registration_date: memberInfo.registration_date
			? memberInfo.registration_date.split("T")[0]
			: "",
		last_payment_date: memberInfo.last_payment_date
			? memberInfo.last_payment_date.split("T")[0]
			: "",
	});
	const [loading, setLoading] = useState(false);

	const handleSave = async () => {
		setLoading(true);
		try {
			const payload = { ...formData };

			// Convert date format YYYY-MM-DD to proper format for MySQL
			if (payload.date_of_birth && payload.date_of_birth !== "") {
				payload.date_of_birth = payload.date_of_birth; // Keep YYYY-MM-DD format
			} else {
				payload.date_of_birth = null;
			}

			if (payload.registration_date && payload.registration_date !== "") {
				payload.registration_date = payload.registration_date; // Keep YYYY-MM-DD format
			} else {
				payload.registration_date = null;
			}

			if (payload.last_payment_date && payload.last_payment_date !== "") {
				payload.last_payment_date = payload.last_payment_date; // Keep YYYY-MM-DD format
			} else {
				payload.last_payment_date = null;
			}

			console.log("Sending payload:", payload); // Debug log

			await api.put(`/api/members/update/${memberInfo.id}`, payload);
			Swal.fire("Berhasil!", "Data member telah diperbarui.", "success");
			setIsEditing(false);
			refetch();
		} catch (err) {
			console.error("Update error:", err.response?.data); // Debug log
			Swal.fire(
				"Gagal!",
				err.response?.data?.message || "Gagal memperbarui data.",
				"error",
			);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setFormData({
			full_name: memberInfo.full_name,
			phone_number: memberInfo.phone_number || "",
			date_of_birth: memberInfo.date_of_birth
				? memberInfo.date_of_birth.split("T")[0]
				: "",
			birth_place: memberInfo.birth_place || "",
			position: memberInfo.position || "Pemain",
			registration_date: memberInfo.registration_date
				? memberInfo.registration_date.split("T")[0]
				: "",
			last_payment_date: memberInfo.last_payment_date
				? memberInfo.last_payment_date.split("T")[0]
				: "",
		});
		setIsEditing(false);
	};

	return (
		<div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl shadow-2xl overflow-hidden mb-6 relative min-h-[600px]">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-10">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage:
							"radial-gradient(circle at 20px 20px, white 1px, transparent 0)",
						backgroundSize: "40px 40px",
					}}
				/>
			</div>

			{/* Content Grid */}
			<div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 min-h-[600px]">
				{/* Left Section - Photo */}
				<div className="flex items-center justify-center relative">
					<div className="relative w-full max-w-md">
						<img
							src={
								memberInfo.avatar
									? `${API_BASE_URL}${memberInfo.avatar}`
									: `https://placehold.co/400x400/1F2937/FFFFFF?text=${memberInfo.full_name.charAt(0)}`
							}
							alt={memberInfo.full_name}
							className="w-full aspect-square object-cover rounded-2xl relative z-10"
							style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.5))" }}
						/>
					</div>
				</div>

				{/* Right Section - Statistics */}
				<div className="flex flex-col justify-center z-10">
					<div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/10">
						{" "}
						{/* Name & Position Header */}
						<div className="mb-6 pb-6 border-b border-white/10">
							<h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">
								{memberInfo.full_name}
							</h1>
							<div className="flex gap-2 items-center text-gray-300 font-semibold uppercase tracking-wide">
								<p className="text-sm">Username | </p> {memberInfo.username}
							</div>
						</div>
						<h2 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-6">
							Data Member
						</h2>
						{isEditing ? (
							<div className="space-y-4">
								<div>
									<label className="block text-xs font-medium text-white/80 mb-2 uppercase tracking-wide">
										Nama Lengkap
									</label>
									<input
										type="text"
										value={formData.full_name}
										onChange={(e) =>
											setFormData({ ...formData, full_name: e.target.value })
										}
										className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-xs font-medium text-white/80 mb-2 uppercase tracking-wide">
											Tempat Lahir
										</label>
										<input
											type="text"
											value={formData.birth_place}
											onChange={(e) =>
												setFormData({
													...formData,
													birth_place: e.target.value,
												})
											}
											placeholder="Contoh: Jakarta"
											className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>

									<div>
										<label className="block text-xs font-medium text-white/80 mb-2 uppercase tracking-wide">
											Tanggal Lahir
										</label>
										<input
											type="date"
											value={formData.date_of_birth}
											onChange={(e) =>
												setFormData({
													...formData,
													date_of_birth: e.target.value,
												})
											}
											className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-xs font-medium text-white/80 mb-2 uppercase tracking-wide">
											Nomor Telepon
										</label>
										<input
											type="text"
											value={formData.phone_number}
											onChange={(e) =>
												setFormData({
													...formData,
													phone_number: e.target.value,
												})
											}
											className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>

									<div>
										<label className="block text-xs font-medium text-white/80 mb-2 uppercase tracking-wide">
											Posisi
										</label>
										<select
											value={formData.position}
											onChange={(e) =>
												setFormData({ ...formData, position: e.target.value })
											}
											className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										>
											<option value="Pemain">Pemain</option>
											<option value="Kiper">Kiper</option>
										</select>
									</div>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-xs font-medium text-white/80 mb-2 uppercase tracking-wide">
											Registrasi
										</label>
										<input
											type="date"
											value={formData.registration_date}
											onChange={(e) =>
												setFormData({
													...formData,
													registration_date: e.target.value,
												})
											}
											className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>

									<div>
										<label className="block text-xs font-medium text-white/80 mb-2 uppercase tracking-wide">
											Pembayaran
										</label>
										<input
											type="date"
											value={formData.last_payment_date}
											onChange={(e) =>
												setFormData({
													...formData,
													last_payment_date: e.target.value,
												})
											}
											className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
								</div>
							</div>
						) : (
							<div className="space-y-3">
								{/* Birthplace */}
								<div className="flex justify-between items-center py-3 border-b border-white/10">
									<span className="text-xs lg:text-sm font-medium text-white/60 uppercase tracking-widest">
										Tempat Lahir
									</span>
									<span className="text-sm lg:text-lg font-bold text-white">
										{memberInfo.birth_place || "-"}
									</span>
								</div>

								{/* DOB */}
								<div className="flex justify-between items-center py-3 border-b border-white/10">
									<span className="text-xs lg:text-sm font-medium text-white/60 uppercase tracking-widest">
										Tanggal Lahir
									</span>
									<span className="text-sm lg:text-lg font-bold text-white">
										{memberInfo.date_of_birth
											? new Date(memberInfo.date_of_birth).toLocaleDateString(
													"id-ID",
													{
														day: "numeric",
														month: "short",
														year: "numeric",
													},
												)
											: "-"}
									</span>
								</div>

								{/* Age */}
								<div className="flex justify-between items-center py-3 border-b border-white/10">
									<span className="text-xs lg:text-sm font-medium text-white/60 uppercase tracking-widest">
										Usia
									</span>
									<span className="text-sm lg:text-lg font-bold text-white">
										{memberInfo.date_of_birth
											? (() => {
													const today = new Date();
													const birthDate = new Date(memberInfo.date_of_birth);
													let age =
														today.getFullYear() - birthDate.getFullYear();
													const monthDiff =
														today.getMonth() - birthDate.getMonth();
													if (
														monthDiff < 0 ||
														(monthDiff === 0 &&
															today.getDate() < birthDate.getDate())
													) {
														age--;
													}
													return `${age} years`;
												})()
											: "-"}
									</span>
								</div>

								{/* Position */}
								<div className="flex justify-between items-center py-3 border-b border-white/10">
									<span className="text-xs lg:text-sm font-medium text-white/60 uppercase tracking-widest">
										Possisi
									</span>
									<span className="text-sm lg:text-lg font-bold text-white">
										{memberInfo.position || "Pemain"}
									</span>
								</div>

								{/* Phone */}
								<div className="flex justify-between items-center py-3 border-b border-white/10">
									<span className="text-xs lg:text-sm font-medium text-white/60 uppercase tracking-widest">
										Nomor Telepon
									</span>
									<span className="text-sm lg:text-lg font-bold text-white">
										{memberInfo.phone_number || "-"}
									</span>
								</div>

								{/* Branch */}
								<div className="flex justify-between items-center py-3 border-b border-white/10">
									<span className="text-xs lg:text-sm font-medium text-white/60 uppercase tracking-widest">
										Cabang
									</span>
									<span className="text-sm lg:text-lg font-bold text-white">
										{memberInfo.branch_name || "-"}
									</span>
								</div>

								{/* Joined */}
								<div className="flex justify-between items-center py-3 border-b border-white/10">
									<span className="text-xs lg:text-sm font-medium text-white/60 uppercase tracking-widest">
										Registrasi
									</span>
									<span className="text-sm lg:text-lg font-bold text-white">
										{memberInfo.registration_date
											? new Date(
													memberInfo.registration_date,
												).toLocaleDateString("id-ID", {
													day: "numeric",
													month: "short",
													year: "numeric",
												})
											: "-"}
									</span>
								</div>

								{/* Membership Duration */}
								<div className="flex justify-between items-center py-3 border-b border-white/10">
									<span className="text-xs lg:text-sm font-medium text-white/60 uppercase tracking-widest">
										Membership
									</span>
									<span className="text-sm lg:text-lg font-bold text-white">
										{calculateMembershipDuration(memberInfo.registration_date)}
									</span>
								</div>

								{/* Last Payment */}
								<div className="flex justify-between items-center py-3 border-b border-white/10">
									<span className="text-xs lg:text-sm font-medium text-white/60 uppercase tracking-widest">
										Pembayaran Terakhir
									</span>
									<span className="text-sm lg:text-lg font-bold text-white">
										{memberInfo.last_payment_date
											? new Date(
													memberInfo.last_payment_date,
												).toLocaleDateString("id-ID", {
													day: "numeric",
													month: "short",
													year: "numeric",
												})
											: "Never"}
									</span>
								</div>

								{/* Status */}
								<div className="flex justify-between items-center py-3">
									<span className="text-xs lg:text-sm font-medium text-white/60 uppercase tracking-widest">
										Status
									</span>
									<span
										className={`text-sm lg:text-lg font-bold px-3 py-1 rounded-full ${
											memberInfo.status === "active"
												? "bg-green-500/20 text-green-400"
												: "bg-gray-500/20 text-gray-400"
										}`}
									>
										{memberInfo.status === "active" ? "Active" : "Inactive"}
									</span>
								</div>
							</div>
						)}
						{/* Action Buttons */}
						<div className="mt-6 pt-6 border-t border-white/10">
							{!isEditing ? (
								<button
									onClick={() => setIsEditing(true)}
									className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 uppercase tracking-wider text-sm shadow-lg border-2 border-white/10"
								>
									Edit Profile
								</button>
							) : (
								<div className="flex gap-3">
									<button
										onClick={handleCancel}
										disabled={loading}
										className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition duration-200 uppercase tracking-wider text-sm border border-white/20 disabled:opacity-50"
									>
										Cancel
									</button>
									<button
										onClick={handleSave}
										disabled={loading}
										className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 uppercase tracking-wider text-sm shadow-lg border-2 border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{loading ? "Saving..." : "Save"}
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditableMemberHeader;
