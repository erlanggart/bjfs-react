import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ArticleSidebar = ({ currentArticleId }) => {
	const [articles, setArticles] = useState([]);

	useEffect(() => {
		const fetchRecentArticles = async () => {
			if (!currentArticleId) return;
			try {
				// Panggil API sidebar dengan parameter exclude_id
				const response = await axios.get(
					`/api/public/articles/list_sidebar.php?exclude_id=${currentArticleId}`
				);
				setArticles(response.data);
			} catch (error) {
				console.error("Gagal memuat artikel lainnya:", error);
			}
		};
		fetchRecentArticles();
	}, [currentArticleId]);

	return (
		<aside className="lg:sticky lg:top-24">
			<div className="bg-gray-50 p-6 rounded-lg shadow-sm">
				<h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
					Artikel Lainnya
				</h3>
				{articles.length > 0 ? (
					<ul className="space-y-4">
						{articles.map((article) => (
							<li key={article.id}>
								<Link
									to={`/articles/${article.id}`}
									className="font-semibold text-gray-700 hover:text-blue-600 transition-colors line-clamp-2"
								>
									{article.title}
								</Link>
							</li>
						))}
					</ul>
				) : (
					<p className="text-gray-500">Tidak ada artikel lain.</p>
				)}
			</div>
		</aside>
	);
};

export default ArticleSidebar;
