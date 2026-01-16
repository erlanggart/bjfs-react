// File: src/pages/ArticlesPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDebounce } from "use-debounce";
import { FiSearch } from "react-icons/fi";
import Header from "../layouts/Header";
import { Footer } from "../layouts/Footer";
import SEO from "../components/common/SEO";

const ArticleCard = ({ article, delay }) => (
	<Link
		to={`/articles/${article.id}`}
		className="bg-white rounded-xl shadow-lg overflow-hidden block hover:-translate-y-2 transition-transform duration-300"
		data-aos="fade-up"
		data-aos-delay={delay}
	>
		<img
			src={
				article.thumbnail_url ||
				"https://placehold.co/600x400/1A2347/FFFFFF?text=BJFS"
			}
			alt={article.title}
			className="w-full h-48 object-cover"
		/>
		<div className="p-6">
			<p className="text-xs text-secondary font-semibold">
				{new Date(article.created_at).toLocaleDateString("id-ID", {
					day: "numeric",
					month: "long",
					year: "numeric",
				})}
			</p>
			<h3 className="text-xl font-bold text-primary mt-2 mb-3 h-14 overflow-hidden">
				{article.title}
			</h3>
			{/* Menghapus tag HTML dari konten untuk pratinjau */}
			<p className="text-gray-600 text-sm line-clamp-3 h-16">
				{article.content.replace(/<[^>]+>/g, "")}
			</p>
		</div>
	</Link>
);

const ArticlesPage = () => {
	const [articles, setArticles] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

	const fetchArticles = useCallback(async (currentPage, search) => {
		setLoading(true);
		try {
			const response = await axios.get("/api/public/articles/list", {
				params: { page: currentPage, search: search },
			});
			const data = response.data;
			// Pastikan data yang diterima adalah objek yang diharapkan
			if (data && Array.isArray(data.articles)) {
				setArticles((prev) =>
					currentPage === 1 ? data.articles : [...prev, ...data.articles]
				);
				setHasMore(currentPage < data.total_pages);
			} else {
				setArticles([]);
				setHasMore(false);
			}
		} catch (error) {
			console.error("Gagal memuat artikel", error);
			setArticles([]);
			setHasMore(false);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		setArticles([]);
		setPage(1);
		setHasMore(true);
		fetchArticles(1, debouncedSearchTerm);
	}, [debouncedSearchTerm, fetchArticles]);

	const loadMore = () => {
		const nextPage = page + 1;
		setPage(nextPage);
		fetchArticles(nextPage, debouncedSearchTerm);
	};

	return (
		<div className="bg-gray-100 min-h-screen">
			<SEO
				title="Berita & Artikel"
				description="Baca berita terbaru dan artikel menarik seputar Bogor Junior Football School. Update kegiatan, prestasi, dan informasi sekolah sepakbola terbaik di Bogor."
				keywords="berita bogor junior, artikel sepakbola, berita ssb bogor, kegiatan sepakbola anak, prestasi bogor junior"
				url="/articles"
			/>
			<Header />
			<div className="container mx-auto px-6 py-12">
				{/* Tombol Kembali */}
				<div className="mb-6">
					<Link
						to="/"
						className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg shadow hover:bg-gray-50 transition-colors"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
								clipRule="evenodd"
							/>
						</svg>
						Kembali ke Beranda
					</Link>
				</div>

				<h1 className="text-4xl font-bold text-primary text-center mb-4">
					Artikel & Berita
				</h1>
				<p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
					Temukan informasi terbaru, tips latihan, dan cerita inspiratif dari
					keluarga besar Bogor Junior Futsal School.
				</p>

				<div className="relative mb-8 max-w-lg mx-auto">
					<FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Cari judul artikel..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-12 pr-4 py-3 border rounded-full shadow-sm focus:ring-2 focus:ring-secondary"
					/>
				</div>

				{loading && articles.length === 0 ? (
					<p className="text-center">Memuat artikel...</p>
				) : articles.length > 0 ? (
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{articles.map((article, index) => (
							<ArticleCard
								key={`${article.id}-${index}`}
								article={article}
								delay={(index % 3) * 100}
							/>
						))}
					</div>
				) : (
					<p className="text-center text-gray-500 py-10">
						Tidak ada artikel yang cocok dengan pencarian Anda.
					</p>
				)}

				{hasMore && !loading && (
					<div className="text-center mt-12">
						<button
							onClick={loadMore}
							className="px-8 py-3 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-colors"
						>
							Muat Lebih Banyak
						</button>
					</div>
				)}
				{loading && articles.length > 0 && (
					<p className="text-center mt-8">Memuat...</p>
				)}
			</div>
			<Footer />
		</div>
	);
};

export default ArticlesPage;
