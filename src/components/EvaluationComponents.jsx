// File: src/components/EvaluationComponents.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiX } from "react-icons/fi";

// --- Form Rapor Reguler ---
const RegularReportForm = ({ initialData, onSubmit }) => {
	const [scores, setScores] = useState({
		dribbling: "C",
		passing: "B",
		controlling: "C",
		shooting: "C",
		moving: "C",
		game_situation: "C",
		fokus: "B",
		kerjasama: "C",
		komunikasi: "B",
		percaya_diri: "C",
		disiplin: "B",
	});
	const [notes, setNotes] = useState("");
	const grades = ["A", "B", "C"];
	const fields = {
		Teknik: {
			dribbling: "Dribbling",
			passing: "Passing",
			controlling: "Controlling",
			shooting: "Shooting",
			moving: "Moving",
			game_situation: "Game Situation",
		},
		Karakter: {
			fokus: "Fokus",
			kerjasama: "Kerjasama",
			komunikasi: "Komunikasi",
			percaya_diri: "Percaya Diri",
			disiplin: "Disiplin",
		},
	};

	// PERBAIKAN: Gunakan useEffect untuk mengisi form saat data edit tiba
	useEffect(() => {
		if (initialData) {
			setScores(initialData.scores);
			setNotes(initialData.notes);
		}
	}, [initialData]);

	const handleScoreChange = (field, value) => {
		setScores((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit({ scores, notes, type: "regular" });
			}}
			className="space-y-4"
		>
			{Object.entries(fields).map(([category, items]) => (
				<div key={category}>
					<h3 className="font-semibold mb-2 text-primary">{category}</h3>
					{Object.entries(items).map(([key, label]) => (
						<div
							key={key}
							className="flex justify-between items-center mb-2 p-2 rounded-md hover:bg-gray-50"
						>
							<label className="text-sm text-gray-700">{label}</label>
							<div className="flex gap-1">
								{grades.map((grade) => (
									<button
										type="button"
										key={grade}
										onClick={() => handleScoreChange(key, grade)}
										className={`w-8 h-8 text-xs font-bold rounded-md transition-colors ${
											scores[key] === grade
												? "bg-secondary text-white"
												: "bg-gray-200 text-gray-700 hover:bg-gray-300"
										}`}
									>
										{grade}
									</button>
								))}
							</div>
						</div>
					))}
				</div>
			))}
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Catatan Pelatih
				</label>
				<textarea
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					rows="4"
					className="w-full p-2 border rounded-md mt-1"
				></textarea>
			</div>
			<div className="flex justify-end gap-2 pt-2">
				<button
					type="submit"
					className="px-4 py-2 bg-secondary text-white font-semibold rounded-lg"
				>
					Simpan Laporan
				</button>
			</div>
		</form>
	);
};

// --- Form Rapor Mastery Class ---
const MasteryPlayerReportForm = ({ initialData, onSubmit }) => {
	const [scores, setScores] = useState({
		passing: 5,
		control: 5,
		dribbling: 5,
		shooting: 5,
		pemahaman_taktikal: 5,
		fleksibilitas: 5,
		kekuatan: 5,
		kelincahan: 5,
		power: 5,
		kecepatan: 5,
		daya_tahan: 5,
	});
	const [notes, setNotes] = useState("");
	const fields = {
		Teknik: {
			passing: "Passing",
			control: "Control",
			dribbling: "Dribbling",
			shooting: "Shooting",
			pemahaman_taktikal: "Pemahaman Taktikal",
		},
		Fisik: {
			fleksibilitas: "Fleksibilitas",
			kekuatan: "Kekuatan",
			kelincahan: "Kelincahan",
			power: "Power",
			kecepatan: "Kecepatan",
			daya_tahan: "Daya Tahan",
		},
	};

	// PERBAIKAN: Gunakan useEffect untuk mengisi form saat data edit tiba
	useEffect(() => {
		if (initialData) {
			setScores(initialData.scores);
			setNotes(initialData.notes);
		}
	}, [initialData]);

	const handleScoreChange = (field, value) => {
		setScores((prev) => ({ ...prev, [field]: parseInt(value, 10) }));
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit({ scores, notes, type: "mastery_player" });
			}}
			className="space-y-4"
		>
			{Object.entries(fields).map(([category, items]) => (
				<div key={category}>
					<h3 className="font-semibold mb-2 text-primary">{category}</h3>
					{Object.entries(items).map(([key, label]) => (
						<div key={key} className="mb-3">
							<label className="text-sm flex justify-between text-gray-700">
								{label}{" "}
								<strong className="text-secondary">{scores[key]}</strong>
							</label>
							<input
								type="range"
								min="1"
								max="10"
								value={scores[key]}
								onChange={(e) => handleScoreChange(key, e.target.value)}
								className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary"
							/>
						</div>
					))}
				</div>
			))}
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Catatan Pelatih
				</label>
				<textarea
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					rows="4"
					className="w-full p-2 border rounded-md mt-1"
				></textarea>
			</div>
			<div className="flex justify-end gap-2 pt-2">
				<button
					type="submit"
					className="px-4 py-2 bg-secondary text-white font-semibold rounded-lg"
				>
					Simpan Laporan
				</button>
			</div>
		</form>
	);
};

const MasteryGKReportForm = ({ initialData, onSubmit }) => {
	const [scores, setScores] = useState(
		initialData?.scores || {
			kelincahan: 5,
			tangkapan: 5,
			lemparan: 5,
			tepisan: 5,
			refleks: 5,
			reaksi: 5,
			fleksibilitas: 5,
			kekuatan: 5,
			power: 5,
			kecepatan: 5,
			daya_tahan: 5,
		}
	);
	const [notes, setNotes] = useState(initialData?.notes || "");
	const fields = {
		Kiper: {
			tangkapan: "Tangkapan",
			lemparan: "Lemparan",
			tepisan: "Tepisan",
			refleks: "Refleks",
			reaksi: "Reaksi",
		},
		Fisik: {
			fleksibilitas: "Fleksibilitas",
			kekuatan: "Kekuatan",
			kelincahan: "Kelincahan",
			power: "Power",
			kecepatan: "Kecepatan",
			daya_tahan: "Daya Tahan",
		},
	};

	useEffect(() => {
		if (initialData) {
			setScores(initialData.scores);
			setNotes(initialData.notes);
		}
	}, [initialData]);

	const handleScoreChange = (field, value) => {
		setScores((prev) => ({ ...prev, [field]: parseInt(value, 10) }));
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit({ scores, notes, type: "mastery_gk" });
			}}
			className="space-y-4"
		>
			{Object.entries(fields).map(([category, items]) => (
				<div key={category}>
					<h3 className="font-semibold mb-2 text-primary">{category}</h3>
					{Object.entries(items).map(([key, label]) => (
						<div key={key} className="mb-3">
							<label className="text-sm flex justify-between text-gray-700">
								{label}{" "}
								<strong className="text-secondary">{scores[key]}</strong>
							</label>
							<input
								type="range"
								min="1"
								max="10"
								value={scores[key]}
								onChange={(e) => handleScoreChange(key, e.target.value)}
								className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary"
							/>
						</div>
					))}
				</div>
			))}
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Catatan Pelatih
				</label>
				<textarea
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					rows="4"
					className="w-full p-2 border rounded-md mt-1"
				></textarea>
			</div>
			<div className="flex justify-end gap-2 pt-2">
				<button
					type="submit"
					className="px-4 py-2 bg-secondary text-white font-semibold rounded-lg"
				>
					Simpan Laporan
				</button>
			</div>
		</form>
	);
};

const RegularGkReportForm = ({ onSubmit, initialData }) => {
	const [scores, setScores] = useState({
		tangkapan: "C",
		lemparan: "C",
		tepisan: "C",
		refleks: "C",
		reaksi: "C",
		fokus: "C",
		kerjasama: "C",
		komunikasi: "C",
		percaya_diri: "C",
		disiplin: "C",
	});
	const [notes, setNotes] = useState("");
	const grades = ["A", "B", "C"];
	const fields = {
		"Teknik Kiper": {
			tangkapan: "Tangkapan",
			lemparan: "Lemparan",
			tepisan: "Tepisan",
			refleks: "Refleks",
			reaksi: "Reaksi",
		},
		Karakter: {
			fokus: "Fokus",
			kerjasama: "Kerjasama",
			komunikasi: "Komunikasi",
			percaya_diri: "Percaya Diri",
			disiplin: "Disiplin",
		},
	};

	useEffect(() => {
		if (initialData?.scores) {
			setScores(JSON.parse(initialData.scores));
			setNotes(initialData.coach_notes || "");
		}
	}, [initialData]);

	const handleScoreChange = (field, value) => {
		setScores((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit({ scores, notes, type: "regular_gk" });
			}}
			className="space-y-4"
		>
			{Object.entries(fields).map(([category, items]) => (
				<div key={category}>
					<h3 className="font-semibold mb-2">{category}</h3>
					{Object.entries(items).map(([key, label]) => (
						<div key={key} className="flex justify-between items-center mb-2">
							<label className="text-sm">{label}</label>
							<div className="flex gap-1">
								{grades.map((grade) => (
									<button
										type="button"
										key={grade}
										onClick={() => handleScoreChange(key, grade)}
										className={`w-7 h-7 text-xs rounded ${
											scores[key] === grade
												? "bg-secondary text-white"
												: "bg-gray-200"
										}`}
									>
										{grade}
									</button>
								))}
							</div>
						</div>
					))}
				</div>
			))}
			<div>
				<label className="block text-sm font-medium">Catatan Pelatih</label>
				<textarea
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					rows="4"
					className="w-full p-2 border rounded-md mt-1"
				></textarea>
			</div>
			<button
				type="submit"
				className="w-full bg-secondary text-white font-bold py-2 rounded-lg"
			>
				Simpan Laporan
			</button>
		</form>
	);
};

// --- Komponen Modal Utama ---
export const EvaluationModal = ({
	isOpen,
	onClose,
	refetch,
	memberInfo,
	evaluationId,
	reportTypeToCreate,
}) => {
	const isEditMode = !!evaluationId;
	const [loading, setLoading] = useState(isEditMode);
	const [initialData, setInitialData] = useState(null);
	const [reportType, setReportType] = useState("");

	useEffect(() => {
		if (isOpen) {
			if (isEditMode) {
				const fetchEvaluation = async () => {
					setLoading(true);
					try {
						const response = await axios.get(
							`/api/members/get_evaluation.php?id=${evaluationId}`
						);
						setInitialData({
							scores: JSON.parse(response.data.scores),
							notes: response.data.coach_notes,
						});
						setReportType(response.data.report_type); // Tentukan tipe dari data yang ada
					} catch (error) {
						/* ... */
					} finally {
						setLoading(false);
					}
				};
				fetchEvaluation();
			} else {
				setReportType(reportTypeToCreate); // Tentukan tipe dari prop saat mode "tambah"
				setInitialData(null);
				setLoading(false);
			}
		}
	}, [evaluationId, isOpen, isEditMode, reportTypeToCreate]);

	const handleSubmit = async ({ scores, notes, type }) => {
		const url = isEditMode
			? "/api/members/update_evaluation.php"
			: "/api/members/create_evaluation.php";
		const payload = {
			id: isEditMode ? evaluationId : undefined,
			member_id: memberInfo.id,
			evaluation_date: new Date().toISOString().slice(0, 10),
			report_type: type,
			scores: scores,
			coach_notes: notes,
		};

		try {
			await axios.post(url, payload);
			Swal.fire(
				"Berhasil!",
				`Laporan evaluasi berhasil ${isEditMode ? "diperbarui" : "disimpan"}.`,
				"success"
			);
			refetch();
			onClose();
		} catch (error) {
			Swal.fire(
				"Gagal!",
				error.response?.data?.message || "Gagal menyimpan laporan.",
				"error"
			);
		}
	};

	const renderForm = () => {
		switch (reportType) {
			case "mastery_gk":
				return (
					<MasteryGKReportForm
						onSubmit={handleSubmit}
						initialData={initialData}
					/>
				);
			case "mastery_player":
				return (
					<MasteryPlayerReportForm
						onSubmit={handleSubmit}
						initialData={initialData}
					/>
				);
			case "regular_gk":
				return (
					<RegularGkReportForm
						onSubmit={handleSubmit}
						initialData={initialData}
					/>
				);
			case "regular_player":
				return (
					<RegularReportForm
						onSubmit={handleSubmit}
						initialData={initialData}
					/>
				);

			default:
				return <p>Tipe laporan tidak dikenal.</p>;
		}
	};

	const getReportTypeName = (type) => {
		switch (type) {
			case "mastery_gk":
				return "Mastery (Kiper)";
			case "mastery_player":
				return "Mastery (Pemain)";
			case "regular_gk":
				return "Rapor Reguler (Kiper)";
			case "regular_player":
				return "Rapor Reguler (Pemain)";
			default:
				return "Laporan Evaluasi";
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg max-h-[90vh] flex flex-col">
				<div className="flex justify-between items-center mb-4">
					<div>
						<h2 className="text-xl font-bold text-gray-800">
							{isEditMode ? "Edit Laporan Evaluasi" : "Buat Laporan Baru"}
						</h2>
						<span className="text-sm font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
							{getReportTypeName(reportType)}
						</span>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-200 rounded-full"
					>
						<FiX />
					</button>
				</div>
				<div className="flex-grow overflow-y-auto pr-2">
					{loading ? <p>Memuat...</p> : renderForm()}
				</div>
			</div>
		</div>
	);
};
