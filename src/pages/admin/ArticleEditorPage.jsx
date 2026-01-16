// File: src/pages/admin/ArticleEditorPage.jsx
import React, {
	useState,
	useEffect,
	useMemo,
	useRef,
	useCallback,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { FiSave } from "react-icons/fi";

const ArticleEditorPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	// PERBAIKAN: Logika yang benar untuk menentukan mode edit.
	// Hanya anggap mode edit jika 'id' ada DAN bukan string 'new'.
	const isEditMode = id && id !== "new";

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [thumbnail, setThumbnail] = useState(null);
	const [thumbnailPreview, setThumbnailPreview] = useState("");
	const [loading, setLoading] = useState(true); // Default ke true untuk menangani pemuatan data

	const quillRef = useRef(null);

	const imageHandler = useCallback(() => {
		const input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", "image/*");
		input.click();

		input.onchange = async () => {
			if (input.files && input.files.length > 0) {
				const file = input.files[0];
				const formData = new FormData();
				formData.append("image", file);

				const uploadToast = Swal.fire({
					title: "Mengunggah gambar...",
					allowOutsideClick: false,
					didOpen: () => {
						Swal.showLoading();
					},
				});

				try {
					const response = await axios.post(
						"/api/admin/articles/upload-image",
						formData,
						{
							headers: { "Content-Type": "multipart/form-data" },
						}
					);

					const imageUrl = response.data.url;
					const quill = quillRef.current.getEditor();
					const range = quill.getSelection(true);
					quill.insertEmbed(range.index, "image", imageUrl);
					uploadToast.close();
				} catch (error) {
					uploadToast.close();
					Swal.fire("Gagal!", "Gagal mengunggah gambar.", "error");
				}
			}
		};
	}, []);

	const modules = useMemo(
		() => ({
			toolbar: {
				container: [
					[{ header: [1, 2, 3, false] }],
					["bold", "italic", "underline", "strike", "blockquote"],
					[
						{ list: "ordered" },
						{ list: "bullet" },
						{ indent: "-1" },
						{ indent: "+1" },
					],
					["link", "image"],
					["clean"],
				],
				handlers: { image: imageHandler },
			},
		}),
		[imageHandler]
	);

	const formats = [
		"header",
		"bold",
		"italic",
		"underline",
		"strike",
		"blockquote",
		"list",
		"indent",
		"link",
		"image",
	];

	useEffect(() => {
		// Hanya jalankan fetch jika benar-benar dalam mode edit
		if (isEditMode) {
			setLoading(true);
			axios
				.get(`/api/admin/articles/${id}`)
				.then((res) => {
					setTitle(res.data.article.title);
					setContent(res.data.article.content);
					setThumbnailPreview(res.data.article.thumbnail_url);
				})
				.catch(() => Swal.fire("Error", "Gagal memuat data artikel.", "error"))
				.finally(() => setLoading(false));
		} else {
			// Jika mode tambah baru, langsung siap digunakan
			setLoading(false);
		}
	}, [id, isEditMode]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData();
		formData.append("title", title);
		formData.append("content", content);
		if (thumbnail) {
			formData.append("thumbnail", thumbnail);
		}
		if (isEditMode) {
			formData.append("id", id);
		}

		try {
			if (isEditMode) {
				await axios.put(`/api/admin/articles/${id}`, formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
			} else {
				await axios.post("/api/admin/articles", formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
			}
			Swal.fire(
				"Berhasil!",
				`Artikel telah ${isEditMode ? "diperbarui" : "dibuat"}.`,
				"success"
			);
			navigate("/admin/articles");
		} catch (error) {
			Swal.fire(
				"Gagal",
				error.response?.data?.message || "Terjadi kesalahan.",
				"error"
			);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <p className="text-center p-10">Memuat editor...</p>;
	}

	return (
		<div className="p-4 sm:p-6">
			<h1 className="text-2xl font-bold text-gray-800 mb-6">
				{isEditMode ? "Edit Artikel" : "Tulis Artikel Baru"}
			</h1>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="bg-white p-6 rounded-lg shadow-sm">
					<label className="block text-sm font-semibold text-gray-700 mb-2">
						Judul Artikel
					</label>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full p-2 border rounded"
						required
					/>
				</div>
				<div className="bg-white p-6 rounded-lg shadow-sm">
					<label className="block text-sm font-semibold text-gray-700 mb-2">
						Gambar Thumbnail
					</label>
					{thumbnailPreview && (
						<img
							src={thumbnailPreview}
							alt="Preview"
							className="w-48 h-auto rounded mb-2"
						/>
					)}
					<input
						type="file"
						accept="image/*"
						onChange={(e) => {
							setThumbnail(e.target.files[0]);
							setThumbnailPreview(URL.createObjectURL(e.target.files[0]));
						}}
						className="w-full p-2 border rounded"
					/>
				</div>
				<div className="bg-white p-6 rounded-lg shadow-sm">
					<label className="block text-sm font-semibold text-gray-700 mb-2">
						Konten Artikel
					</label>
					<ReactQuill
						ref={quillRef}
						theme="snow"
						value={content}
						onChange={setContent}
						modules={modules}
						formats={formats}
						className="min-h-[300px]"
					/>
				</div>
				<div className="text-right">
					<button
						type="submit"
						disabled={loading}
						className="px-6 py-2 bg-secondary text-white font-semibold rounded-lg flex items-center gap-2"
					>
						<FiSave /> {loading ? "Menyimpan..." : "Simpan Artikel"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default ArticleEditorPage;
