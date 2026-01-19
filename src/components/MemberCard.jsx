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
			style={{ width: "375px", height: "270px" }}
		>
			<div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
				{/* Background Gradient */}
				<div
					className="absolute inset-0"
					style={{
						background:
							"linear-gradient(135deg, #1A2347 0%, #2D4A8C 50%, #1A2347 100%)",
					}}
				></div>

				{/* Decorative Circles */}
				<div
					className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10"
					style={{ background: "rgba(255, 255, 255, 0.1)" }}
				></div>
				<div
					className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10"
					style={{ background: "rgba(255, 255, 255, 0.1)" }}
				></div>

				{/* Top Section - Logo & Brand */}
				<div className="relative px-5 pt-4 pb-3 flex items-center justify-between border-b border-white/20">
					<div className="flex items-center gap-3">
						<img
							src="/bjfs_logo.png"
							alt="Logo"
							className="h-14 w-auto drop-shadow-lg"
						/>
						<div>
							<h1 className="text-base font-extrabold text-white leading-none tracking-wide whitespace-nowrap">
								BOGOR JUNIOR
							</h1>
							<p className="text-[10px] text-blue-200 font-semibold leading-tight tracking-widest mt-0.5">
								FUTSAL SCHOOL
							</p>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="relative px-5 py-5 flex gap-6 items-start">
					{/* Left Side - QR Code */}
					<div className="shrink-0">
						<div className="bg-white p-3 rounded-xl shadow-2xl">
							<QRCodeSVG value={memberInfo.id} size={105} />
						</div>
					</div>

					{/* Right Side - Info */}
					<div className="grow flex flex-col justify-start pt-2">
						<div>
							<p className="text-[11px] text-blue-200 font-semibold mb-1.5 tracking-wide uppercase">
								Member Name
							</p>
							<p className="font-bold text-md text-white leading-tight mb-4 tracking-tight">
								{memberInfo.full_name}
							</p>
							<div className="flex-row space-x-2">
								<div className="flex items-center gap-2">
									<div className="w-1.5 rounded-full bg-blue-300"></div>
									<p className="text-xs text-blue-100 font-medium">
										{memberInfo.branch_name}
									</p>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-1.5 rounded-full bg-blue-300"></div>
									<p className="font-mono text-xs text-blue-100 tracking-wide font-semibold">
										ID: {memberInfo.id}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Accent */}
				<div
					className="absolute bottom-0 left-0 right-0 h-2"
					style={{
						background:
							"linear-gradient(90deg, #F59E0B 0%, #EF4444 50%, #F59E0B 100%)",
					}}
				></div>
			</div>
		</div>
	);
});

export default MemberCard;
