import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    // Static gallery images for landing page
    const galleryImages = [
        {
            id: 1,
            url: "/lp-1.jpg",
            title: "Latihan Intensif",
            description: "Para pemain cilik berlatih dengan penuh semangat",
            featured: true,
        },
        {
            id: 2,
            url: "/lp-3.jpg",
            title: "Kerja Sama Tim",
            description: "Membangun chemistry antar pemain",
        },
        {
            id: 3,
            url: "/coach.jpg",
            title: "Arahan Pelatih",
            description: "Pelatih memberikan instruksi kepada para pemain",
        },
        {
            id: 4,
            url: "/gallery-4.JPG",
            title: "Keluarga Besar",
            description: "Momen kebersamaan BJFS",
        },
        {
            id: 5,
            url: "/gallery-5.JPG",
            title: "Aksi di Lapangan",
            description: "Aksi spektakuler di pertandingan",
        },
        {
            id: 6,
            url: "/gallery-1.JPG",
            title: "Mini Match",
            description: "Pertandingan seru antar tim",
        },
        {
            id: 7,
            url: "/umur3.jpg",
            title: "Pemain Cilik",
            description: "Usia 3-4 tahun mulai mengenal bola",
        },
        {
            id: 8,
            url: "/umur4.jpg",
            title: "Koordinasi",
            description: "Melatih koordinasi dan dasar-dasar futsal",
        },
    ];

    const openLightbox = (image) => {
        setSelectedImage(image);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = "auto";
    };

return (
<section id="galeri" className="py-20 bg-white">
<div className="container mx-auto px-6">
<div className="text-center mb-16">
<h2
className="text-3xl md:text-4xl font-bold text-primary"
data-aos="fade-up"
>
Momen Terbaik di Lapangan
</h2>
<p
className="text-lg text-gray-600 mt-2"
data-aos="fade-up"
data-aos-delay="100"
>
Lihat keseruan dan semangat para juara cilik Bogor Junior.
</p>
</div>

{/* Gallery Grid */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-aos="zoom-in">
{galleryImages.map((image, index) => (
<div
key={image.id}
className={`${
image.featured ? "md:col-span-2 md:row-span-2" : ""
} rounded-xl overflow-hidden group relative cursor-pointer`}
onClick={() => openLightbox(image)}
data-aos="fade-up"
data-aos-delay={index * 50}
>
<img
src={image.url}
alt={image.title}
className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 min-h-[200px]"
loading="lazy"
/>
<div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300 flex items-end p-4">
<div>
<h3 className="text-white font-bold text-lg">{image.title}</h3>
<p className="text-white/80 text-sm hidden group-hover:block transition-all">
{image.description}
</p>
</div>
</div>
</div>
))}
</div>

{/* Tombol Lihat Lebih Banyak */}
<div className="text-center mt-12" data-aos="fade-up">
<Link
to="/gallery"
className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:opacity-90 transition-all hover:scale-105"
>
Lihat Lebih Banyak Foto
</Link>
</div>
</div>

{/* Lightbox Modal */}
{selectedImage && (
<div
className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
onClick={closeLightbox}
>
<button
className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
onClick={closeLightbox}
>
<FiX size={32} />
</button>
<div className="max-w-5xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
<img
src={selectedImage.url}
alt={selectedImage.title}
className="max-w-full max-h-[80vh] object-contain rounded-lg"
/>
<div className="text-center mt-4 text-white">
<h3 className="text-2xl font-bold">{selectedImage.title}</h3>
<p className="text-gray-300 mt-2">{selectedImage.description}</p>
</div>
</div>
</div>
)}
</section>
);
};

export default Gallery;
