// File: src/pages/MemberReportPage.jsx
import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Radar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend,
} from "chart.js";
import { FiDownload, FiArrowLeft } from "react-icons/fi";
import { poppinsRegularBase64 } from "../../assets/Poppins-Reguler-base64"; // Impor font
import { poppinsBoldBase64 } from "../../assets/Poppins-Bold-base64";

ChartJS.register(
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend
);

const MemberReportPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { evaluation, memberInfo } = location.state || {};
	const reportRef = useRef();
	const chartTeknikRef = useRef();
	const chartFisikRef = useRef();
	const chartGkRef = useRef();

	if (!evaluation || !memberInfo) {
		return (
			<div className="p-6">Data laporan tidak ditemukan. Silakan kembali.</div>
		);
	}

	const scores = JSON.parse(evaluation.scores);

	const downloadPDF = async () => {
		const doc = new jsPDF("p", "mm", "a4");
		const pageHeight = doc.internal.pageSize.getHeight();
		const pageWidth = doc.internal.pageSize.getWidth();

		const themeColors = {
			primary: "#1A2347",
			secondary: "#D91E5B",
			text: "#333333",
			muted: "#777777",
		};
		const margins = { top: 15, bottom: 15, left: 15, right: 15 };
		let currentY = margins.top;

		doc.addFileToVFS("Poppins-Bold.ttf", poppinsBoldBase64);
		doc.addFont("Poppins-Bold.ttf", "Poppins", "bold");
		doc.addFileToVFS("Poppins-Regular.ttf", poppinsRegularBase64);
		doc.addFont("Poppins-Regular.ttf", "Poppins", "normal");
		doc.setFont("Poppins", "normal");

		const drawWatermark = () => {
			return new Promise((resolve) => {
				const watermarkImg = new Image();
				watermarkImg.src = "/bjfs_logo.jpg"; // Path logo Anda
				watermarkImg.crossOrigin = "Anonymous";
				watermarkImg.onload = () => {
					const imgProps = doc.getImageProperties(watermarkImg);
					const aspectRatio = imgProps.height / imgProps.width;
					const watermarkWidth = pageWidth - (margins.left + margins.right);
					const watermarkHeight = watermarkWidth * aspectRatio;
					const x = margins.left;
					const y = (pageHeight - watermarkHeight) / 2;

					doc.saveGraphicsState();
					doc.setGState(new doc.GState({ opacity: 0.1 }));
					doc.addImage(
						watermarkImg,
						"PNG",
						x,
						y,
						watermarkWidth,
						watermarkHeight
					);
					doc.restoreGraphicsState();
					resolve();
				};
			});
		};

		const drawHeader = () => {
			const logoImg = new Image();
			logoImg.src = "/bjfs_logo.jpg"; // Path logo Anda
			logoImg.crossOrigin = "Anonymous";

			return new Promise((resolve) => {
				logoImg.onload = () => {
					doc.addImage(logoImg, "PNG", margins.left, margins.top, 25, 15);
					doc.setFontSize(18);
					doc.setFont("Poppins", "bold");
					doc.setTextColor(themeColors.primary);
					doc.text("LAPORAN EVALUASI SISWA", pageWidth / 2, currentY + 10, {
						align: "center",
					});
					doc.setFontSize(12);
					doc.setFont("Poppins", "normal");
					doc.setTextColor(themeColors.muted);
					doc.text("Bogor Junior Futsal School", pageWidth / 2, currentY + 18, {
						align: "center",
					});
					doc.setLineWidth(1);
					doc.setDrawColor(themeColors.primary);
					doc.line(
						margins.left,
						currentY + 25,
						pageWidth - margins.right,
						currentY + 25
					);
					currentY += 35;
					resolve();
				};
			});
		};

		const drawStudentInfo = () => {
			autoTable(doc, {
				startY: currentY,
				theme: "plain",
				body: [
					// PERBAIKAN: Hapus tanggal dari sini
					[
						{
							content: `Nama Siswa: ${memberInfo.full_name}`,
							styles: { fontStyle: "bold" },
						},
						`ID Siswa: ${memberInfo.id}`,
					],
					[
						`Cabang: ${memberInfo.branch_name}`,
						`Tanggal Evaluasi: ${new Date(
							evaluation.evaluation_date
						).toLocaleDateString("id-ID")}`,
					],
				],
				styles: { fontSize: 10, font: "Poppins" },
			});
			currentY = doc.lastAutoTable.finalY + 10;
		};

		const drawReportContent = () => {
			doc.setFontSize(14);
			doc.setFont("Poppins", "bold");
			doc.setTextColor(themeColors.primary);

			if (evaluation.report_type === "mastery_gk") {
				doc.text("Rapor Mastery Class (Goal Keeper)", pageWidth / 2, currentY, {
					align: "center",
				});
				currentY += 10;
				const chartTeknikImage = chartTeknikRef.current.toBase64Image();
				const chartFisikImage = chartFisikRef.current.toBase64Image();
				doc.setFontSize(11);
				doc.text("Penilaian Teknik", 60, currentY, { align: "center" });
				doc.addImage(chartTeknikImage, "PNG", 20, currentY + 5, 80, 80);
				doc.text("Penilaian Fisik", 150, currentY, { align: "center" });
				doc.addImage(chartFisikImage, "PNG", 110, currentY + 5, 80, 80);
				currentY += 95;
			} else if (evaluation.report_type === "mastery_player") {
				doc.text("Rapor Mastery Class", pageWidth / 2, currentY, {
					align: "center",
				});
				currentY += 10;
				const chartTeknikImage = chartTeknikRef.current.toBase64Image();
				const chartFisikImage = chartFisikRef.current.toBase64Image();
				doc.setFontSize(11);
				doc.text("Penilaian Teknik", 60, currentY, { align: "center" });
				doc.addImage(chartTeknikImage, "PNG", 20, currentY + 5, 80, 80);
				doc.text("Penilaian Fisik", 150, currentY, { align: "center" });
				doc.addImage(chartFisikImage, "PNG", 110, currentY + 5, 80, 80);
				currentY += 95;
			} else if (evaluation.report_type === "regular_gk") {
				doc.text("Rapor Member (Kiper)", pageWidth / 2, currentY, {
					align: "center",
				});
				currentY += 5;
				autoTable(doc, {
					startY: currentY,
					head: [["Penilaian Teknik", "Nilai"]],
					body: Object.entries({
						tangkapan: "Tangkapan",
						lemparan: "Lemparan",
						tepisan: "Tepisan",
						refleks: "Refleks",
						reaksi: "Reaksi",
					}).map(([key, label]) => [label, scores[key]]),
					theme: "grid",
					headStyles: { fillColor: themeColors.primary, font: "Poppins" },
					bodyStyles: { font: "Poppins" },
					columnStyles: { 1: { halign: "center" } },
				});
				autoTable(doc, {
					startY: doc.lastAutoTable.finalY + 8,
					head: [["Penilaian Karakter", "Nilai"]],
					body: Object.entries({
						fokus: "Fokus",
						kerjasama: "Kerjasama",
						komunikasi: "Komunikasi",
						percaya_diri: "Percaya Diri",
						disiplin: "Disiplin",
					}).map(([key, label]) => [label, scores[key]]),
					theme: "grid",
					headStyles: { fillColor: themeColors.primary, font: "Poppins" },
					bodyStyles: { font: "Poppins" },
					columnStyles: { 1: { halign: "center" } },
				});
				currentY = doc.lastAutoTable.finalY;
			} else {
				doc.text("Rapor Member", pageWidth / 2, currentY, { align: "center" });
				currentY += 5;
				autoTable(doc, {
					startY: currentY,
					head: [["Penilaian Teknik", "Nilai"]],
					body: Object.entries({
						dribbling: "Dribbling",
						passing: "Passing",
						controlling: "Controlling",
						shooting: "Shooting",
						moving: "Moving",
						game_situation: "Game Situation",
					}).map(([key, label]) => [label, scores[key]]),
					theme: "grid",
					headStyles: { fillColor: themeColors.primary, font: "Poppins" },
					bodyStyles: { font: "Poppins" },
					columnStyles: { 1: { halign: "center" } },
				});
				autoTable(doc, {
					startY: doc.lastAutoTable.finalY + 8,
					head: [["Penilaian Karakter", "Nilai"]],
					body: Object.entries({
						fokus: "Fokus",
						kerjasama: "Kerjasama",
						komunikasi: "Komunikasi",
						percaya_diri: "Percaya Diri",
						disiplin: "Disiplin",
					}).map(([key, label]) => [label, scores[key]]),
					theme: "grid",
					headStyles: { fillColor: themeColors.primary, font: "Poppins" },
					bodyStyles: { font: "Poppins" },
					columnStyles: { 1: { halign: "center" } },
				});
				currentY = doc.lastAutoTable.finalY;
			}
		};

		const drawFooter = () => {
			return new Promise((resolve) => {
				doc.setFontSize(10);
				doc.setFont("Poppins", "bold");
				doc.setTextColor(themeColors.text);
				doc.text("Catatan dari Pelatih:", margins.left, currentY + 15);
				doc.setFont("Poppins", "normal");
				doc.setTextColor(themeColors.muted);
				doc.text(
					`"${evaluation.coach_notes || "Tidak ada catatan."}"`,
					margins.left,
					currentY + 22,
					{ maxWidth: pageWidth - margins.left - margins.right }
				);

				// PERBAIKAN: Pindahkan tanggal ke sini
				const evaluationDate = new Date(
					evaluation.evaluation_date
				).toLocaleDateString("id-ID", {
					day: "numeric",
					month: "long",
					year: "numeric",
				});
				doc.setFont("Poppins", "normal");
				doc.text(
					`Bogor, ${evaluationDate}`,
					pageWidth - margins.right,
					currentY + 40,
					{ align: "right" }
				);

				if (evaluation.author_signature) {
					const sigImg = new Image();
					sigImg.src = evaluation.author_signature;
					sigImg.crossOrigin = "Anonymous";
					sigImg.onload = () => {
						const canvas = document.createElement("canvas");
						const ctx = canvas.getContext("2d");
						canvas.width = sigImg.width;
						canvas.height = sigImg.height;

						// Isi latar belakang dengan warna putih
						ctx.fillStyle = "#FFFFFF";
						ctx.fillRect(0, 0, canvas.width, canvas.height);

						// Gambar tanda tangan di atasnya
						ctx.drawImage(sigImg, 0, 0);

						// Dapatkan data gambar sebagai JPEG (yang tidak mendukung transparansi)
						const flattenedImage = canvas.toDataURL("image/jpeg", 1.0);

						doc.addImage(
							flattenedImage,
							"JPEG",
							pageWidth - margins.right - 40,
							currentY + 45,
							40,
							20
						);
						// =======================================================

						doc.text(
							evaluation.author_full_name || evaluation.author_username,
							pageWidth - margins.right,
							currentY + 70,
							{ align: "right" }
						);
						resolve();
					};
				} else {
					doc.text(
						evaluation.author_full_name || evaluation.author_username,
						pageWidth - margins.right,
						currentY + 70,
						{ align: "right" }
					);
					resolve();
				}
			});
		};

		// --- Eksekusi Pembuatan PDF ---
		await drawWatermark();
		await drawHeader();
		drawStudentInfo();
		drawReportContent();
		await drawFooter();
		doc.save(`Rapor_${memberInfo.full_name}_${evaluation.evaluation_date}.pdf`);
	};

	const chartOptions = {
		scales: {
			r: {
				angleLines: { display: true },
				suggestedMin: 0,
				suggestedMax: 10,
				ticks: { stepSize: 2 },
			},
		},
	};

	const teknikChartData = {
		labels: ["Passing", "Control", "Dribbling", "Shooting", "Taktik"],
		datasets: [
			{
				label: "Skor Teknik",
				data: [
					scores.passing,
					scores.control,
					scores.dribbling,
					scores.shooting,
					scores.pemahaman_taktikal,
				],
				backgroundColor: "rgba(217, 30, 91, 0.2)",
				borderColor: "rgba(217, 30, 91, 1)",
				borderWidth: 2,
			},
		],
	};

	const fisikChartData = {
		labels: [
			"Fleksibilitas",
			"Kekuatan",
			"Kelincahan",
			"Power",
			"Kecepatan",
			"Daya Tahan",
		],
		datasets: [
			{
				label: "Skor Fisik",
				data: [
					scores.fleksibilitas,
					scores.kekuatan,
					scores.kelincahan,
					scores.power,
					scores.kecepatan,
					scores.daya_tahan,
				],
				backgroundColor: "rgba(26, 35, 71, 0.2)",
				borderColor: "rgba(26, 35, 71, 1)",
				borderWidth: 2,
			},
		],
	};

	const masteryGkChartData = {
		labels: ["Tangkapan", "Lemparan", "Tepisan", "Refleks", " Reaksi"],
		datasets: [
			{
				label: "Skor Kiper",
				data: [
					scores.tangkapan,
					scores.lemparan,
					scores.tepisan,
					scores.refleks,
					scores.reaksi,
				],
				backgroundColor: "rgba(75, 192, 192, 0.2)",
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 2,
			},
		],
	};
	const playerGkChartData = {
		labels: ["Tangkapan", "Lemparan", "Tepisan", "Refleks", " Reaksi"],
		datasets: [
			{
				label: "Skor Kiper",
				data: [
					scores.tangkapan,
					scores.lemparan,
					scores.tepisan,
					scores.refleks,
					scores.reaksi,
				],
				backgroundColor: "rgba(75, 192, 192, 0.2)",
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 2,
			},
		],
	};

	const renderReportContent = () => {
		console.log("Rendering report for type:", evaluation.report_type);
		console.log("Scores data:", scores);
		switch (evaluation.report_type) {
			case "mastery_gk":
				return (
					<div>
						<h2 className="text-xl font-bold text-primary mb-4 text-center">
							Rapor Mastery Class (Kiper)
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="text-center">
								<h3 className="font-semibold text-lg">Penilaian Teknik</h3>
								<Radar
									ref={chartTeknikRef}
									data={masteryGkChartData}
									options={{
										scales: { r: { suggestedMin: 0, suggestedMax: 10 } },
									}}
								/>
							</div>
							<div className="text-center">
								<h3 className="font-semibold text-lg">Penilaian Fisik</h3>
								<Radar
									ref={chartFisikRef}
									data={fisikChartData}
									options={{
										scales: { r: { suggestedMin: 0, suggestedMax: 10 } },
									}}
								/>
							</div>
						</div>
					</div>
				);
			case "regular_gk":
				return (
					<div>
						<h2 className="text-xl font-bold text-primary mb-4 text-center">
							Rapor Member (Kiper)
						</h2>
						<div className="grid grid-cols-2 gap-8">
							<div>
								<h3 className="font-semibold border-b mb-2">
									Penilaian Teknik
								</h3>
								<table className="w-full text-sm">
									<tbody>
										{Object.entries({
											tangkapan: "Tangkapan",
											lemparan: "Lemparan",
											tepisan: "Tepisan",
											refleks: "Refleks",
											reaksi: "Reaksi",
										}).map(([key, label]) => (
											<tr key={key}>
												<td className="py-1">{label}</td>
												<td className="text-right font-bold">{scores[key]}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<div>
								<h3 className="font-semibold border-b mb-2">
									Penilaian Karakter
								</h3>
								<table className="w-full text-sm">
									<tbody>
										{Object.entries({
											fokus: "Fokus",
											kerjasama: "Kerjasama",
											komunikasi: "Komunikasi",
											percaya_diri: "Percaya Diri",
											disiplin: "Disiplin",
										}).map(([key, label]) => (
											<tr key={key}>
												<td className="py-1">{label}</td>
												<td className="text-right font-bold">{scores[key]}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				);
			case "mastery_player":
				return (
					<div>
						<h2 className="text-xl font-bold text-primary mb-4 text-center">
							Rapor Mastery Class (Pemain)
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="text-center">
								<h3 className="font-semibold text-lg">Penilaian Teknik</h3>
								<Radar
									ref={chartTeknikRef}
									data={teknikChartData}
									options={{
										scales: { r: { suggestedMin: 0, suggestedMax: 10 } },
									}}
								/>
							</div>
							<div className="text-center">
								<h3 className="font-semibold text-lg">Penilaian Fisik</h3>
								<Radar
									ref={chartFisikRef}
									data={fisikChartData}
									options={{
										scales: { r: { suggestedMin: 0, suggestedMax: 10 } },
									}}
								/>
							</div>
						</div>
					</div>
				);
			default:
				return (
					<div>
						<h2 className="text-xl font-bold text-primary mb-4 text-center">
							Rapor Member
						</h2>
						<div className="grid grid-cols-2 gap-8">
							<div>
								<h3 className="font-semibold border-b mb-2">
									Penilaian Teknik
								</h3>
								<table className="w-full text-sm">
									<tbody>
										{Object.entries({
											dribbling: "Dribbling",
											passing: "Passing",
											controlling: "Controlling",
											shooting: "Shooting",
											moving: "Moving",
											game_situation: "Game Situation",
										}).map(([key, label]) => (
											<tr key={key}>
												<td className="py-1">{label}</td>
												<td className="text-right font-bold">{scores[key]}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<div>
								<h3 className="font-semibold border-b mb-2">
									Penilaian Karakter
								</h3>
								<table className="w-full text-sm">
									<tbody>
										{Object.entries({
											fokus: "Fokus",
											kerjasama: "Kerjasama",
											komunikasi: "Komunikasi",
											percaya_diri: "Percaya Diri",
											disiplin: "Disiplin",
										}).map(([key, label]) => (
											<tr key={key}>
												<td className="py-1">{label}</td>
												<td className="text-right font-bold">{scores[key]}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				);
		}
	};

	return (
		<div className="bg-gray-200 min-h-screen p-4 sm:p-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-4">
					<button
						onClick={() => navigate(-1)}
						className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
					>
						<FiArrowLeft /> Kembali
					</button>
					<button
						onClick={downloadPDF}
						className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg font-semibold"
					>
						<FiDownload /> Unduh PDF
					</button>
				</div>
				<div ref={reportRef} className="bg-white p-10 shadow-lg">
					<div className="text-center border-b-4 border-primary pb-4 mb-6">
						<img
							src="/bjfs_logo.svg"
							alt="Logo"
							className="w-20 h-20 mx-auto mb-2"
						/>
						<h1 className="text-2xl font-bold text-primary">
							LAPORAN EVALUASI SISWA
						</h1>
						<p className="text-sm text-gray-600">Bogor Junior Futsal School</p>
					</div>
					<div className="grid grid-cols-2 gap-4 mb-6 text-sm">
						<div>
							<p>
								<strong>Nama Siswa:</strong> {memberInfo.full_name}
							</p>
							<p>
								<strong>Cabang:</strong> {memberInfo.branch_name}
							</p>
						</div>
						<div>
							<p>
								<strong>Tanggal Evaluasi:</strong>{" "}
								{new Date(evaluation.evaluation_date).toLocaleDateString(
									"id-ID",
									{ day: "numeric", month: "long", year: "numeric" }
								)}
							</p>
							<p>
								<strong>ID Siswa:</strong> {memberInfo.id}
							</p>
						</div>
					</div>

					{renderReportContent()}

					<div className="mt-8 pt-4 border-t">
						<h3 className="font-semibold">Catatan dari Pelatih:</h3>
						<p className="text-sm text-gray-700 italic mt-1">
							"{evaluation.coach_notes || "Tidak ada catatan."}"
						</p>
					</div>
					<div className="mt-16 flex justify-end">
						<div className="text-center">
							<p>Hormat kami,</p>
							{evaluation.author_signature ? (
								<img
									src={evaluation.author_signature}
									alt="Tanda Tangan"
									className="h-20 mx-auto"
								/>
							) : (
								<div className="h-20"></div>
							)}
							<p className="font-bold border-t mt-2 pt-1">
								{evaluation.author_full_name || evaluation.author_username}
							</p>
							<p className="text-xs">Pelatih</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MemberReportPage;
