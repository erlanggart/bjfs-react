// File: src/pages/admin/MatchEditorPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select/async";
import { FiPlus, FiTrash2, FiSave, FiAward, FiX } from "react-icons/fi";

// Komponen untuk dropdown pencarian member (tidak berubah)
const SearchableMemberSelect = ({ value, onChange }) => {
	const loadOptions = (inputValue, callback) => {
		setTimeout(async () => {
			try {
				const response = await axios.get(
					"/api/admin/matches/list_members_for_lineup.php",
					{ params: { search: inputValue } }
				);
				const options = response.data.map((member) => ({
					value: member.id,
					label: `${member.full_name} (${member.branch_name})`,
					member: member,
				}));
				callback(options);
			} catch (error) {
				console.error("Gagal memuat member", error);
				callback([]);
			}
		}, 500);
	};
	const customStyles = { menuPortal: (base) => ({ ...base, zIndex: 9999 }) };
	return (
		<Select
			cacheOptions
			loadOptions={loadOptions}
			defaultOptions
			isClearable
			value={value}
			onChange={onChange}
			placeholder="Ketik untuk mencari member..."
			menuPortalTarget={document.body}
			styles={customStyles}
		/>
	);
};

// Komponen untuk mengelola lineup satu tim (tidak berubah)
const LineupInput = ({ teamName, lineup, setLineup }) => {
	const addPlayer = () =>
		setLineup([
			...lineup,
			{
				id: `temp-${Date.now()}`,
				player_name: "",
				member_id: null,
				is_bjfs_player: 0,
			},
		]);
	const removePlayer = (id) => setLineup(lineup.filter((p) => p.id !== id));
	const handlePlayerChange = (index, selectedOption) => {
		const updatedLineup = [...lineup];
		const player = updatedLineup[index];
		if (selectedOption) {
			player.member_id = selectedOption.value;
			player.player_name = selectedOption.member.full_name;
			player.is_bjfs_player = 1;
		} else {
			player.member_id = null;
			player.is_bjfs_player = 0;
		}
		setLineup(updatedLineup);
	};
	const handleNameChange = (index, newName) => {
		const updatedLineup = [...lineup];
		updatedLineup[index].player_name = newName;
		setLineup(updatedLineup);
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow-sm border">
			<h3 className="font-bold text-lg text-primary mb-3">
				Lineup {teamName || "Tim"}
			</h3>
			<div className="space-y-3 max-h-96 overflow-y-auto pr-2">
				{lineup.map((player, index) => (
					<div
						key={player.id}
						className="p-2 border rounded-md bg-gray-50 flex items-start gap-2"
					>
						<div className="flex-grow space-y-2">
							<SearchableMemberSelect
								value={
									player.member_id
										? { value: player.member_id, label: player.player_name }
										: null
								}
								onChange={(selectedOption) =>
									handlePlayerChange(index, selectedOption)
								}
							/>
							<input
								type="text"
								placeholder="Nama Pemain (jika bukan member)"
								value={player.player_name}
								onChange={(e) => handleNameChange(index, e.target.value)}
								disabled={!!player.is_bjfs_player}
								required
								className="w-full p-2 border rounded-md text-sm disabled:bg-gray-200"
							/>
						</div>
						<button
							type="button"
							onClick={() => removePlayer(player.id)}
							className="p-2 text-red-500 hover:bg-red-100 rounded-full mt-1"
						>
							<FiTrash2 />
						</button>
					</div>
				))}
			</div>
			<button
				type="button"
				onClick={addPlayer}
				className="mt-3 w-full flex items-center justify-center gap-2 text-sm py-2 px-3 bg-blue-100 text-blue-700 font-semibold rounded-md hover:bg-blue-200"
			>
				<FiPlus /> Tambah Pemain
			</button>
		</div>
	);
};

// Halaman utama
const MatchEditorPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	// PERBAIKAN: Logika yang benar untuk menentukan mode edit.
	// Hanya anggap mode edit jika 'id' ada DAN bukan string 'new'.
	const isEditMode = id && id !== "new";

	const [formData, setFormData] = useState({
		event_name: "",
		team_a_name: "Bogor Junior FS",
		team_b_name: "",
		score_a: 0,
		score_b: 0,
		match_date: new Date().toISOString().slice(0, 10),
	});
	const [photos, setPhotos] = useState([]);
	const [photoPreviews, setPhotoPreviews] = useState([]);
	const [existingPhotos, setExistingPhotos] = useState([]);
	const [photosToDelete, setPhotosToDelete] = useState([]);
	const [lineupA, setLineupA] = useState([]);
	const [lineupB, setLineupB] = useState([]);
	const [scorers, setScorers] = useState([]);
	const [loading, setLoading] = useState(isEditMode);

	useEffect(() => {
		if (isEditMode) {
			axios
				.get(`/api/admin/matches/detail.php?id=${id}`)
				.then((res) => {
					// ================================================
					// --- TAMBAHKAN DEBUG DI SINI ---
					// ================================================
					console.log("Data diterima dari API:", res.data);
					// ================================================

					const { match_info, lineups, scorers, photos } = res.data;
					setFormData({
						...match_info,
						match_date: match_info.match_date.split(" ")[0],
					});
					setExistingPhotos(photos);

					const lineupDataA = lineups.filter(
						(p) => p.team_name === match_info.team_a_name
					);
					const lineupDataB = lineups.filter(
						(p) => p.team_name === match_info.team_b_name
					);
					setLineupA(lineupDataA);
					setLineupB(lineupDataB);

					const scorerData = scorers.map((s) => ({
						id: `scorer-${s.lineup_id}-${Math.random()}`,
						lineup_player_id: s.lineup_id,
						goals: s.goals_scored,
					}));
					setScorers(scorerData);
				})
				.catch((err) =>
					Swal.fire("Error", "Gagal memuat data pertandingan.", "error")
				)
				.finally(() => setLoading(false));
		}
	}, [id, isEditMode]);

	const allPlayers = useMemo(
		() => [...lineupA, ...lineupB],
		[lineupA, lineupB]
	);

	const addScorer = () =>
		setScorers([
			...scorers,
			{ id: `temp-scorer-${Date.now()}`, lineup_player_id: "", goals: 1 },
		]);
	const removeScorer = (index) =>
		setScorers(scorers.filter((_, i) => i !== index));
	const handleScorerChange = (index, field, value) => {
		const updatedScorers = [...scorers];
		updatedScorers[index][field] = value;
		setScorers(updatedScorers);
	};

	const handleChange = (e) =>
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

	const handlePhotoChange = (e) => {
		const files = Array.from(e.target.files);
		setPhotos((prev) => [...prev, ...files]);
		const previews = files.map((file) => URL.createObjectURL(file));
		setPhotoPreviews((prev) => [...prev, ...previews]);
	};

	const handleRemoveNewPhoto = (indexToRemove) => {
		setPhotos(photos.filter((_, index) => index !== indexToRemove));
		setPhotoPreviews(
			photoPreviews.filter((_, index) => index !== indexToRemove)
		);
	};

	const handleRemoveExistingPhoto = (photoId) => {
		setExistingPhotos(existingPhotos.filter((p) => p.id !== photoId));
		setPhotosToDelete([...photosToDelete, photoId]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const data = new FormData();
		Object.keys(formData).forEach((key) => data.append(key, formData[key]));

		photos.forEach((photo) => data.append("photos[]", photo));

		const cleanLineup = (lineup) =>
			lineup.map((p) => ({
				id: p.id,
				player_name: p.player_name,
				member_id: p.member_id,
				is_bjfs_player: p.is_bjfs_player,
			}));
		data.append("lineup_a", JSON.stringify(cleanLineup(lineupA)));
		data.append("lineup_b", JSON.stringify(cleanLineup(lineupB)));
		data.append("scorers", JSON.stringify(scorers));

		if (isEditMode) {
			data.append("id", id);
			data.append("photos_to_delete", JSON.stringify(photosToDelete));
		}

		const url = isEditMode
			? "/api/admin/matches/update.php"
			: "/api/admin/matches/create.php";

		try {
			await axios.post(url, data, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			Swal.fire(
				"Berhasil!",
				`Data pertandingan telah ${isEditMode ? "diperbarui" : "disimpan"}.`,
				"success"
			);
			navigate("/admin/pertandingan");
		} catch (error) {
			Swal.fire(
				"Gagal!",
				error.response?.data?.message || "Gagal menyimpan data.",
				"error"
			);
		} finally {
			setLoading(false);
		}
	};

	if (loading && isEditMode) {
		return <p className="text-center p-10">Memuat data pertandingan...</p>;
	}

	return (
		<div className="p-4 sm:p-6">
			<h1 className="text-2xl font-bold text-gray-800 mb-6">
				{isEditMode
					? "Edit Data Pertandingan"
					: "Tambah Data Pertandingan Baru"}
			</h1>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="bg-white p-6 rounded-lg shadow-sm">
					<h2 className="font-bold text-lg mb-4">Informasi Pertandingan</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<input
							name="event_name"
							value={formData.event_name}
							onChange={handleChange}
							placeholder="Nama Event/Turnamen"
							required
							className="p-2 border rounded-md"
						/>
						<input
							name="match_date"
							type="date"
							value={formData.match_date}
							onChange={handleChange}
							required
							className="p-2 border rounded-md"
						/>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg shadow-sm">
					<h2 className="font-bold text-lg mb-4">Skor Akhir</h2>
					<div className="flex items-center justify-center gap-4 flex-wrap">
						<input
							name="team_a_name"
							value={formData.team_a_name}
							onChange={handleChange}
							className="p-2 border rounded-md text-center font-semibold flex-grow"
						/>
						<input
							name="score_a"
							type="number"
							value={formData.score_a}
							onChange={handleChange}
							className="w-20 p-2 border rounded-md text-center text-2xl font-bold"
						/>
						<span className="text-2xl font-bold">:</span>
						<input
							name="score_b"
							type="number"
							value={formData.score_b}
							onChange={handleChange}
							className="w-20 p-2 border rounded-md text-center text-2xl font-bold"
						/>
						<input
							name="team_b_name"
							value={formData.team_b_name}
							onChange={handleChange}
							placeholder="Nama Tim Lawan"
							required
							className="p-2 border rounded-md text-center font-semibold flex-grow"
						/>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg shadow-sm">
					<h2 className="font-bold text-lg mb-4">Susunan Pemain (Lineup)</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<LineupInput
							teamName={formData.team_a_name}
							lineup={lineupA}
							setLineup={setLineupA}
						/>
						<LineupInput
							teamName={formData.team_b_name}
							lineup={lineupB}
							setLineup={setLineupB}
						/>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg shadow-sm">
					<h2 className="font-bold text-lg mb-4">Dokumentasi Foto</h2>
					{existingPhotos.length > 0 && (
						<div className="mb-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
							{existingPhotos.map((photo) => (
								<div key={photo.id} className="relative">
									<img
										src={photo.photo_url}
										alt="Dokumentasi"
										className="w-full h-32 object-cover rounded-lg"
									/>
									<button
										type="button"
										onClick={() => handleRemoveExistingPhoto(photo.id)}
										className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
									>
										<FiX size={12} />
									</button>
								</div>
							))}
						</div>
					)}
					<input
						type="file"
						multiple
						accept="image/*"
						onChange={handlePhotoChange}
						className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
					/>
					{photoPreviews.length > 0 && (
						<div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
							{photoPreviews.map((preview, index) => (
								<div key={index} className="relative">
									<img
										src={preview}
										alt={`Preview ${index + 1}`}
										className="w-full h-32 object-cover rounded-lg"
									/>
									<button
										type="button"
										onClick={() => handleRemoveNewPhoto(index)}
										className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
									>
										<FiX size={12} />
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="bg-white p-6 rounded-lg shadow-sm">
					<h2 className="font-bold text-lg mb-4 flex items-center gap-2">
						<FiAward /> Pencetak Gol
					</h2>
					<div className="space-y-2">
						{scorers.map((scorer, index) => (
							<div key={scorer.id} className="flex items-center gap-2">
								<select
									value={scorer.lineup_player_id}
									onChange={(e) =>
										handleScorerChange(
											index,
											"lineup_player_id",
											e.target.value
										)
									}
									className="w-full p-2 border rounded-md"
								>
									<option value="">-- Pilih Pemain --</option>
									{allPlayers.map((p) => (
										<option key={p.id} value={p.id}>
											{p.player_name}
										</option>
									))}
								</select>
								<input
									type="number"
									value={scorer.goals}
									onChange={(e) =>
										handleScorerChange(index, "goals", e.target.value)
									}
									className="w-20 p-2 border rounded-md text-center"
									min="1"
								/>
								<button
									type="button"
									onClick={() => removeScorer(index)}
									className="p-2 text-red-500 hover:bg-red-100 rounded-full"
								>
									<FiTrash2 />
								</button>
							</div>
						))}
					</div>
					<button
						type="button"
						onClick={addScorer}
						className="mt-3 w-full flex items-center justify-center gap-2 text-sm py-2 px-3 bg-green-100 text-green-700 font-semibold rounded-md hover:bg-green-200"
					>
						<FiPlus /> Tambah Pencetak Gol
					</button>
				</div>

				<div className="text-right">
					<button
						type="submit"
						disabled={loading}
						className="px-6 py-2 bg-secondary text-white font-semibold rounded-lg flex items-center gap-2"
					>
						<FiSave /> {loading ? "Menyimpan..." : "Simpan Perubahan"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default MatchEditorPage;
