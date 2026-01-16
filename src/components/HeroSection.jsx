import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FiCheckCircle, FiMapPin } from "react-icons/fi";

const HeroSection = ({ heroImages, scrollToSection }) => {
	return (
		<section className="relative h-[90vh] overflow-hidden">
			{/* Background Slider */}
			<Swiper
				modules={[Navigation, Pagination, Autoplay]}
				spaceBetween={0}
				slidesPerView={1}
				navigation
				pagination={{ clickable: true }}
				autoplay={{ delay: 5000, disableOnInteraction: false }}
				loop={heroImages.length > 1}
				className="h-full hero-slider"
			>
				{heroImages.length > 0 ? (
					heroImages.map((hero) => (
						<SwiperSlide key={hero.id}>
							<div className="relative h-full">
								<img
									src={hero.image_path}
									alt="Hero background"
									className="absolute inset-0 w-full h-full object-cover"
								/>
							</div>
						</SwiperSlide>
					))
				) : (
					<SwiperSlide>
						<div className="relative h-full">
							<img
								src="/lp-1.jpg"
								alt="Anak-anak bermain sepak bola"
								className="absolute inset-0 w-full h-full object-cover"
							/>
						</div>
					</SwiperSlide>
				)}
			</Swiper>

			{/* Static Overlay Content */}
			<div className="absolute inset-0 bg-black/60 z-20 pointer-events-none"></div>
			<div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
				<div className="text-center px-6 max-w-4xl mx-auto text-white">
					{/* Logo BJFS */}
					<img
						src="/bjfslogooutline.svg"
						alt="Bogor Junior Logo"
						className="max-w-xs md:max-w-md mx-auto mb-6"
						data-aos="fade-down"
					/>
					
					{/* Title */}
					<h1
						className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight"
						data-aos="fade-up"
					>
						Kami Tidak Hanya Melatih Futsal.<br />
						Kami Melatih Anak untuk Berani Menghadapi Hidup.
					</h1>
					
					{/* Subtitle */}
					<div
						className="text-sm md:text-lg max-w-3xl mx-auto mb-8 space-y-2"
						data-aos="fade-up"
						data-aos-delay="200"
					>
						<p>Setiap anak lahir dengan rasa ingin tahu dan keberanian.</p>
						<p>Tapi banyak yang tumbuh dengan rasa takut gagal, takut salah, dan takut mencoba.</p>
						<p className="font-semibold mt-4">Di BJFS, kami percaya keberanian bisa dilatih.</p>
						<p>Lewat futsal, kami bantu anak-anak belajar fokus, percaya diri, dan kerja sama — bukan lewat tekanan, tapi lewat kegembiraan.</p>
					</div>
					
					{/* CTA Buttons */}
					<div 
						className="flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto"
						data-aos="fade-up"
						data-aos-delay="400"
					>
						<a
							href="https://wa.me/6281315261946?text=Halo,%20saya%20ingin%20coba%20trial%20gratis%20di%20Bogor%20Junior%20Futsal%20School"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 bg-secondary text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:opacity-90 transition-transform hover:scale-105"
						>
							<FiCheckCircle size={20} />
							Coba Trial Gratis
						</a>
						<button
							onClick={() => scrollToSection('cabang')}
							className="flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:opacity-90 transition-transform hover:scale-105"
						>
							<FiMapPin size={20} />
							Lihat Cabang Terdekat
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
