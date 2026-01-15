// File: src/components/BirthdayModal.jsx
import React from "react";
import ReactConfetti from "react-confetti";
import { FiX, FiGift } from "react-icons/fi";

const BirthdayModal = ({ isOpen, onClose, userName }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
			<ReactConfetti
				width={window.innerWidth}
				height={window.innerHeight}
				recycle={false}
				numberOfPieces={400}
			/>
			<div
				className="bg-gradient-to-br from-[var(--color-primary)] to-blue-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center text-white relative border-4 border-secondary transform transition-all scale-100"
				style={{ animation: "zoomIn 0.5s ease-out" }}
			>
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-white/50 hover:text-white"
				>
					<FiX size={24} />
				</button>

				<div className="mx-auto w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center border-4 border-secondary mb-4">
					<FiGift size={48} className="text-secondary" />
				</div>

				<h1 className="text-3xl font-bold text-secondary">
					Selamat Ulang Tahun!
				</h1>
				<p className="text-xl font-semibold mt-2">{userName}</p>
				<p className="mt-4 text-white/80">
					Semoga panjang umur, sehat selalu, dan semakin jago di lapangan! Terus
					semangat berlatih bersama Bogor Junior FS!
				</p>

				<button
					onClick={onClose}
					className="mt-8 w-full bg-secondary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
				>
					Terima Kasih!
				</button>
			</div>

			<style>{`
                @keyframes zoomIn {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
		</div>
	);
};

export default BirthdayModal;
