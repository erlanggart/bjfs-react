import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LatestMatchesSection = () => {
	const [matches, setMatches] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchLatestMatches = async () => {
			try {
				// Panggil API dengan limit 6 untuk mendapatkan 6 pertandingan terbaru
				const response = await axios.get(
					"/api/public/list_matches.php?limit=6"
				);
				setMatches(response.data);
			} catch (error) {
				console.error("Gagal memuat pertandingan terbaru", error);
			} finally {
				setLoading(false);
			}
		};
		fetchLatestMatches();
	}, []);

	const MatchCard = ({ match }) => (
		<Link
			to={`/pertandingan/${match.id}`}
			className="block bg-white rounded-lg shadow-md p-4 transition-transform hover:-translate-y-1"
		>
			<p className="text-xs text-gray-500">{match.event_name}</p>
			<div className="flex justify-between items-center text-center mt-2">
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

	return (
		<>
			<h2 className="text-2xl font-bold text-primary mb-4">
				Hasil Pertandingan Terbaru
			</h2>
			<p className="text-gray-600 mb-6">
				Lihat aksi dan perjuangan para pemain Bogor Junior di berbagai
				kompetisi.
			</p>

			{loading ? (
				<p className="text-center">Memuat...</p>
			) : (
				<div className="space-y-4">
					{matches.map((match) => (
						<MatchCard key={match.id} match={match} />
					))}
				</div>
			)}

			<div className="text-center mt-6">
				<Link
					to="/pertandingan"
					className="inline-block px-6 py-2 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-colors"
				>
					Lihat Semua Pertandingan
				</Link>
			</div>
		</>
	);
};

export default LatestMatchesSection;
