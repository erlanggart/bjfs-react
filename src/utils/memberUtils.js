/**
 * Menghitung durasi keanggotaan member berdasarkan tanggal registrasi
 * @param {string} regDateStr - Tanggal registrasi dalam format string
 * @returns {string} Durasi keanggotaan dalam format "X tahun, Y bulan" atau "Baru bergabung"
 */
export const calculateMembershipDuration = (regDateStr) => {
	if (!regDateStr) {
		return "-";
	}

	const startDate = new Date(regDateStr);
	const today = new Date();

	// Mengatasi jika tanggal tidak valid
	if (isNaN(startDate.getTime())) {
		return "-";
	}

	// Hitung total selisih bulan
	let totalMonths =
		(today.getFullYear() - startDate.getFullYear()) * 12 +
		(today.getMonth() - startDate.getMonth());

	// Jika hari ini lebih kecil dari hari registrasi, berarti satu bulan penuh belum lewat
	if (today.getDate() < startDate.getDate()) {
		totalMonths--;
	}

	// Pastikan tidak negatif
	if (totalMonths < 0) totalMonths = 0;

	const years = Math.floor(totalMonths / 12);
	const months = totalMonths % 12;

	const yearText = years > 0 ? `${years} tahun` : "";
	const monthText = months > 0 ? `${months} bulan` : "";

	if (years > 0 && months > 0) {
		return `${yearText}, ${monthText}`;
	}
	if (years > 0) {
		return yearText;
	}
	if (months > 0) {
		return monthText;
	}

	// Jika kurang dari sebulan
	return "Baru bergabung";
};
