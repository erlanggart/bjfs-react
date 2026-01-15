// File: src/pages/public/BranchesPage.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import BranchesWithCoachesSection from "../../components/BranchesWithCoachesSection";
import Header from "../../layouts/Header";
import { Footer } from "../../layouts/Footer";

const BranchesPage = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<Header />

			{/* Back Button */}
			<div className="container mx-auto px-6 py-6">
				<Link
					to="/"
					className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
				>
					<FiArrowLeft className="text-xl" />
					<span>Kembali ke Home</span>
				</Link>
			</div>

			{/* Branches and Coaches Section */}
			<section className="">
				<BranchesWithCoachesSection />
			</section>

			{/* Footer CTA */}
			<section className="bg-gradient-to-r from-primary to-secondary py-16">
				<div className="container mx-auto px-6 text-center">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						Siap Bergabung dengan BJFS?
					</h2>
					<p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
						Daftar trial gratis dan rasakan pengalaman Futsal Character
						Building bersama pelatih terbaik kami
					</p>
					<a
						href="https://wa.me/6281315261946?text=Halo%20BJFS,%20saya%20ingin%20daftar%20Trial%20Gratis"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:shadow-xl transition-all hover:scale-105"
					>
						Daftar Trial Gratis Sekarang
					</a>
				</div>
			</section>

			{/* Footer */}
			<Footer />
		</div>
	);
};

export default BranchesPage;
