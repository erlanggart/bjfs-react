// File: src/components/BirthdayCalendar.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FiChevronLeft, FiChevronRight, FiGift } from "react-icons/fi";

const BirthdayCalendar = ({ branchId }) => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [birthdays, setBirthdays] = useState({});
	const [loading, setLoading] = useState(true);
	const [selectedDate, setSelectedDate] = useState(null);

	useEffect(() => {
		const fetchBirthdays = async () => {
			if (!branchId) return;
			setLoading(true);
			try {
				const month = currentDate.getMonth() + 1;
				const response = await axios.get("/api/branches/get_birthdays.php", {
					params: { branch_id: branchId, month: month },
				});
				setBirthdays(response.data);
			} catch (error) {
				console.error("Gagal memuat data ulang tahun", error);
			} finally {
				setLoading(false);
			}
		};
		fetchBirthdays();
	}, [branchId, currentDate]);

	const calendarGrid = useMemo(() => {
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();
		// Mendapatkan hari pertama (0=Minggu, 1=Senin, dst.)
		const firstDayOfMonth = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
		const blanksArray = Array.from({ length: firstDayOfMonth }, () => null);

		return [...blanksArray, ...daysArray];
	}, [currentDate]);

	const changeMonth = (offset) => {
		setCurrentDate((prev) => {
			const newDate = new Date(prev);
			newDate.setMonth(prev.getMonth() + offset);
			return newDate;
		});
		setSelectedDate(null);
	};

	const selectedBirthdays =
		selectedDate && birthdays[selectedDate] ? birthdays[selectedDate] : [];

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<div className="flex justify-between items-center mb-4">
				<button
					onClick={() => changeMonth(-1)}
					className="p-2 rounded-full hover:bg-gray-100"
				>
					<FiChevronLeft />
				</button>
				<h2 className="text-lg font-bold text-primary">
					{currentDate.toLocaleDateString("id-ID", {
						month: "long",
						year: "numeric",
					})}
				</h2>
				<button
					onClick={() => changeMonth(1)}
					className="p-2 rounded-full hover:bg-gray-100"
				>
					<FiChevronRight />
				</button>
			</div>

			<div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
				{["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
					<div key={day}>{day}</div>
				))}
			</div>

			<div className="grid grid-cols-7 gap-1">
				{calendarGrid.map((day, index) => (
					<div key={index} className="h-12 flex items-center justify-center">
						{day && (
							<button
								onClick={() => setSelectedDate(day)}
								className={`w-10 h-10 rounded-full flex items-center justify-center relative transition-colors
                                    ${
																			birthdays[day]
																				? "bg-secondary text-white font-bold"
																				: "hover:bg-gray-100"
																		}
                                    ${
																			selectedDate === day
																				? "ring-2 ring-primary"
																				: ""
																		}
                                `}
							>
								{day}
								{birthdays[day] && (
									<FiGift size={10} className="absolute top-1 right-1" />
								)}
							</button>
						)}
					</div>
				))}
			</div>

			{selectedDate && (
				<div className="mt-6 border-t pt-4">
					<h3 className="font-semibold text-gray-700">
						Ulang Tahun Tanggal {selectedDate}:
					</h3>
					{loading ? (
						<p className="text-sm text-gray-500 mt-2">Memuat...</p>
					) : selectedBirthdays.length > 0 ? (
						<ul className="mt-2 space-y-2">
							{selectedBirthdays.map((member) => (
								<li key={member.full_name} className="flex items-center gap-3">
									<img
										src={
											member.avatar ||
											`https://placehold.co/40x40/E0E0E0/757575?text=${member.full_name.charAt(
												0
											)}`
										}
										alt={member.full_name}
										className="w-8 h-8 rounded-full object-cover"
									/>
									<span className="text-sm">{member.full_name}</span>
								</li>
							))}
						</ul>
					) : (
						<p className="text-sm text-gray-500 mt-2">
							Tidak ada member yang berulang tahun di tanggal ini.
						</p>
					)}
				</div>
			)}
		</div>
	);
};

export default BirthdayCalendar;
