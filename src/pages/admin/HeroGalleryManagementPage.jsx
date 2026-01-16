import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiUpload, FiTrash2, FiEdit2, FiImage, FiChevronUp, FiChevronDown, FiEye, FiEyeOff } from "react-icons/fi";

const HeroGalleryManagementPage = () => {
	const [heroImages, setHeroImages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [editingImage, setEditingImage] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({
		image_path: "",
		display_order: 0,
		is_active: 1
	});

	useEffect(() => {
		fetchHeroImages();
	}, []);

	const fetchHeroImages = async () => {
		try {
			const response = await axios.get("/api/admin/hero-gallery");
			setHeroImages(response.data.data);
		} catch (error) {
			console.error("Error fetching hero images:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		setUploading(true);
		const formDataUpload = new FormData();
		formDataUpload.append("image", file);

		try {
			const response = await axios.post("/api/admin/hero-gallery/upload", formDataUpload, {
				headers: { "Content-Type": "multipart/form-data" }
			});
			
		setFormData({ ...formData, image_path: response.data.image_path });
		Swal.fire({
			icon: "success",
			title: "Berhasil!",
			text: "Gambar berhasil diupload",
			timer: 2000,
			showConfirmButton: false
		});
	} catch (error) {
		console.error("Error uploading image:", error);
		Swal.fire({
			icon: "error",
			title: "Gagal!",
			text: error.response?.data?.message || "Gagal mengupload gambar",
			confirmButtonText: "OK"
		});
	} finally {
			setUploading(false);
		}
	};

const handleSubmit = async (e) => {
	e.preventDefault();
	
	if (!formData.image_path) {
		Swal.fire({
			icon: "warning",
			title: "Perhatian!",
			text: "Silakan upload gambar terlebih dahulu",
			confirmButtonText: "OK"
		});
		return;
	}

	try {
		if (editingImage) {
			await axios.put("/api/admin/hero-gallery", { ...formData, id: editingImage.id });
			Swal.fire({
				icon: "success",
				title: "Berhasil!",
				text: "Hero image berhasil diupdate",
				timer: 2000,
				showConfirmButton: false
			});
		} else {
			await axios.post("/api/admin/hero-gallery", formData);
			Swal.fire({
				icon: "success",
				title: "Berhasil!",
				text: "Hero image berhasil ditambahkan",
				timer: 2000,
				showConfirmButton: false
			});
		}
		
		fetchHeroImages();
		resetForm();
		setShowModal(false);
	} catch (error) {
		console.error("Error saving hero image:", error);
		Swal.fire({
			icon: "error",
			title: "Gagal!",
			text: "Gagal menyimpan hero image",
			confirmButtonText: "OK"
		});
	}
};	const handleEdit = (image) => {
		setEditingImage(image);
		setFormData({
			image_path: image.image_path,
			display_order: image.display_order,
			is_active: image.is_active
		});
		setShowModal(true);
	};

const handleDelete = async (id) => {
	const result = await Swal.fire({
		title: "Konfirmasi",
		text: "Apakah Anda yakin ingin menghapus hero image ini?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#d33",
		cancelButtonColor: "#3085d6",
		confirmButtonText: "Ya, Hapus!",
		cancelButtonText: "Batal"
	});

	if (!result.isConfirmed) return;

	try {
		await axios.delete(`/api/admin/hero-gallery/${id}`);
		Swal.fire({
			icon: "success",
			title: "Terhapus!",
			text: "Hero image berhasil dihapus",
			timer: 2000,
			showConfirmButton: false
		});
		fetchHeroImages();
	} catch (error) {
		console.error("Error deleting hero image:", error);
		Swal.fire({
			icon: "error",
			title: "Gagal!",
			text: "Gagal menghapus hero image",
			confirmButtonText: "OK"
		});
	}
};	const handleToggleActive = async (image) => {
		try {
			await axios.put("/api/admin/hero-gallery", {
				...image,
				is_active: image.is_active === 1 ? 0 : 1
			});
			fetchHeroImages();
			Swal.fire({
				icon: "success",
				title: "Berhasil!",
				text: `Hero image ${image.is_active === 1 ? 'dinonaktifkan' : 'diaktifkan'}`,
				timer: 1500,
				showConfirmButton: false
			});
		} catch (error) {
			console.error("Error toggling active status:", error);
			Swal.fire({
				icon: "error",
				title: "Gagal!",
				text: "Gagal mengubah status",
				confirmButtonText: "OK"
			});
		}
	};

	const handleReorder = async (id, direction) => {
		const currentIndex = heroImages.findIndex(img => img.id === id);
		if (
			(direction === "up" && currentIndex === 0) ||
			(direction === "down" && currentIndex === heroImages.length - 1)
		) {
			return;
		}

		const newImages = [...heroImages];
		const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
		[newImages[currentIndex], newImages[targetIndex]] = [newImages[targetIndex], newImages[currentIndex]];

		// Update display_order for both images
		try {
			await Promise.all([
				axios.put("/api/admin/hero-gallery", { ...newImages[currentIndex], display_order: currentIndex }),
				axios.put("/api/admin/hero-gallery", { ...newImages[targetIndex], display_order: targetIndex })
		]);
		fetchHeroImages();
		Swal.fire({
			icon: "success",
			title: "Berhasil!",
			text: "Urutan hero image berhasil diubah",
			timer: 1500,
			showConfirmButton: false
		});
	} catch (error) {
		console.error("Error reordering images:", error);
		Swal.fire({
			icon: "error",
			title: "Gagal!",
			text: "Gagal mengubah urutan",
			confirmButtonText: "OK"
		});
	}
};	const resetForm = () => {
		setEditingImage(null);
		setFormData({
			image_path: "",
			display_order: 0,
			is_active: 1
		});
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-primary">Hero Gallery Management</h1>
				<button
					onClick={() => {
						resetForm();
						setShowModal(true);
					}}
					className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 flex items-center gap-2"
				>
					<FiUpload /> Add New Hero Image
				</button>
			</div>

			{/* Hero Images Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{heroImages.map((image, index) => (
					<div key={image.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
						<div className="relative h-48">
							<img
								src={image.image_path}
								alt={image.title || "Hero image"}
								className="w-full h-full object-cover"
							/>
							<div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
								Order: {image.display_order}
							</div>
							{image.is_active === 0 && (
								<div className="absolute inset-0 bg-black/60 flex items-center justify-center">
									<span className="text-white font-bold">INACTIVE</span>
								</div>
							)}
						</div>
					<div className="p-4">
						<p className="text-gray-600 text-sm mb-4">Hero Background Image</p>
						
						<div className="flex gap-2">
								<button
									onClick={() => handleReorder(image.id, "up")}
									disabled={index === 0}
									className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
									title="Move up"
								>
									<FiChevronUp />
								</button>
								<button
									onClick={() => handleReorder(image.id, "down")}
									disabled={index === heroImages.length - 1}
									className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
									title="Move down"
								>
									<FiChevronDown />
								</button>
								<button
									onClick={() => handleToggleActive(image)}
									className={`p-2 rounded hover:opacity-80 ${image.is_active === 1 ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}
									title={image.is_active === 1 ? "Active - Click to deactivate" : "Inactive - Click to activate"}
								>
									{image.is_active === 1 ? <FiEye /> : <FiEyeOff />}
								</button>
								<button
									onClick={() => handleEdit(image)}
									className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
									title="Edit"
								>
									<FiEdit2 />
								</button>
								<button
									onClick={() => handleDelete(image.id)}
									className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
									title="Delete"
								>
									<FiTrash2 />
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Modal for Add/Edit */}
			{showModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<h2 className="text-2xl font-bold mb-4">
								{editingImage ? "Edit Hero Image" : "Add New Hero Image"}
							</h2>
							
							<form onSubmit={handleSubmit} className="space-y-4">
								{/* Image Upload */}
								<div>
									<label className="block text-sm font-medium mb-2">Image</label>
									{formData.image_path ? (
										<div className="relative">
											<img
												src={formData.image_path}
												alt="Preview"
												className="w-full h-64 object-cover rounded-lg"
											/>
											<button
												type="button"
												onClick={() => setFormData({ ...formData, image_path: "" })}
												className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
											>
												<FiTrash2 />
											</button>
										</div>
									) : (
										<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
											<FiImage className="mx-auto text-gray-400 text-4xl mb-2" />
											<label className="cursor-pointer">
												<span className="text-primary hover:underline">
													{uploading ? "Uploading..." : "Click to upload image"}
												</span>
												<input
													type="file"
													accept="image/*"
													onChange={handleImageUpload}
													disabled={uploading}
													className="hidden"
												/>
											</label>
										</div>
									)}
								</div>

								{/* Display Order */}
								<div>
									<label className="block text-sm font-medium mb-2">Display Order</label>
									<input
										type="number"
										value={formData.display_order}
										onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
										className="w-full border rounded-lg px-4 py-2"
										min="0"
									/>
								</div>

								{/* Is Active */}
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={formData.is_active === 1}
										onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
										className="w-4 h-4"
										id="is_active"
									/>
									<label htmlFor="is_active" className="text-sm font-medium">Active</label>
								</div>

								{/* Buttons */}
								<div className="flex gap-2 pt-4">
									<button
										type="submit"
										className="flex-1 bg-primary text-white py-2 rounded-lg hover:opacity-90"
									>
										{editingImage ? "Update" : "Create"}
									</button>
									<button
										type="button"
										onClick={() => {
											setShowModal(false);
											resetForm();
										}}
										className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default HeroGalleryManagementPage;
