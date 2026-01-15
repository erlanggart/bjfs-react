// File: src/components/MemberCard.jsx (File Baru)
// Deskripsi: Komponen ini adalah desain visual dari kartu anggota yang akan dicetak.
import React from "react";
import { QRCodeSVG } from "qrcode.react";

const MemberCard = React.forwardRef(({ memberInfo }, ref) => {
	if (!memberInfo) return null;

	return (
		<div
			ref={ref}
			className="bg-white text-black font-sans"
			style={{ width: "337px", height: "212px" }}
		>
			<div className="relative w-full h-full rounded-lg overflow-hidden flex">
				{/* Background Pattern */}
				<div
					className="absolute inset-0 opacity-10"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%231A2347' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
					}}
				></div>

				{/* Bagian Kiri (Foto & QR) */}
				<div className="w-1/3 bg-primary text-white flex flex-col items-center justify-center p-2 space-y-2">
					<img
						src={
							memberInfo.avatar ||
							`https://placehold.co/80x80/E0E0E0/757575?text=${memberInfo.full_name.charAt(
								0
							)}`
						}
						alt={memberInfo.full_name}
						// PERBAIKAN: Kelas 'shadow-md' dihapus dari sini
						className="w-20 h-20 rounded-full object-cover border-4 border-white"
					/>
					<div className="bg-white p-1 rounded-md">
						<QRCodeSVG value={memberInfo.id} size={50} />
					</div>
				</div>

				{/* Bagian Kanan (Info) */}
				<div className="w-2/3 flex flex-col p-3">
					<div className="flex items-center gap-2">
						<img src="/bjfs_logo.png" alt="Logo" className="w-8 h-auto" />
						<div>
							<h1 className="text-xs font-extrabold text-primary leading-tight">
								BOGOR JUNIOR
							</h1>
							<p className="text-[8px] text-secondary font-semibold leading-tight">
								FUTSAL SCHOOL
							</p>
						</div>
					</div>
					<div className="flex-grow flex flex-col justify-center mt-2">
						<p className="font-bold text-lg text-primary leading-tight">
							{memberInfo.full_name}
						</p>
						<p className="text-xs text-gray-600">{memberInfo.branch_name}</p>
						<p className="font-mono text-xs mt-2 bg-gray-100 px-2 py-0.5 rounded-full inline-block">
							{memberInfo.id}
						</p>
					</div>
					<div className="border-t-4 border-secondary mt-2"></div>
				</div>
			</div>
		</div>
	);
});

export default MemberCard;
