// File: src/pages/AllMatchesPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft, FiCalendar } from "react-icons/fi";
import { Footer } from "../layouts/Footer";
import Header from "../layouts/Header";

// Komponen untuk setiap kartu pertandingan
const MatchCard = ({ match }) => (
	<Link
		to={`/pertandingan/${match.id}`}
		className="block bg-white rounded-lg shadow-md p-4 transition-transform hover:-translate-y-1"
	>
		<p className="text-xs text-gray-500">{match.event_name}</p>
		<p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
			<FiCalendar size={12} />{" "}
			{new Date(match.match_date).toLocaleDateString("id-ID", {
				dateStyle: "long",
			})}
		</p>
		<div className="flex justify-between items-center text-center">
			<span className="font-semibold text-sm w-2/5 truncate">
				{match.team_a_name}
			</span>
			<span className="text-lg font-bold bg-primary text-white px-3 py-1 rounded-md">
				{match.score_a} - {match.score_b}
			</span>
			<span className="font-semibold text-sm w-2/5 truncate">
				{match.team_b_name}
			</span>
		</div>
	</Link>
);

const AllMatchesPage = () => {
	const [matches, setMatches] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAllMatches = async () => {
			try {
				// Panggil API tanpa limit untuk mendapatkan semua data
				const response = await axios.get("/api/public/list_matches.php");
				setMatches(response.data);
			} catch (error) {
				console.error("Gagal memuat semua pertandingan", error);
			} finally {
				setLoading(false);
			}
		};
		fetchAllMatches();
	}, []);

	return (
		<div className="bg-gray-100 min-h-screen">
			<Header />
			<div className="container mx-auto px-6 py-12">
				<Link
					to="/"
					className="inline-flex items-center gap-2 text-secondary font-semibold mb-8 hover:underline"
				>
					<FiArrowLeft /> Kembali ke Beranda
				</Link>
				<h1 className="text-4xl font-bold text-primary text-center mb-8">
					Semua Hasil Pertandingan
				</h1>

				{loading ? (
					<p className="text-center">Memuat pertandingan...</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{matches.map((match) => (
							<MatchCard key={match.id} match={match} />
						))}
					</div>
				)}
			</div>
			<Footer />
		</div>
	);
};

export default AllMatchesPage;
