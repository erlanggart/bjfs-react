import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Swal from "sweetalert2";

const LatestArticles = () => {
	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchArticles = async () => {
			try {
				// Panggil API publik dengan limit 3 artikel
				const response = await api.get("/api/public/articles/list?limit=3");
				setArticles(response.data);
			} catch (error) {
				console.error("Gagal memuat artikel:", error);
				// Jangan tampilkan popup error di landing page agar tidak mengganggu
			} finally {
				setLoading(false);
			}
		};
		fetchArticles();
	}, []);

	if (loading) {
		return <div className="text-center">Memuat artikel...</div>;
	}

	return (
		<>
			<h2 className="text-2xl font-bold text-primary mb-4">
				Info & Artikel Terbaru
			</h2>
			<p className="text-gray-600 mb-6">
				Baca berita dan kegiatan terbaru dari kami.
			</p>

			<div className="space-y-4">
				{articles.length > 0 ? (
					articles.map((article) => (
						<Link
							to={`/articles/${article.id}`}
							key={article.id}
							className="block bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
						>
							<div className="flex gap-4">
								<img
									src={
										article.thumbnail_url ||
										"https://placehold.co/300x200/1A2347/FFFFFF?text=BJFS"
									}
									alt={article.title}
									className="w-32 h-32 object-cover flex-shrink-0"
								/>
								<div className="flex-1 py-2 pr-4">
									<p className="text-xs text-secondary font-semibold mb-1">
										{new Date(article.created_at).toLocaleDateString("id-ID", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</p>
									<h3 className="text-lg font-bold text-primary mb-2 line-clamp-2">
										{article.title}
									</h3>
									<p className="text-gray-600 text-sm line-clamp-2">
										{article.content_preview}
									</p>
								</div>
							</div>
						</Link>
					))
				) : (
					<div className="text-center text-gray-500">
						Tidak ada artikel terbaru saat ini.
					</div>
				)}
			</div>

			<div className="text-center mt-6">
				<Link
					to="/articles"
					className="inline-block px-6 py-2 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-dark transition-colors"
				>
					Lihat Semua Artikel
				</Link>
			</div>
		</>
	);
};

export default LatestArticles;
