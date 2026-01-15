// File: src/pages/admin/MatchManagementPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiPlus, FiEye, FiTrash2, FiEdit } from "react-icons/fi";
import Swal from "sweetalert2";

const MatchManagementPage = () => {
	const [matches, setMatches] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchMatches = useCallback(async () => {
		setLoading(true);
		try {
			// Gunakan parameter ?all=true untuk mendapatkan semua data
			const response = await axios.get("/api/public/list_matches.php?all=true");
			setMatches(response.data);
		} catch (error) {
			console.error("Gagal memuat pertandingan", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchMatches();
	}, [fetchMatches]);

	const handleDelete = (match) => {
		Swal.fire({
			title: `Hapus Pertandingan Ini?`,
			text: `${match.team_a_name} vs ${match.team_b_name} (${match.event_name})`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Ya, hapus!",
			cancelButtonText: "Batal",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await axios.post("/api/admin/matches/delete.php", { id: match.id });
					Swal.fire("Terhapus!", "Data pertandingan telah dihapus.", "success");
					fetchMatches(); // Muat ulang daftar setelah berhasil menghapus
				} catch (error) {
					Swal.fire("Gagal!", "Gagal menghapus data pertandingan.", "error");
				}
			}
		});
	};

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Manajemen Pertandingan</h1>
				<Link
					to="/admin/pertandingan/new"
					className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg"
				>
					<FiPlus /> Tambah Pertandingan
				</Link>
			</div>
			<div className="bg-white rounded-lg shadow-md overflow-x-auto">
				<table className="w-full text-sm text-left">
					<thead className="bg-gray-50">
						<tr>
							<th className="p-3">Event</th>
							<th className="p-3">Pertandingan</th>
							<th className="p-3">Skor</th>
							<th className="p-3">Tanggal</th>
							<th className="p-3">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan="5" className="text-center p-4">
									Memuat...
								</td>
							</tr>
						) : (
							matches.map((match) => (
								<tr key={match.id} className="border-b hover:bg-gray-50">
									<td className="p-3">{match.event_name}</td>
									<td className="p-3 font-semibold">
										{match.team_a_name} vs {match.team_b_name}
									</td>
									<td className="p-3 font-bold">
										{match.score_a} - {match.score_b}
									</td>
									<td className="p-3">
										{new Date(match.match_date).toLocaleDateString("id-ID")}
									</td>
									<td className="p-3 flex gap-2">
										<Link
											to={`/pertandingan/${match.id}`}
											target="_blank"
											className="text-blue-600 hover:text-blue-800 p-1"
											title="Lihat Halaman Publik"
										>
											<FiEye />
										</Link>
										<Link
											to={`/admin/pertandingan/edit/${match.id}`}
											className="text-green-600 hover:text-green-800 p-1"
											title="Edit"
										>
											<FiEdit />
										</Link>
										<button
											onClick={() => handleDelete(match)}
											className="text-red-600 hover:text-red-800 p-1"
											title="Hapus"
										>
											<FiTrash2 />
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default MatchManagementPage;
