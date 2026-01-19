import React, { useState } from "react";
import Swal from "sweetalert2";
import api from "../../services/api";

const AddAchievementForm = ({ refetch }) => {
	const [name, setName] = useState("");
	const [date, setDate] = useState("");
	const [notes, setNotes] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await api.post("/api/members/achievements", {
				achievement_name: name,
				event_date: date,
				notes: notes,
			});
			Swal.fire("Sukses!", "Prestasi baru berhasil ditambahkan.", "success");
			setName("");
			setDate("");
			setNotes("");
			refetch();
		} catch {
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

export default AddAchievementForm;
