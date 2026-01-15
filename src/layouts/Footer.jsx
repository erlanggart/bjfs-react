import React from "react";
import {
	FiFacebook,
	FiInstagram,
	FiYoutube,
	FiTwitter,
	FiPhone,
} from "react-icons/fi";

export const Footer = () => {
	return (
		<footer className="bg-primary text-white pt-16 pb-8">
			<div className="container mx-auto px-6 text-center">
				<img
					src="/bjfs_logo.svg"
					alt="Logo BJFS"
					className="w-24 h-auto mx-auto mb-4 rounded-lg"
				/>

				<div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between gap-8 my-10 text-left">
					{/* Office Info */}
					<div className="text-center md:text-left">
						<h4 className="font-bold text-lg mb-2">Office</h4>
						<div className="text-sm text-gray-400 space-y-1">
							<p>
								Emerald Cilebut Blok C27 Cilebut Barat Sukaraja Kab. Bogor Jawa
								Barat
							</p>
							<p>
								<strong>Jam Operasional:</strong> Senin - Jumat, 09.00 - 17.00
							</p>
							<div className="flex items-center gap-2 justify-center md:justify-start">
								<FiPhone />
								+62 813-1526-1946
							</div>
						</div>
					</div>
					{/* Social Media */}
					<div className="text-center">
						<h4 className="font-bold text-lg mb-3">Ikuti Kami</h4>
						<div className="flex justify-center gap-4">
							<a
								href="https://www.facebook.com/bogorjuniorfs"
								className="p-3 bg-white/10 rounded-full hover:bg-[var(--color-secondary)] transition-colors"
							>
								<FiFacebook size={20} />
							</a>
							<a
								href="https://www.instagram.com/bogorjuniorfs"
								className="p-3 bg-white/10 rounded-full hover:bg-[var(--color-secondary)] transition-colors"
							>
								<FiInstagram size={20} />
							</a>
							<a
								href="#"
								className="p-3 bg-white/10 rounded-full hover:bg-[var(--color-secondary)] transition-colors"
							>
								<FiYoutube size={20} />
							</a>
							<a
								href="#"
								className="p-3 bg-white/10 rounded-full hover:bg-[var(--color-secondary)] transition-colors"
							>
								<FiTwitter size={20} />
							</a>
						</div>
					</div>
					{/* Login Button */}
				</div>

				<p className="text-xs text-gray-500 mt-12 border-t border-white/10 pt-6">
					&copy; 2025 Bogor Junior. All rights reserved.
				</p>
			</div>
		</footer>
	);
};
