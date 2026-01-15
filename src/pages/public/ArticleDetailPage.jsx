import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
	FiArrowLeft,
	FiFacebook,
	FiInstagram,
	FiYoutube,
	FiTwitter,
	FiPhone,
} from "react-icons/fi"; // Import ikon
import Header from "../../layouts/Header";
import ArticleSidebar from "../../components/articles/ArticleSidebar";
import { Footer } from "../../layouts/Footer";
import SEO from "../../components/common/SEO";

const ArticleDetailPage = () => {
	const { id } = useParams();
	const [article, setArticle] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchArticle = async () => {
			try {
				setLoading(true);
				setError(""); // Reset error setiap kali ID berubah
				const response = await axios.get(
					`/api/public/articles/detail.php?id=${id}`
				);
				setArticle(response.data);
				window.scrollTo(0, 0); // Scroll ke atas halaman saat artikel baru dimuat
			} catch (err) {
				setError("Artikel yang Anda cari tidak ditemukan.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		fetchArticle();
	}, [id]); // Efek ini akan berjalan lagi setiap kali 'id' dari URL berubah

	if (loading) {
		return <div className="text-center py-40">Memuat artikel...</div>;
	}

	if (error) {
		return (
			<>
				<Header />
				<div className="text-center py-40">
					<h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
					<Link to="/articles" className="text-blue-500 hover:underline">
						Kembali ke Daftar Artikel
					</Link>
				</div>
			</>
		);
	}

	if (!article) return null;

	// Extract plain text from HTML content for meta description
	const getPlainTextFromHTML = (html) => {
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = html;
		return tempDiv.textContent || tempDiv.innerText || '';
	};

	// Generate meta description (first 160 characters)
	const metaDescription = getPlainTextFromHTML(article.content).substring(0, 160) + '...';

	// Generate keywords from title
	const metaKeywords = `${article.title}, bogor junior, berita sepakbola, artikel sepakbola, ssb bogor`;

	return (
		<>
			<SEO
				title={article.title}
				description={metaDescription}
				keywords={metaKeywords}
				image={article.thumbnail_url}
				url={`/articles/${article.id}`}
				type="article"
				article={{
					publishedTime: article.created_at,
					modifiedTime: article.updated_at || article.created_at,
					author: 'Bogor Junior FS',
					category: 'Berita',
					tags: article.title.split(' ').slice(0, 5), // Use first 5 words as tags
				}}
			/>
			<Header />
			<Link
				to="/" // Arahkan ke halaman daftar artikel
				className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-8 hover:underline px-12 pt-6"
			>
				<FiArrowLeft />
				Kembali ke Home
			</Link>
			<div className="bg-white ">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					{/* Tombol Kembali */}

					{/* Grid Layout 2 Kolom */}
					<div className="grid lg:grid-cols-3 lg:gap-x-12 gap-y-8">
						{/* Kolom Utama (Isi Artikel) */}
						<main className="lg:col-span-2">
							<article>
								<header className="mb-8">
									<h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
										{article.title}
									</h1>
									<p className="text-gray-500 text-lg">
										Dipublikasikan pada{" "}
										{new Date(article.created_at).toLocaleDateString("id-ID", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</p>
								</header>

								{article.thumbnail_url && (
									<img
										src={article.thumbnail_url}
										alt={article.title}
										className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg mb-8"
									/>
								)}

								{/* Konten Artikel dengan Justify */}
								<div
									className="prose prose-lg max-w-none prose-justify text-justify"
									dangerouslySetInnerHTML={{ __html: article.content }}
								/>
							</article>
						</main>

						{/* Kolom Sidebar */}
						<div className="lg:col-span-1">
							<ArticleSidebar currentArticleId={id} />
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default ArticleDetailPage;
