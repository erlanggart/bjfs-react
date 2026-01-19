/**
 * Menghitung status pembayaran member berdasarkan tanggal registrasi dan pembayaran terakhir
 * @param {string} regDateStr - Tanggal registrasi
 * @param {string} lastPaidDateStr - Tanggal pembayaran terakhir
 * @param {Array} paymentHistory - Riwayat pembayaran
 * @returns {Object} Status pembayaran dengan properti show, status, days, isOverdue, proof_id
 */
export const getPaymentStatus = (regDateStr, lastPaidDateStr, paymentHistory) => {
	if (!regDateStr) {
		return { show: false, status: "paid" };
	}

	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const currentMonth = today.getMonth() + 1;
	const currentYear = today.getFullYear();

	// Prioritas 1: Cek bukti pembayaran yang diunggah untuk bulan ini
	const proofForThisMonth = Array.isArray(paymentHistory) ? paymentHistory.find(
		(p) => p.payment_month == currentMonth && p.payment_year == currentYear
	) : null;

	if (proofForThisMonth?.status === "pending") {
		return { show: true, status: "pending", proof_id: proofForThisMonth.id };
	}
	if (proofForThisMonth?.status === "approved") {
		return { show: false, status: "paid" }; // Sudah lunas bulan ini
	}

	// --- LOGIKA BARU: Jatuh Tempo Bergulir ---
	// 1. Tentukan tanggal dasar dari tanggal pembayaran terakhir, atau tanggal registrasi.
	const baseDate = new Date(lastPaidDateStr || regDateStr);

	// 2. Hitung tanggal jatuh tempo berikutnya (satu bulan setelah tanggal dasar).
	const nextDueDate = new Date(
		baseDate.getFullYear(),
		baseDate.getMonth() + 1,
		baseDate.getDate()
	);

	// 3. Hitung sisa hari.
	const timeDiff = nextDueDate.getTime() - today.getTime();
	const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

	if (daysRemaining <= 7) {
		const isOverdue = daysRemaining < 0;
		return {
			show: true,
			status: "due",
			days: daysRemaining,
			isOverdue,
		};
	}

	return { show: false, status: "paid" };
};
