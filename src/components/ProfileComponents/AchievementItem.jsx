import React, { useState } from "react";
import { FiX, FiEdit, FiTrash2, FiAward } from "react-icons/fi";
import { FiSave } from "react-icons/fi";

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

export default AchievementItem;
