import React, { useState } from "react";
import { FiX, FiEdit, FiTrash2, FiAward, FiSave } from "react-icons/fi";

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

export default CompetencyItem;
