// File: src/pages/admin/ArticleManagementPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

const ArticleManagementPage = () => {
	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchArticles = useCallback(async () => {
		setLoading(true);
		try {
			const response = await axios.get("/api/admin/articles/list.php");
			setArticles(response.data);
		} catch (error) {
			Swal.fire("Error", "Gagal memuat daftar artikel.", "error");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchArticles();
	}, [fetchArticles]);

	const handleDelete = (articleId, title) => {
		Swal.fire({
			title: `Hapus artikel "${title}"?`,
			text: "Tindakan ini tidak dapat dibatalkan.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			confirmButtonText: "Ya, hapus!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await axios.post("/api/admin/articles/delete.php", { id: articleId });
					Swal.fire("Dihapus!", "Artikel telah berhasil dihapus.", "success");
					fetchArticles();
				} catch (err) {
					Swal.fire("Gagal!", "Gagal menghapus artikel.", "error");
				}
			}
		});
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-800">Manajemen Artikel</h1>
				<Link
					to="/admin/articles/new"
					className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg font-semibold"
				>
					<FiPlus /> Tambah Artikel
				</Link>
			</div>
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<table className="w-full text-left">
					<thead className="bg-gray-50 border-b">
						<tr>
							<th className="p-4 font-semibold">Judul</th>
							<th className="p-4 font-semibold">Penulis</th>
							<th className="p-4 font-semibold">Tanggal Dibuat</th>
							<th className="p-4 font-semibold text-right">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan="4" className="p-4 text-center">
									Memuat...
								</td>
							</tr>
						) : (
							articles.map((article) => (
								<tr key={article.id} className="border-b hover:bg-gray-50">
									<td className="p-4 font-semibold text-primary">
										{article.title}
									</td>
									<td className="p-4 text-gray-600">{article.author_name}</td>
									<td className="p-4 text-gray-600">
										{new Date(article.created_at).toLocaleDateString("id-ID")}
									</td>
									<td className="p-4 text-right">
										<Link
											// SEBELUMNYA: to={`/admin/articles/edit/${article.id}`}
											// DIUBAH MENJADI:
											to={`/admin/articles/${article.id}`} // Hapus '/edit'
											className="text-blue-600 p-2"
										>
											<FiEdit />
										</Link>
										<button
											onClick={() => handleDelete(article.id, article.title)}
											className="text-red-600 p-2"
										>
											<FiTrash2 />
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ArticleManagementPage;
