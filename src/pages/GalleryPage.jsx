import React, { useEffect, useState } from "react";
import { FiX, FiDownload, FiExternalLink, FiArrowLeft, FiFolder } from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../services/api";

const GalleryPage = () => {
const [selectedImage, setSelectedImage] = useState(null);
const [albums, setAlbums] = useState([]);
const [selectedAlbum, setSelectedAlbum] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

	// Get Google Drive links from env (support multiple links)
	const DRIVE_FOLDER_URLS = (import.meta.env.VITE_GDRIVE_LINKS || "").split(',').filter(Boolean);
	const GALLERY_API_PATH = import.meta.env.VITE_GALLERY_API_PATH || '/api/public/google_drive_albums.php';

	useEffect(() => {
		let isCancelled = false;
		
		const fetchAlbums = async () => {
			setLoading(true);
			setError(null);
			
			try {
				const response = await api.get(GALLERY_API_PATH);
				
				if (isCancelled) return;
				
				const json = response.data;
				
				if (isCancelled) return;
				
				if (json && Array.isArray(json.albums) && json.albums.length > 0) {
					setAlbums(json.albums);
					setError(null);
				} else {
					setError("Tidak ada album ditemukan");
				}
			} catch (err) {
				if (isCancelled) return;
				setError(err.message || "Gagal mengambil data gallery dari server");
			} finally {
				if (!isCancelled) {
					setLoading(false);
				}
			}
		};
		
		fetchAlbums();

		return () => {
			isCancelled = true;
		};
	}, [GALLERY_API_PATH]);

const openLightbox = (image) => {
setSelectedImage(image);
document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
setSelectedImage(null);
document.body.style.overflow = "auto";
};

const handleDownload = async (image) => {
try {
const response = await fetch(image.url);
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = image.name || 'photo.jpg';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
window.URL.revokeObjectURL(url);
} catch (error) {
console.error('Download error:', error);
alert('Gagal mengunduh foto. Silakan coba lagi.');
}
};

const openAlbum = (album) => {
setSelectedAlbum(album);
window.scrollTo({ top: 0, behavior: 'smooth' });
};

const backToAlbums = () => {
setSelectedAlbum(null);
};

return (
<div className="min-h-screen bg-gray-50">
{/* Header */}
<header className="bg-white shadow-sm sticky top-0 z-40">
<div className="container mx-auto px-6 py-4">
<div className="flex items-center justify-between">
<div className="flex items-center gap-4">
<Link
to="/"
className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
>
<FiArrowLeft size={20} />
<span className="font-medium">Kembali</span>
</Link>
{selectedAlbum && (
<>
<span className="text-gray-300">/</span>
<button
onClick={backToAlbums}
className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
>
<FiFolder size={18} />
<span>Albums</span>
</button>
<span className="text-gray-300">/</span>
<span className="text-primary font-semibold">{selectedAlbum.name}</span>
</>
)}
</div>
{DRIVE_FOLDER_URLS.length > 0 && (
	<div className="flex items-center gap-3">
		{DRIVE_FOLDER_URLS.length === 1 ? (
			<a
				href={DRIVE_FOLDER_URLS[0]}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
			>
				<FiExternalLink size={18} />
				<span className="hidden md:inline">Buka di Google Drive</span>
			</a>
		) : (
			<div className="relative group">
				<button className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
					<FiExternalLink size={18} />
					<span className="hidden md:inline">Google Drive ({DRIVE_FOLDER_URLS.length})</span>
				</button>
				<div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg py-2 min-w-[200px] hidden group-hover:block z-50">
					{DRIVE_FOLDER_URLS.map((url, index) => (
						<a
							key={index}
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
						>
							📁 Folder {index + 1}
						</a>
					))}
				</div>
			</div>
		)}
	</div>
)}
</div>
</div>
</header>

{/* Hero Section */}
<section className="bg-primary text-white py-12">
<div className="container mx-auto px-6 text-center">
<h1 className="text-3xl md:text-4xl font-bold mb-2" data-aos="fade-up">
{selectedAlbum ? selectedAlbum.name : "Galeri Foto"}
</h1>
<p className="text-lg text-white/90" data-aos="fade-up" data-aos-delay="100">
{selectedAlbum 
? `${selectedAlbum.photoCount} foto`
: "Kumpulan momen terbaik Bogor Junior Football School"
}
</p>
</div>
</section>

{/* Content */}
<section className="py-12">
<div className="container mx-auto px-6">
{/* Loading State */}
{loading && (
<div className="text-center py-20">
<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
<p className="text-gray-600">Memuat {selectedAlbum ? 'foto' : 'album'}...</p>
</div>
)}

{/* Error State */}
{error && !loading && (
<div className="text-center py-20">
<p className="text-red-600 mb-4">⚠️ {error}</p>
{DRIVE_FOLDER_URLS.length > 0 && (
	<div className="flex flex-col gap-2 items-center">
		<p className="text-gray-600 mb-2">Atau lihat langsung di Google Drive:</p>
		{DRIVE_FOLDER_URLS.map((url, index) => (
			<a
				key={index}
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="text-primary hover:underline"
			>
				📁 Folder {index + 1} →
			</a>
		))}
	</div>
)}
</div>
)}

{/* Albums View */}
{!loading && !error && !selectedAlbum && albums.length > 0 && (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="fade-up">
{albums.map((album, index) => (
<div
key={album.id}
className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
onClick={() => openAlbum(album)}
data-aos="fade-up"
data-aos-delay={index * 50}
>
<div className="aspect-video relative overflow-hidden bg-gray-200">
<img
src={album.coverPhoto}
alt={album.name}
className="w-full h-full object-cover"
loading="lazy"
/>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
<div className="absolute bottom-0 left-0 right-0 p-4 text-white">
<div className="flex items-center gap-2 text-sm mb-1">
<FiFolder size={16} />
<span>{album.photoCount} foto</span>
</div>
</div>
</div>
<div className="p-4">
<h3 className="text-lg font-bold text-gray-800 mb-1">{album.name}</h3>
<p className="text-sm text-gray-600">
Klik untuk melihat semua foto
</p>
</div>
</div>
))}
</div>
)}

{/* Photos View */}
{!loading && !error && selectedAlbum && (
<>
<div className="flex justify-between items-center mb-6">
<p className="text-gray-600">
Menampilkan {selectedAlbum.photoCount} foto
</p>
<button
onClick={backToAlbums}
className="flex items-center gap-2 text-primary hover:underline"
>
<FiArrowLeft size={18} />
Kembali ke Albums
</button>
</div>
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
{selectedAlbum.photos.map((photo, index) => (
<div
key={photo.id}
className="rounded-xl overflow-hidden group relative cursor-pointer aspect-square"
onClick={() => openLightbox(photo)}
data-aos="fade-up"
data-aos-delay={Math.min(index * 20, 300)}
>
<img
src={photo.url}
alt={photo.name}
className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
loading="lazy"
/>
<div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
<p className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity px-2 text-center text-sm line-clamp-2">
{photo.name}
</p>
</div>
</div>
))}
</div>
</>
)}
</div>
</section>

{/* Lightbox Modal */}
{selectedImage && (
<div
className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
onClick={closeLightbox}
>
{/* Close Button */}
<button
className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
onClick={closeLightbox}
aria-label="Close"
>
<FiX size={32} />
</button>

{/* Download Button */}
<button
className="absolute top-4 right-16 text-white hover:text-gray-300 transition-colors z-10"
onClick={(e) => {
e.stopPropagation();
handleDownload(selectedImage);
}}
aria-label="Download"
title="Unduh foto"
>
<FiDownload size={28} />
</button>

<div
className="max-w-6xl max-h-[90vh] relative"
onClick={(e) => e.stopPropagation()}
>
<img
src={selectedImage.url}
alt={selectedImage.name}
className="max-w-full max-h-[85vh] object-contain rounded-lg"
/>
<div className="text-center mt-4 text-white">
<h3 className="text-xl font-bold line-clamp-2">{selectedImage.name}</h3>
</div>
</div>
</div>
)}
</div>
);
};

export default GalleryPage;
