// File: src/pages/LandingPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css"; // Impor CSS untuk AOS
import {
	FiCheck,
	FiChevronDown,
	FiFacebook,
	FiInstagram,
	FiPhone,
	FiTwitter,
	FiYoutube,
	FiZap,
	FiUserCheck,
	FiThumbsUp,
	FiMapPin,
	FiX,
	FiCheckCircle,
} from "react-icons/fi";
import { RiBardLine, RiFocus3Line, RiUserStarLine } from "react-icons/ri";
import { MdOutlineStadium } from "react-icons/md";
import { IoIosFootball, IoIosRocket, IoIosStar } from "react-icons/io";
import {
	FaMap,
	FaMapMarkerAlt,
	FaMapPin,
	FaUser,
	FaUserShield,
	FaWhatsapp,
} from "react-icons/fa";
import { IoSchoolSharp } from "react-icons/io5";

// Impor Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import LatestArticles from "../components/landing/LastestArticle";
import LatestMatchesSection from "../components/landing/LatestMatchesSection";
import BranchesWithCoachesSection from "../components/BranchesWithCoachesSection";
import RealTimeGoogleAnalyticsStats from "../components/RealTimeGoogleAnalyticsStats";
import HistoricalAnalyticsStats from "../components/HistoricalAnalyticsStats";
import Gallery from "../components/landing/Gallery";
import HeroSection from "../components/HeroSection";
import {
	useGoogleAnalytics,
	trackButtonClick,
} from "../hooks/useGoogleAnalytics";

const AnimatedCounter = ({ target }) => {
	const [count, setCount] = useState(0);
	const countRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					// Jika elemen terlihat, mulai animasi
					let start = 0;
					const end = parseInt(target, 10);
					if (start === end) return;

					const duration = 2000; // Durasi animasi 2 detik
					const range = end - start;
					let startTime = null;

					const step = (timestamp) => {
						if (!startTime) startTime = timestamp;
						const progress = Math.min((timestamp - startTime) / duration, 1);
						setCount(Math.floor(progress * range + start));
						if (progress < 1) {
							window.requestAnimationFrame(step);
						}
					};
					window.requestAnimationFrame(step);
				} else {
					// Jika elemen tidak terlihat, reset hitungan ke 0
					setCount(0);
				}
			},
			{ threshold: 0.5 } // Memicu saat 50% elemen terlihat
		);

		const currentRef = countRef.current;
		if (currentRef) {
			observer.observe(currentRef);
		}

		// Cleanup function
		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
		};
	}, [target]);

	return (
		<p ref={countRef} className="text-secondary font-bold text-8xl">
			{count}
		</p>
	);
};

const FAQItem = ({ question, children, delay }) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div
			className="border-b border-[var(--color-secondary)]"
			data-aos="fade-up"
			data-aos-delay={delay}
		>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex justify-between items-center text-left py-5"
			>
				<h3 className="text-lg font-bold text-primary">{question}</h3>
				<FiChevronDown
					className={`transform transition-transform duration-300 ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>
			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out ${
					isOpen ? "max-h-screen" : "max-h-0"
				}`}
			>
				<div className="pb-5 text-gray-600">{children}</div>
			</div>
		</div>
	);
};

const LandingPage = () => {
	const [totalMembers, setTotalMembers] = useState(0);
	const [heroImages, setHeroImages] = useState([]);
	const [showDropdown, setShowDropdown] = useState(false);

	// Initialize Google Analytics
	useGoogleAnalytics();

	// Inisialisasi AOS
	useEffect(() => {
		AOS.init({
			duration: 800,
			once: false, // Animasi akan berulang saat scroll kembali
		});
	}, []);

	// Fetch data total members and hero images
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [branchRes, heroRes] = await Promise.all([
					axios.get("/api/public/branches"),
					axios.get("/api/public/hero_gallery")
				]);

				const branchData = branchRes.data;
				// Hitung total member dari semua cabang
				const total = branchData.reduce(
					(sum, branch) => sum + parseInt(branch.member_count, 10),
					0
				);

				setTotalMembers(4000 + total);
				setHeroImages(heroRes.data.data || []);
			} catch (error) {
				console.error("Gagal memuat data landing page:", error);
			}
		};
		fetchData();
	}, []);	// ...DENGAN FUNGSI BARU YANG LEBIH KOMPATIBEL DI BAWAH INI
	const scrollToSection = (sectionId) => {
		// Track navigation click
		trackButtonClick(`Navigate to ${sectionId}`, "Navigation");

		const section = document.getElementById(sectionId);
		if (!section) return;

		const headerOffset = 80; // Sesuaikan offset header jika perlu
		const targetPosition =
			section.getBoundingClientRect().top + window.pageYOffset - headerOffset;
		const startPosition = window.pageYOffset;
		const distance = targetPosition - startPosition;
		const duration = 700; // Durasi animasi dalam milidetik (misal: 0.7 detik)
		let startTime = null;

		const animation = (currentTime) => {
			if (startTime === null) startTime = currentTime;
			const timeElapsed = currentTime - startTime;

			// Menggunakan formula easing 'easeInOutQuad' untuk gerakan yang lebih alami
			const run = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
			const progress = run(Math.min(timeElapsed / duration, 1));

			window.scrollTo(0, startPosition + distance * progress);

			if (timeElapsed < duration) {
				requestAnimationFrame(animation);
			}
		};

		requestAnimationFrame(animation);
	};
	return (
		<div className="bg-gray-50 text-gray-800 font-sans">
			<style>
				{`
                    .hero-slider .swiper-button-next, .hero-slider .swiper-button-prev {
                        color: #FFFFFF;
                        background-color: rgba(217, 30, 91, 0.8);
                        border-radius: 50%;
                        width: 44px;
                        height: 44px;
                    }
                    .hero-slider .swiper-button-next:after, .hero-slider .swiper-button-prev:after {
                        font-size: 20px;
                        font-weight: bold;
                    }
                    .hero-slider .swiper-pagination-bullet {
                        background-color: rgba(255, 255, 255, 0.5);
                        width: 12px;
                        height: 12px;
                    }
                    .hero-slider .swiper-pagination-bullet-active {
                        background-color: #D91E5B;
                        width: 30px;
                        border-radius: 6px;
                    }
                    
                    .merch-slider .swiper-button-next, .merch-slider .swiper-button-prev {
                        color: #D91E5B;
                        background-color: rgba(255, 255, 255, 0.7);
                        border-radius: 50%;
                        width: 44px;
                        height: 44px;
                    }
                     .merch-slider .swiper-button-next:after, .merch-slider .swiper-button-prev:after {
                        font-size: 20px;
                        font-weight: bold;
                    }
                    .merch-slider .swiper-pagination-bullet-active {
                        background-color: #D91E5B;
                    }
                `}
			</style>
			{/* Header */}
			<header className="bg-[var(--color-primary)]/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
				<div className="container mx-auto px-6 py-3 flex justify-between items-center">
					<div className="flex items-center gap-2">
						<img src="/bjfs_logo.svg" alt="Logo BJFS" className="w-10 h-10" />
						<span className="text-white text-lg font-bold">Bogor Junior</span>
					</div>
					<nav className="hidden md:flex items-center space-x-6">
						<a
							onClick={() => scrollToSection("feature-programs")}
							className="text-white hover:text-secondary transition-colors cursor-pointer font-semibold"
						>
							Program
						</a>
						<a
							onClick={() => scrollToSection("coach")}
							className="text-white hover:text-secondary transition-colors cursor-pointer font-semibold"
						>
							Coach
						</a>
						<a
							onClick={() => scrollToSection("cabang")}
							className="text-white hover:text-secondary transition-colors cursor-pointer font-semibold"
						>
							Cabang
						</a>
						
						{/* Dropdown untuk Lainnya */}
						<div 
							className="relative"
							onMouseEnter={() => setShowDropdown(true)}
							onMouseLeave={() => setShowDropdown(false)}
						>
							<button className="text-white hover:text-secondary transition-colors cursor-pointer font-semibold flex items-center gap-1">
								Lainnya
								<FiChevronDown className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
							</button>
							
							{/* Dropdown Menu with padding top to prevent gap */}
							{showDropdown && (
								<div className="absolute top-full left-0 pt-2 z-50">
									<div className="bg-white rounded-lg shadow-lg py-2 min-w-[160px]">
										<a
											onClick={() => {
												scrollToSection("merchandise");
												setShowDropdown(false);
											}}
											className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer font-semibold"
										>
											Merchandise
										</a>
										<a
											onClick={() => {
												scrollToSection("galeri");
												setShowDropdown(false);
											}}
											className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer font-semibold"
										>
											Galeri
										</a>
										<a
											onClick={() => {
												scrollToSection("matches");
												setShowDropdown(false);
											}}
											className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer font-semibold"
										>
											Matches
										</a>
										<a
											onClick={() => {
												scrollToSection("artikel");
												setShowDropdown(false);
											}}
											className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer font-semibold"
										>
											Artikel
										</a>
									</div>
								</div>
							)}
						</div>

						<a
							onClick={() => scrollToSection("faq")}
							className="text-white hover:text-secondary transition-colors cursor-pointer font-semibold"
						>
							FAQ
						</a>
					</nav>
					<Link
						to="/login"
						className="bg-secondary text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:opacity-90 transition-opacity"
					>
						Login
					</Link>
				</div>
			</header>

		{/* Hero Section with Slider */}
		<HeroSection heroImages={heroImages} scrollToSection={scrollToSection} />

			{/* Section: Why We Exist */}
			<section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
				{/* Decorative elements */}
				<div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(var(--color-primary-rgb), 0.05)' }}></div>
				<div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(217, 30, 91, 0.05)' }}></div>
				
				<div className="container mx-auto px-6 max-w-5xl relative z-10">
					<div className="text-center mb-12">
						<h2 
							className="text-3xl md:text-5xl font-bold leading-tight"
							style={{ color: 'var(--color-primary)' }}
							data-aos="fade-up"
						>
							Kami Percaya, Anak Berani Adalah Anak yang Siap Menghadapi Dunia.
						</h2>
					</div>
					
					<div 
						className="prose prose-lg max-w-none text-gray-700 space-y-6"
						data-aos="fade-up"
						data-aos-delay="200"
					>
						<p className="text-lg md:text-xl leading-relaxed">
							Saya memulai BJFS karena saya melihat banyak anak yang pintar dan punya potensi besar, tapi diam ketika ditanya.
						</p>
						<p className="text-lg md:text-xl leading-relaxed">
							Bukan karena mereka tidak mampu — <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>mereka hanya butuh ruang aman untuk berani.</span>
						</p>
						<p className="text-lg md:text-xl leading-relaxed">
							BJFS lahir dari keyakinan bahwa futsal bisa jadi alat anak belajar menghadapi hidup: <span className="font-semibold" style={{ color: 'var(--color-secondary)' }}>fokus, kerja sama, percaya diri, dan menghargai proses.</span>
						</p>
						<p className="text-lg md:text-xl leading-relaxed font-semibold" style={{ color: 'var(--color-primary)' }}>
							Kami tidak sekadar membentuk pemain.
						</p>
						<p className="text-xl md:text-2xl leading-relaxed font-bold text-center mt-8" style={{ color: 'var(--color-primary)' }}>
							Kami membentuk karakter — satu anak, satu latihan, satu keberanian setiap kali.
						</p>
					</div>

					{/* Quote Section */}
					<div 
						className="mt-12 p-8 rounded-2xl border-l-4"
						style={{ 
							background: 'linear-gradient(to right, rgba(var(--color-primary-rgb), 0.05), rgba(217, 30, 91, 0.05))',
							borderLeftColor: 'var(--color-secondary)'
						}}
						data-aos="fade-up"
						data-aos-delay="400"
					>
						<div className="flex items-start gap-4">
							<div className="flex-shrink-0">
								<img 
									src="/bjfs_logo.svg" 
									alt="BJFS Logo" 
									className="w-16 h-16"
								/>
							</div>
							<div>
								<p className="text-gray-600 italic text-lg mb-2">
									"Kami tidak hanya melatih futsal. Kami melatih anak untuk berani menghadapi hidup."
								</p>
								<p className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
									— Founder, Bogor Junior Futsal School
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Section: What Makes Us Different */}
			<section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, rgba(var(--color-primary-rgb), 0.05), white, rgba(217, 30, 91, 0.05))' }}>
				{/* Decorative border pattern */}
				<div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary), var(--color-primary))' }}></div>
				<div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary), var(--color-primary))' }}></div>
				
				{/* Background pattern */}
				<div className="absolute top-10 right-10 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(217, 30, 91, 0.1)' }}></div>
				<div className="absolute bottom-10 left-10 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)' }}></div>
				
				<div className="container mx-auto px-6 max-w-6xl relative z-10">
					{/* Headline */}
					<div className="text-center mb-16">
						<h2 
							className="text-3xl md:text-5xl font-bold leading-tight"
							data-aos="fade-up"
						>
							<span style={{ color: 'var(--color-primary)' }}>Di BJFS, Tujuannya Bukan Menang.</span>
							<br />
							<span style={{ color: 'var(--color-secondary)' }}>Tapi Berani Mencoba.</span>
						</h2>
					</div>

					{/* Comparison Table */}
					<div 
						className="grid md:grid-cols-2 gap-8 mb-12"
						data-aos="fade-up"
						data-aos-delay="200"
					>
						{/* Left Column: Futsal Biasa */}
						<div className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-gray-400">
							<div className="bg-gray-100 px-6 py-4">
								<h3 className="text-2xl font-bold text-gray-700 text-center">
									Futsal Biasa
								</h3>
							</div>
							<div className="p-6 space-y-4">
								<div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
									<FiX className="text-gray-400 text-xl flex-shrink-0 mt-0.5" size={20} />
									<p className="text-gray-600">Fokus ke hasil & teknik</p>
								</div>
								<div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
									<FiX className="text-gray-400 text-xl flex-shrink-0 mt-0.5" size={20} />
									<p className="text-gray-600">Tekanan untuk menang</p>
								</div>
								<div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
									<FiX className="text-gray-400 text-xl flex-shrink-0 mt-0.5" size={20} />
									<p className="text-gray-600">Latihan keras</p>
								</div>
								<div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
									<FiX className="text-gray-400 text-xl flex-shrink-0 mt-0.5" size={20} />
									<p className="text-gray-600">Kompetisi tujuan akhir</p>
								</div>
							</div>
						</div>

						{/* Right Column: BJFS */}
						<div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 transform md:scale-105" style={{ borderTopColor: 'var(--color-secondary)' }}>
							<div className="px-6 py-4" style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}>
								<h3 className="text-2xl font-bold text-white text-center">
									BJFS
								</h3>
							</div>
							<div className="p-6 space-y-4">
								<div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'rgba(217, 30, 91, 0.05)', borderColor: 'rgba(217, 30, 91, 0.2)' }}>
									<FiCheckCircle className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-secondary)' }} size={20} />
									<p className="text-gray-800 font-semibold">Fokus ke karakter & proses</p>
								</div>
								<div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'rgba(217, 30, 91, 0.05)', borderColor: 'rgba(217, 30, 91, 0.2)' }}>
									<FiCheckCircle className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-secondary)' }} size={20} />
									<p className="text-gray-800 font-semibold">Dorongan untuk berani</p>
								</div>
								<div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'rgba(217, 30, 91, 0.05)', borderColor: 'rgba(217, 30, 91, 0.2)' }}>
									<FiCheckCircle className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-secondary)' }} size={20} />
									<p className="text-gray-800 font-semibold">Latihan yang hangat & menyenangkan</p>
								</div>
								<div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'rgba(217, 30, 91, 0.05)', borderColor: 'rgba(217, 30, 91, 0.2)' }}>
									<FiCheckCircle className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-secondary)' }} size={20} />
									<p className="text-gray-800 font-semibold">Kompetisi alat belajar</p>
								</div>
							</div>
						</div>
					</div>

					{/* Subtext */}
					<div 
						className="text-center max-w-4xl mx-auto"
						data-aos="fade-up"
						data-aos-delay="400"
					>
						<div className="rounded-2xl p-8" style={{ background: 'linear-gradient(to right, rgba(var(--color-primary-rgb), 0.1), rgba(217, 30, 91, 0.1), rgba(var(--color-primary-rgb), 0.1))' }}>
							<p className="text-lg md:text-xl text-gray-700 mb-4">
								Kami menolak pandangan bahwa anak harus jadi juara dulu untuk percaya diri.
							</p>
							<p className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
								Karena di sini, setiap anak sudah juara — begitu mereka berani mengambil langkah pertama.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Section: Our Method - Futsal Character Building */}
			<section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
				{/* Decorative top border with pattern */}
				<div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-500 via-blue-500 to-purple-500"></div>
				
				{/* Background decorative circles */}
				<div className="absolute top-20 left-10 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl"></div>
				<div className="absolute top-40 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
				<div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl"></div>
				
				<div className="container mx-auto px-6 max-w-6xl relative z-10">
					{/* Headline */}
					<div className="text-center mb-12">
						<h2
							className="text-3xl md:text-5xl font-bold leading-tight"
							data-aos="fade-up"
						>
							<span style={{ color: 'var(--color-primary)' }}>Futsal Hanya Alat.</span>
							<br />
							<span style={{ color: 'var(--color-secondary)' }}>Yang Kami Bangun Adalah Karakter.</span>
						</h2>
					</div>

					{/* Body Copy */}
					<div 
						className="text-center max-w-4xl mx-auto mb-16"
						data-aos="fade-up"
						data-aos-delay="200"
					>
						<p className="text-lg md:text-xl text-gray-700 mb-6">
							Kami menyebutnya <span className="font-bold" style={{ color: 'var(--color-primary)' }}>Futsal Character Building</span> — metode yang memadukan latihan fisik dengan nilai karakter.
						</p>
						<p className="text-lg font-semibold text-gray-800">
							Tiga fokus utama kami:
						</p>
					</div>

					{/* Three Pillars */}
					<div className="grid md:grid-cols-3 gap-8 mb-16">
						{/* Character */}
						<div
							className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl shadow-lg border-t-4 border-yellow-500"
							data-aos="fade-right"
						>
							<div className="bg-yellow-500 text-white w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 text-3xl">
								💛
							</div>
							<h3 className="text-2xl font-bold text-primary mb-4 text-center">
								Character
							</h3>
							<ul className="space-y-3 text-gray-700">
								<li className="flex items-start gap-3">
									<FiCheck className="text-yellow-600 mt-1 flex-shrink-0" size={20} />
									<span>Keberanian</span>
								</li>
								<li className="flex items-start gap-3">
									<FiCheck className="text-yellow-600 mt-1 flex-shrink-0" size={20} />
									<span>Empati</span>
								</li>
								<li className="flex items-start gap-3">
									<FiCheck className="text-yellow-600 mt-1 flex-shrink-0" size={20} />
									<span>Tanggung jawab</span>
								</li>
							</ul>
						</div>

						{/* Intelligence */}
						<div
							className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg border-t-4 border-blue-500"
							data-aos="fade-up"
							data-aos-delay="200"
						>
							<div className="bg-blue-500 text-white w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 text-3xl">
								🧠
							</div>
							<h3 className="text-2xl font-bold text-primary mb-4 text-center">
								Intelligence
							</h3>
							<ul className="space-y-3 text-gray-700">
								<li className="flex items-start gap-3">
									<FiCheck className="text-blue-600 mt-1 flex-shrink-0" size={20} />
									<span>Fokus</span>
								</li>
								<li className="flex items-start gap-3">
									<FiCheck className="text-blue-600 mt-1 flex-shrink-0" size={20} />
									<span>Kreativitas</span>
								</li>
								<li className="flex items-start gap-3">
									<FiCheck className="text-blue-600 mt-1 flex-shrink-0" size={20} />
									<span>Keputusan cepat</span>
								</li>
							</ul>
						</div>

						{/* Agility */}
						<div
							className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-lg border-t-4 border-purple-500"
							data-aos="fade-left"
						>
							<div className="bg-purple-500 text-white w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 text-3xl">
								⚡
							</div>
							<h3 className="text-2xl font-bold text-primary mb-4 text-center">
								Agility
							</h3>
							<ul className="space-y-3 text-gray-700">
								<li className="flex items-start gap-3">
									<FiCheck className="text-purple-600 mt-1 flex-shrink-0" size={20} />
									<span>Adaptasi</span>
								</li>
								<li className="flex items-start gap-3">
									<FiCheck className="text-purple-600 mt-1 flex-shrink-0" size={20} />
									<span>Daya juang</span>
								</li>
								<li className="flex items-start gap-3">
									<FiCheck className="text-purple-600 mt-1 flex-shrink-0" size={20} />
									<span>Kontrol diri</span>
								</li>
							</ul>
						</div>
					</div>

					{/* Quote */}
					<div 
						className="text-center max-w-4xl mx-auto"
						data-aos="fade-up"
						data-aos-delay="400"
					>
						<div className="rounded-2xl p-8 border-l-4" style={{ 
							background: 'linear-gradient(to right, rgba(var(--color-primary-rgb), 0.1), rgba(217, 30, 91, 0.1), rgba(var(--color-primary-rgb), 0.1))',
							borderLeftColor: 'var(--color-secondary)'
						}}>
							<p className="text-xl md:text-2xl font-bold italic" style={{ color: 'var(--color-primary)' }}>
								"Kami tidak melatih anak untuk jadi hebat hari ini,<br />
								tapi untuk jadi tangguh sepanjang hidupnya."
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Section: Programs */}
			<section className="py-20 bg-gradient-to-b from-white to-gray-50">
				<div className="container mx-auto px-6 max-w-6xl">
					{/* Headline */}
					<div className="text-center mb-16">
						<h2
							className="text-3xl md:text-5xl font-bold leading-tight"
							style={{ color: 'var(--color-primary)' }}
							data-aos="fade-up"
						>
							Setiap Usia, Setiap Proses, Punya Maknanya Sendiri.
						</h2>
					</div>

					{/* Programs Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Program 1: 3-4 Tahun */}
						<div
							className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-yellow-500 hover:shadow-xl transition-shadow"
							data-aos="fade-up"
							data-aos-delay="0"
						>
							<div className="relative h-48 overflow-hidden">
								<img
									src="/umur3.jpg"
									alt="Anak usia 3-4 tahun"
									className="w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
								<div className="absolute bottom-4 left-4">
									<div className="flex items-center gap-2 text-yellow-400 mb-2">
										<span className="text-2xl">🟡</span>
										<h3 className="text-2xl font-bold text-white">3–4 Tahun</h3>
									</div>
								</div>
							</div>
							<div className="p-6">
								<h4 className="text-xl font-bold text-gray-800 mb-3">
									Pengenalan Bola & Motorik
								</h4>
								<p className="text-gray-600 mb-4">
									Belajar bergerak, tertawa, dan percaya diri.
								</p>
								<div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
									<p className="text-gray-700 italic">
										"Yang penting bukan golnya, tapi senyumnya."
									</p>
								</div>
							</div>
						</div>

						{/* Program 2: 5-7 Tahun */}
						<div
							className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-green-500 hover:shadow-xl transition-shadow"
							data-aos="fade-up"
							data-aos-delay="100"
						>
							<div className="relative h-48 overflow-hidden">
								<img
									src="/umur4.jpg"
									alt="Anak usia 5-7 tahun"
									className="w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
								<div className="absolute bottom-4 left-4">
									<div className="flex items-center gap-2 text-green-400 mb-2">
										<span className="text-2xl">🟢</span>
										<h3 className="text-2xl font-bold text-white">5–7 Tahun</h3>
									</div>
								</div>
							</div>
							<div className="p-6">
								<h4 className="text-xl font-bold text-gray-800 mb-3">
									Dasar & Koordinasi
								</h4>
								<p className="text-gray-600 mb-4">
									Belajar fokus, mendengar instruksi, kerja sama.
								</p>
								<div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
									<p className="text-gray-700 italic">
										"Mulai belajar mengendalikan bola, sekaligus diri sendiri."
									</p>
								</div>
							</div>
						</div>

						{/* Program 3: 8-10 Tahun */}
						<div
							className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-blue-500 hover:shadow-xl transition-shadow"
							data-aos="fade-up"
							data-aos-delay="200"
						>
							<div className="relative h-48 overflow-hidden">
								<img
									src="/umur7.jpg"
									alt="Anak usia 8-10 tahun"
									className="w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
								<div className="absolute bottom-4 left-4">
									<div className="flex items-center gap-2 text-blue-400 mb-2">
										<span className="text-2xl">🔵</span>
										<h3 className="text-2xl font-bold text-white">8–10 Tahun</h3>
									</div>
								</div>
							</div>
							<div className="p-6">
								<h4 className="text-xl font-bold text-gray-800 mb-3">
									Teknik & Teamwork
								</h4>
								<p className="text-gray-600 mb-4">
									Belajar tanggung jawab dan menghargai proses.
								</p>
								<div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
									<p className="text-gray-700 italic">
										"Belajar bukan untuk jadi paling hebat, tapi lebih baik dari kemarin."
									</p>
								</div>
							</div>
						</div>

						{/* Program 4: 11-13 Tahun */}
						<div
							className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-red-500 hover:shadow-xl transition-shadow"
							data-aos="fade-up"
							data-aos-delay="300"
						>
							<div className="relative h-48 overflow-hidden">
								<img
									src="/umur10.jpg"
									alt="Anak usia 11-13 tahun"
									className="w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
								<div className="absolute bottom-4 left-4">
									<div className="flex items-center gap-2 text-red-400 mb-2">
										<span className="text-2xl">🔴</span>
										<h3 className="text-2xl font-bold text-white">11–13 Tahun</h3>
									</div>
								</div>
							</div>
							<div className="p-6">
								<h4 className="text-xl font-bold text-gray-800 mb-3">
									Mentalitas Juara
								</h4>
								<p className="text-gray-600 mb-4">
									Belajar tenang di bawah tekanan dan tidak menyerah.
								</p>
								<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
									<p className="text-gray-700 italic">
										"Juara bukan soal piala, tapi soal karakter."
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Section: Feature Programs */}
			<section id="feature-programs" className="py-20 bg-white">
				<div className="container mx-auto px-6 max-w-6xl">
					{/* Headline */}
					<div className="text-center mb-16">
						<h2
							className="text-3xl md:text-5xl font-bold leading-tight"
							style={{ color: 'var(--color-primary)' }}
							data-aos="fade-up"
						>
							Pilih Perjalanan yang Cocok untuk Ananda ⚽
						</h2>
					</div>

					{/* Programs Grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Program 1: Regular Class */}
						<div
							className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 hover:shadow-2xl transition-all hover:scale-105"
							style={{ borderTopColor: 'var(--color-primary)' }}
							data-aos="fade-up"
							data-aos-delay="0"
						>
							<div className="p-8">
								<div className="mb-6">
									<h3
										className="text-2xl font-bold mb-2"
										style={{ color: 'var(--color-primary)' }}
									>
										Regular Class
									</h3>
									<p className="text-lg font-semibold text-gray-700">
										Futsal Character Building
									</p>
								</div>

								<ul className="space-y-3 mb-8">
									<li className="flex items-start gap-3">
										<span className="text-green-500 text-xl mt-1">✓</span>
										<span className="text-gray-600">
											Latihan 1x seminggu, fun dan hangat.
										</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="text-green-500 text-xl mt-1">✓</span>
										<span className="text-gray-600">
											Fokus: keberanian, disiplin, percaya diri.
										</span>
									</li>
								</ul>

								<a
									href="https://wa.me/6281315261946?text=Halo%20BJFS,%20saya%20ingin%20daftar%20Trial%20Gratis%20untuk%20Regular%20Class"
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
									style={{ backgroundColor: 'var(--color-primary)' }}
								>
									Daftar Trial Gratis
								</a>
							</div>
						</div>

						{/* Program 2: Mastery Class */}
						<div
							className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 hover:shadow-2xl transition-all hover:scale-105"
							style={{ borderTopColor: 'var(--color-secondary)' }}
							data-aos="fade-up"
							data-aos-delay="100"
						>
							<div className="p-8">
								<div className="mb-6">
									<h3
										className="text-2xl font-bold mb-2"
										style={{ color: 'var(--color-secondary)' }}
									>
										Mastery Class
									</h3>
									<p className="text-lg font-semibold text-gray-700">
										Futsal & Competition Prep
									</p>
								</div>

								<ul className="space-y-3 mb-8">
									<li className="flex items-start gap-3">
										<span className="text-green-500 text-xl mt-1">✓</span>
										<span className="text-gray-600">
											Latihan 2x seminggu, termasuk pertandingan mingguan.
										</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="text-green-500 text-xl mt-1">✓</span>
										<span className="text-gray-600">
											Fokus: tangguh, adaptif, dan berani tampil.
										</span>
									</li>
								</ul>

								<a
									href="/mastery-program"
									className="block w-full text-center px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
									style={{ backgroundColor: 'var(--color-secondary)' }}
								>
									Pelajari Program Mastery
								</a>
							</div>
						</div>

						{/* Program 3: School Program */}
						<div
							className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-green-500 hover:shadow-2xl transition-all hover:scale-105"
							data-aos="fade-up"
							data-aos-delay="200"
						>
							<div className="p-8">
								<div className="mb-6">
									<h3 className="text-2xl font-bold text-green-600 mb-2">
										School Program
									</h3>
									<p className="text-lg font-semibold text-gray-700">
										BJFS di Sekolah
									</p>
								</div>

								<ul className="space-y-3 mb-8">
									<li className="flex items-start gap-3">
										<span className="text-green-500 text-xl mt-1">✓</span>
										<span className="text-gray-600">
											Ekskul futsal berbasis karakter untuk anak SD–SMP.
										</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="text-green-500 text-xl mt-1">✓</span>
										<span className="text-gray-600">
											Fokus: disiplin, kerja sama, dan tanggung jawab.
										</span>
									</li>
								</ul>

								<a
									href="https://wa.me/6281315261946?text=Halo%20BJFS,%20saya%20ingin%20tanya%20tentang%20School%20Program"
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full text-center px-6 py-3 bg-green-600 rounded-lg font-semibold text-white hover:bg-green-700 transition-all"
								>
									Hubungi Kami
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Section: Real Stories - Testimonials */}
			<section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
				{/* Decorative blur circles */}
				<div
					className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-20"
					style={{ backgroundColor: 'rgba(var(--color-primary-rgb), 0.3)' }}
				></div>
				<div
					className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20"
					style={{ backgroundColor: 'rgba(var(--color-secondary-rgb), 0.3)' }}
				></div>

				<div className="container mx-auto px-6 max-w-6xl relative z-10">
					{/* Headline */}
					<div className="text-center mb-16">
						<h2
							className="text-3xl md:text-5xl font-bold leading-tight mb-4"
							style={{ color: 'var(--color-primary)' }}
							data-aos="fade-up"
						>
							Cerita Nyata dari Orang Tua, Bukan Sekadar Testimoni
						</h2>
					</div>

					{/* Testimonials Slider */}
					<div className="max-w-4xl mx-auto mb-12" data-aos="fade-up" data-aos-delay="100">
						<Swiper
							modules={[Navigation, Pagination, Autoplay]}
							spaceBetween={30}
							slidesPerView={1}
							navigation
							pagination={{ clickable: true }}
							autoplay={{
								delay: 5000,
								disableOnInteraction: false,
							}}
							className="testimonial-swiper"
						>
							{/* Testimonial 1 */}
							<SwiperSlide>
								<div className="bg-white rounded-2xl shadow-xl p-10 md:p-12">
									<div className="flex justify-center mb-6">
										<svg
											className="w-12 h-12 opacity-20"
											style={{ fill: 'var(--color-primary)' }}
											viewBox="0 0 24 24"
										>
											<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
										</svg>
									</div>
									<p className="text-xl md:text-2xl text-gray-700 text-center mb-8 leading-relaxed italic">
										"Dulu anak saya diam saat ditanya guru. Sekarang dia berani bicara di depan kelas."
									</p>
									<div className="text-center">
										<p
											className="font-bold text-lg"
											style={{ color: 'var(--color-primary)' }}
										>
											Ibu Gina
										</p>
										<p className="text-gray-500">Orang tua Kaysan (Karadenan)</p>
									</div>
								</div>
							</SwiperSlide>

							{/* Testimonial 2 */}
							<SwiperSlide>
								<div className="bg-white rounded-2xl shadow-xl p-10 md:p-12">
									<div className="flex justify-center mb-6">
										<svg
											className="w-12 h-12 opacity-20"
											style={{ fill: 'var(--color-primary)' }}
											viewBox="0 0 24 24"
										>
											<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
										</svg>
									</div>
									<p className="text-xl md:text-2xl text-gray-700 text-center mb-8 leading-relaxed italic">
										"Anak saya ADHD, sekarang bisa fokus dan gak lagi pakai obat penenang."
									</p>
									<div className="text-center">
										<p
											className="font-bold text-lg"
											style={{ color: 'var(--color-primary)' }}
										>
											Ibu Fira
										</p>
										<p className="text-gray-500">BSD</p>
									</div>
								</div>
							</SwiperSlide>

							{/* Testimonial 3 */}
							<SwiperSlide>
								<div className="bg-white rounded-2xl shadow-xl p-10 md:p-12">
									<div className="flex justify-center mb-6">
										<svg
											className="w-12 h-12 opacity-20"
											style={{ fill: 'var(--color-primary)' }}
											viewBox="0 0 24 24"
										>
											<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
										</svg>
									</div>
									<p className="text-xl md:text-2xl text-gray-700 text-center mb-8 leading-relaxed italic">
										"Anak saya autis ringan, dulu gak bisa menyapa. Sekarang bisa mimpin doa bareng tim."
									</p>
									<div className="text-center">
										<p
											className="font-bold text-lg"
											style={{ color: 'var(--color-primary)' }}
										>
											Ayah Reza
										</p>
										<p className="text-gray-500">Warung Jambu</p>
									</div>
								</div>
							</SwiperSlide>
						</Swiper>
					</div>

					{/* Subtext */}
					<div
						className="text-center max-w-3xl mx-auto"
						data-aos="fade-up"
						data-aos-delay="200"
					>
						<div
							className="inline-flex items-center gap-3 px-6 py-4 rounded-xl"
							style={{
								background: `linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.1) 0%, rgba(var(--color-secondary-rgb), 0.1) 100%)`,
							}}
						>
							<span className="text-2xl">💙</span>
							<p
								className="text-lg md:text-xl font-semibold"
								style={{ color: 'var(--color-primary)' }}
							>
								Mereka tidak hanya belajar futsal. Mereka belajar percaya diri menghadapi dunia.
							</p>
						</div>
					</div>
				</div>

				{/* Custom Swiper Navigation Styles */}
				<style jsx>{`
					.testimonial-swiper .swiper-button-next,
					.testimonial-swiper .swiper-button-prev {
						color: var(--color-primary);
					}
					.testimonial-swiper .swiper-pagination-bullet-active {
						background-color: var(--color-primary);
					}
				`}</style>
			</section>

			{/* Section: Our Coaches */}
			<section id="coach" className="py-20 bg-white">
				<div className="container mx-auto px-6 max-w-6xl">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						{/* Left Column: Image */}
						<div
							className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
							data-aos="fade-right"
						>
							<img
								src="/coach.jpg"
								alt="BJFS Coaches"
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
							<div className="absolute bottom-8 left-8 right-8">
								<div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
									<p className="text-white text-lg italic leading-relaxed">
										"Tugas kami bukan membuat anak menang, tapi membuat mereka berani."
									</p>
									<p className="text-white/80 mt-2 font-semibold">— Coach Alan</p>
								</div>
							</div>
						</div>

						{/* Right Column: Content */}
						<div data-aos="fade-left">
							<h2
								className="text-3xl md:text-5xl font-bold leading-tight mb-6"
								style={{ color: 'var(--color-primary)' }}
							>
								Pelatih Bukan Sekadar Pengajar, Tapi Pembimbing Karakter.
							</h2>
							
							<div className="space-y-6 mb-8">
								<div className="flex items-start gap-4">
									<div
										className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
										style={{ backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)' }}
									>
										<FiUserCheck
											className="text-2xl"
											style={{ color: 'var(--color-primary)' }}
										/>
									</div>
									<div>
										<p className="text-gray-700 text-lg leading-relaxed">
											BJFS punya <span className="font-bold" style={{ color: 'var(--color-primary)' }}>lebih dari 30 pelatih aktif</span> yang dibina lewat BJFS Leadership Program.
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div
										className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
										style={{ backgroundColor: 'rgba(var(--color-secondary-rgb), 0.1)' }}
									>
										<FiThumbsUp
											className="text-2xl"
											style={{ color: 'var(--color-secondary)' }}
										/>
									</div>
									<div>
										<p className="text-gray-700 text-lg leading-relaxed">
											Mereka bukan hanya melatih teknik, tapi <span className="font-bold" style={{ color: 'var(--color-secondary)' }}>menemani anak belajar tumbuh</span>.
										</p>
									</div>
								</div>
							</div>

							<Link
								to="/cabang"
								className="inline-block px-8 py-4 rounded-lg font-semibold text-white text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
								style={{ backgroundColor: 'var(--color-primary)' }}
							>
								Pelajari Tentang Coach Kami
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Section: Our Impact */}
			<section id="cabang" className="py-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
				{/* Decorative elements */}
				<div
					className="absolute top-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20"
					style={{ backgroundColor: 'rgba(var(--color-primary-rgb), 0.3)' }}
				></div>
				<div
					className="absolute bottom-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-20"
					style={{ backgroundColor: 'rgba(var(--color-secondary-rgb), 0.3)' }}
				></div>

				<div className="container mx-auto px-6 max-w-6xl relative z-10">
					{/* Headline */}
					<div className="text-center mb-12">
						<h2
							className="text-3xl md:text-5xl font-bold leading-tight mb-6"
							style={{ color: 'var(--color-primary)' }}
							data-aos="fade-up"
						>
							Lebih dari {Math.floor(totalMembers / 100) * 100}+ Anak Telah Tumbuh Bersama BJFS 🌱
						</h2>
						<div
							className="max-w-3xl mx-auto space-y-4 text-lg text-gray-700"
							data-aos="fade-up"
							data-aos-delay="100"
						>
							<p className="flex items-start gap-3">
								<span className="text-green-500 text-2xl">✓</span>
								<span>
									Sejak 2018, BJFS hadir untuk membantu anak-anak Bogor & BSD menemukan keberanian lewat futsal.
								</span>
							</p>
							<p className="flex items-start gap-3">
								<span className="text-green-500 text-2xl">✓</span>
								<span>
									Setiap pekan, lebih dari 400 anak berlatih bukan untuk jadi atlet, tapi untuk jadi pribadi yang lebih berani, disiplin, dan percaya diri.
								</span>
							</p>
						</div>
					</div>

					{/* Branches Info Card */}
					<div
						className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border-t-4"
						style={{ borderTopColor: 'var(--color-primary)' }}
						data-aos="fade-up"
						data-aos-delay="200"
					>
						<div className="flex items-center gap-3 mb-6">
							<FiMapPin
								className="text-3xl"
								style={{ color: 'var(--color-primary)' }}
							/>
							<h3
								className="text-2xl font-bold"
								style={{ color: 'var(--color-primary)' }}
							>
								Cabang Kami
							</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
							<div className="flex items-center gap-2 text-gray-700">
								<span className="text-green-500">📍</span>
								<span className="font-semibold">BSD</span>
							</div>
							<div className="flex items-center gap-2 text-gray-700">
								<span className="text-green-500">📍</span>
								<span className="font-semibold">Karadenan</span>
							</div>
							<div className="flex items-center gap-2 text-gray-700">
								<span className="text-green-500">📍</span>
								<span className="font-semibold">Leeds</span>
							</div>
							<div className="flex items-center gap-2 text-gray-700">
								<span className="text-green-500">📍</span>
								<span className="font-semibold">Mastery Class</span>
							</div>
							<div className="flex items-center gap-2 text-gray-700">
								<span className="text-green-500">📍</span>
								<span className="font-semibold">Pajajaran</span>
							</div>
							<div className="flex items-center gap-2 text-gray-700">
								<span className="text-green-500">📍</span>
								<span className="font-semibold">Tajur</span>
							</div>
						</div>
						<Link
							to="/jadwal-cabang"
							className="block w-full text-center px-8 py-4 rounded-lg font-semibold text-white text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
							style={{ backgroundColor: 'var(--color-primary)' }}
						>
							🔘 Lihat Jadwal Cabang
						</Link>
					</div>
				</div>
			</section>

			{/* Section: Join The Movement */}
			<section className="py-20 relative overflow-hidden">
				{/* Background Image */}
				<div className="absolute inset-0">
					<img
						src="/lp-3.jpg"
						alt="BJFS Kids"
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70"></div>
				</div>

				{/* Decorative elements */}
				<div
					className="absolute top-10 left-10 w-72 h-72 rounded-full blur-3xl opacity-20"
					style={{ backgroundColor: 'rgba(var(--color-primary-rgb), 0.3)' }}
				></div>
				<div
					className="absolute bottom-10 right-10 w-72 h-72 rounded-full blur-3xl opacity-20"
					style={{ backgroundColor: 'rgba(var(--color-secondary-rgb), 0.3)' }}
				></div>

				<div className="container mx-auto px-6 max-w-5xl relative z-10">
					<div className="text-center">
						{/* Headline */}
						<h2
							className="text-4xl md:text-6xl font-bold leading-tight mb-8 text-white"
							data-aos="fade-up"
						>
							Dunia Butuh Lebih Banyak Anak Pemberani.
						</h2>

						{/* Body Copy */}
						<div
							className="max-w-3xl mx-auto space-y-6 mb-10"
							data-aos="fade-up"
							data-aos-delay="100"
						>
							<p className="text-lg md:text-xl text-white leading-relaxed">
								<span className="font-semibold text-secondary">
									BJFS bukan sekadar sekolah futsal.
								</span>
							</p>
							<p className="text-lg md:text-xl text-white leading-relaxed">
								Kami adalah gerakan kecil untuk membantu anak Indonesia tumbuh dengan keberanian, empati, dan rasa percaya diri.
							</p>
						</div>

						{/* Quote Box */}
						<div
							className="max-w-2xl mx-auto mb-12 p-6 rounded-2xl shadow-lg backdrop-blur-sm"
							style={{
								background: 'rgba(255, 255, 255, 0.1)',
								borderLeft: '4px solid var(--color-secondary)',
							}}
							data-aos="fade-up"
							data-aos-delay="200"
						>
							<div className="flex items-start gap-3">
								<span className="text-3xl">💛</span>
								<p className="text-lg md:text-xl text-white leading-relaxed text-left">
									Bergabunglah dengan ribuan keluarga yang percaya bahwa keberanian anak lebih penting daripada kemenangan.
								</p>
							</div>
						</div>

						{/* CTA Buttons */}
						<div
							className="flex flex-col sm:flex-row gap-4 justify-center items-center"
							data-aos="fade-up"
							data-aos-delay="300"
						>
							<a
								href="https://wa.me/6281315261946?text=Halo%20BJFS,%20saya%20ingin%20daftar%20Trial%20Gratis"
								target="_blank"
								rel="noopener noreferrer"
								className="px-8 py-4 rounded-lg font-semibold text-white text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 w-full sm:w-auto"
								style={{ backgroundColor: 'var(--color-primary)' }}
							>
								Daftar Trial Gratis
							</a>
							<a
								href="https://wa.me/6281315261946?text=Halo%20BJFS,%20saya%20ingin%20bertanya%20tentang%20program"
								target="_blank"
								rel="noopener noreferrer"
								className="px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 w-full sm:w-auto"
								style={{
									color: 'var(--color-primary)',
									borderColor: 'var(--color-primary)',
									backgroundColor: 'white',
								}}
							>
								Hubungi Tim Kami
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* Section: Merchandise Slider */}
			<section id="merchandise" className="py-20 mb-12 bg-primary merch-slider">
				<div className="container mx-auto px-6">
					<Swiper
						modules={[Navigation, Pagination, Autoplay]}
						spaceBetween={30}
						slidesPerView={1}
						navigation
						pagination={{ clickable: true }}
						autoplay={{ delay: 5000, disableOnInteraction: false }}
						loop={true}
					>
						<SwiperSlide>
							{/* Card Container */}
							<div className="bg-white rounded-xl shadow-2xl p-8 md:p-12 grid md:grid-cols-2 gap-12 items-center">
								{/* Kolom Gambar Produk */}
								<div className="grid grid-cols-2 gap-4">
									<img
										src="/merch-1.jpg"
										alt="Sports Bag dari berbagai sudut"
										className="rounded-lg w-full h-full object-cover col-span-2 shadow-md"
									/>
									<img
										src="/merch-2.jpg"
										alt="Sports Bag tampak samping"
										className="rounded-lg w-full h-full object-cover shadow-md"
									/>
									<img
										src="/merch-3.jpg"
										alt="Sports Bag saat dilipat"
										className="rounded-lg w-full h-full object-cover shadow-md"
									/>
								</div>

								{/* Kolom Informasi Produk */}
								<div>
									<img
										src="/bjfs_logo.svg"
										alt="Logo BJFS"
										className="w-16 h-16 mb-4"
									/>
									<h2 className="text-3xl md:text-4xl font-bold text-primary">
										SPORTS BAG
									</h2>
									<h3 className="text-lg font-semibold text-secondary mt-2 mb-4">
										Tas Olahraga Multifungsi & Portabel
									</h3>
									<p className="text-gray-600 mb-8">
										Teman sempurna untuk segala aktivitas olahragamu. Dirancang
										untuk daya tahan maksimal, fungsionalitas, dan kemudahan
										penyimpanan. Lipat dengan mudah ke dalam sakunya sendiri
										saat tidak digunakan.
									</p>

									{/* Spesifikasi dengan Ikon (Grid Layout) */}
									<div className="grid grid-cols-2 gap-x-6 gap-y-6 border-t pt-6">
										{/* Spesifikasi: Volume */}
										<div className="flex items-start space-x-3">
											{/* Ganti dengan ikon SVG Anda, contoh: Heroicon 'cube' */}
											<svg
												className="w-6 h-6 text-primary flex-shrink-0"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
												/>
											</svg>
											<div>
												<h4 className="font-bold text-primary text-sm">
													Volume
												</h4>
												<span className="text-gray-600 text-sm">
													Kapasitas 20L (40x23x20 cm)
												</span>
											</div>
										</div>

										{/* Spesifikasi: Desain Portabel */}
										<div className="flex items-start space-x-3">
											{/* Ganti dengan ikon SVG Anda, contoh: Heroicon 'archive-box-arrow-down' */}
											<svg
												className="w-6 h-6 text-primary flex-shrink-0"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
												/>
											</svg>
											<div>
												<h4 className="font-bold text-primary text-sm">
													Desain Portabel
												</h4>
												<span className="text-gray-600 text-sm">
													Dapat dilipat ringkas (23x20x10 cm)
												</span>
											</div>
										</div>

										{/* Spesifikasi: Kompartemen */}
										<div className="flex items-start space-x-3">
											{/* Ganti dengan ikon SVG Anda, contoh: Heroicon 'rectangle-stack' */}
											<svg
												className="w-6 h-6 text-primary flex-shrink-0"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-5a2 2 0 00-2 2v5m7 0l-4-4m0 0l-4 4m4-4v12"
												/>
											</svg>
											<div>
												<h4 className="font-bold text-primary text-sm">
													Kompartemen Cerdas
												</h4>
												<span className="text-gray-600 text-sm">
													1 saku utama & 1 saku samping
												</span>
											</div>
										</div>

										{/* Spesifikasi: Material Tangguh */}
										<div className="flex items-start space-x-3">
											{/* Ganti dengan ikon SVG Anda, contoh: Heroicon 'shield-check' */}
											<svg
												className="w-6 h-6 text-primary flex-shrink-0"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 21a12.02 12.02 0 009-10.056c0-1.309-.324-2.57-.9-3.684z"
												/>
											</svg>
											<div>
												<h4 className="font-bold text-primary text-sm">
													Material Tangguh
												</h4>
												<span className="text-gray-600 text-sm">
													Bahan anti gores & tahan beban
												</span>
											</div>
										</div>
										{/* Spesifikasi: Komposisi */}
										<div className="flex items-start space-x-3">
											{/* Ganti dengan ikon SVG Anda, contoh: Heroicon 'puzzle-piece' */}
											<svg
												className="w-6 h-6 text-primary flex-shrink-0"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
												/>
											</svg>
											<div>
												<h4 className="font-bold text-primary text-sm">
													Komposisi
												</h4>
												<span className="text-gray-600 text-sm">
													Kain Poliester, Lapisan Poliuretan
												</span>
											</div>
										</div>
									</div>

									{/* Bagian Harga & Tombol CTA */}
									<div className="mt-8 flex justify-between items-center">
										<span className="text-2xl font-bold text-primary">
											Rp 170.000
										</span>
										<a
											href={`https://wa.me/6285694682611?text=${encodeURIComponent(
												"Halo, saya tertarik untuk membeli Sports Bag BJFS."
											)}`}
											target="_blank"
											rel="noopener noreferrer"
											className="bg-primary hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-colors"
										>
											Beli Sekarang
										</a>
									</div>
								</div>
							</div>
						</SwiperSlide>
						<SwiperSlide>
							{/* Card Container */}
							<div className="bg-white rounded-xl shadow-2xl p-8 md:p-12 grid md:grid-cols-2 gap-12 items-center">
								{/* Kolom Gambar Produk */}
								<div className="grid grid-cols-2 gap-4">
									<img
										src="/merch-4.jpg"
										alt="Sports Bag dari berbagai sudut"
										className="rounded-lg w-full h-full object-cover col-span-2 shadow-md"
									/>
									<img
										src="/merch-2.jpg"
										alt="Sports Bag tampak samping"
										className="rounded-lg w-full h-full object-cover shadow-md"
									/>
									<img
										src="/merch-3.jpg"
										alt="Sports Bag saat dilipat"
										className="rounded-lg w-full h-full object-cover shadow-md"
									/>
								</div>

								{/* Kolom Informasi Produk */}
								<div>
									<img
										src="/bjfs_logo.svg"
										alt="Logo BJFS"
										className="w-16 h-16 mb-4"
									/>
									<h2 className="text-3xl md:text-4xl font-bold text-primary">
										SPORTS BAG
									</h2>
									<h3 className="text-lg font-semibold text-secondary mt-2 mb-4">
										Tas Olahraga Multifungsi & Portabel (Mastery Class Edition)
									</h3>
									<p className="text-gray-600 mb-8">
										Teman sempurna untuk segala aktivitas olahragamu. Dirancang
										untuk daya tahan maksimal, fungsionalitas, dan kemudahan
										penyimpanan. Lipat dengan mudah ke dalam sakunya sendiri
										saat tidak digunakan.
									</p>

									{/* Spesifikasi dengan Ikon (Grid Layout) */}
									<div className="grid grid-cols-2 gap-x-6 gap-y-6 border-t pt-6">
										{/* Spesifikasi: Volume */}
										<div className="flex items-start space-x-3">
											{/* Ganti dengan ikon SVG Anda, contoh: Heroicon 'cube' */}
											<svg
												className="w-6 h-6 text-primary flex-shrink-0"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
												/>
											</svg>
											<div>
												<h4 className="font-bold text-primary text-sm">
													Volume
												</h4>
												<span className="text-gray-600 text-sm">
													Kapasitas 20L (40x23x20 cm)
												</span>
											</div>
										</div>

										{/* Spesifikasi: Desain Portabel */}
										<div className="flex items-start space-x-3">
											{/* Ganti dengan ikon SVG Anda, contoh: Heroicon 'archive-box-arrow-down' */}
											<svg
												className="w-6 h-6 text-primary flex-shrink-0"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
												/>
											</svg>
											<div>
												<h4 className="font-bold text-primary text-sm">
													Desain Portabel
												</h4>
												<span className="text-gray-600 text-sm">
													Dapat dilipat ringkas (23x20x10 cm)
												</span>
											</div>
										</div>

										{/* Spesifikasi: Kompartemen */}
										<div className="flex items-start space-x-3">
											{/* Ganti dengan ikon SVG Anda, contoh: Heroicon 'rectangle-stack' */}
											<svg
												className="w-6 h-6 text-primary flex-shrink-0"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-5a2 2 0 00-2 2v5m7 0l-4-4m0 0l-4 4m4-4v12"
												/>
											</svg>
											<div>
												<h4 className="font-bold text-primary text-sm">
													Kompartemen Cerdas
												</h4>
												<span className="text-gray-600 text-sm">
													1 saku utama & 1 saku samping
												</span>
											</div>
										</div>

										{/* Spesifikasi: Material Tangguh */}
										<div className="flex items-start space-x-3">
											{/* Ganti dengan ikon SVG Anda, contoh: Heroicon 'shield-check' */}
											<svg
												className="w-6 h-6 text-primary flex-shrink-0"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 21a12.02 12.02 0 009-10.056c0-1.309-.324-2.57-.9-3.684z"
												/>
											</svg>
											<div>
												<h4 className="font-bold text-primary text-sm">
													Material Tangguh
												</h4>
												<span className="text-gray-600 text-sm">
													Bahan anti gores & tahan beban
												</span>
											</div>
										</div>
										{/* Spesifikasi: Komposisi */}
										<div className="flex items-start space-x-3">
											{/* Ganti dengan ikon SVG Anda, contoh: Heroicon 'puzzle-piece' */}
											<svg
												className="w-6 h-6 text-primary flex-shrink-0"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
												/>
											</svg>
											<div>
												<h4 className="font-bold text-primary text-sm">
													Komposisi
												</h4>
												<span className="text-gray-600 text-sm">
													Kain Poliester, Lapisan Poliuretan
												</span>
											</div>
										</div>
									</div>

									{/* Bagian Harga & Tombol CTA */}
									<div className="mt-8 flex justify-between items-center">
										<span className="text-2xl font-bold text-primary">
											Rp 170.000
										</span>
										<a
											href={`https://wa.me/6285694682611?text=${encodeURIComponent(
												"Halo, saya tertarik untuk membeli Sports Bag BJFS (MASTERY CLASS EDITION)."
											)}`}
											target="_blank"
											rel="noopener noreferrer"
											className="bg-primary hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-colors"
										>
											Beli Sekarang
										</a>
									</div>
								</div>
							</div>
						</SwiperSlide>

						{/* Anda bisa menambahkan <SwiperSlide> lain di sini untuk produk merchandise lainnya */}
					</Swiper>
				</div>
			</section>

			<Gallery />

			{/* Matches & Artikel Section - Side by Side */}
			<section className="py-20 bg-gray-50">
				<div className="container mx-auto px-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Left Column - Matches */}
						<div id="matches" className="bg-white rounded-2xl shadow-lg p-8">
							<LatestMatchesSection />
						</div>

						{/* Right Column - Artikel */}
						<div id="artikel" className="bg-white rounded-2xl shadow-lg p-8">
							<LatestArticles />
						</div>
					</div>
				</div>
			</section>

			{/* Analytics & Statistik Section */}
			<section id="statistik">
				<RealTimeGoogleAnalyticsStats />
				<HistoricalAnalyticsStats />
			</section>

			<section id="faq" className="py-20 bg-gray-100">
				<div className="container mx-auto px-6 max-w-4xl">
					<div className="text-center mb-12">
						<h2
							className="text-3xl md:text-4xl font-bold text-primary"
							data-aos="fade-up"
						>
							Frequently Asked Questions (FAQ)
						</h2>
						<p
							className="text-gray-600 mt-2"
							data-aos="fade-up"
							data-aos-delay="100"
						>
							Jawaban untuk pertanyaan yang paling sering diajukan.
						</p>
					</div>
					<div className="bg-white p-8 rounded-xl shadow-lg">
						<>
							{/* FAQ 1: Lokasi Latihan */}
							<FAQItem question="Dimana Latihan Bogor Junior?" delay={0}>
								<div className="p-6 bg-gray-50 rounded-b-lg space-y-6">
									{/* Bagian Program: Futsal Character Building */}
									<div>
										<h4 className="text-lg font-semibold text-gray-800 flex items-center">
											{/* Ikon untuk Program 1 */}
											<FaUserShield className="w-6 h-6 text-primary mr-2" />
											Program Futsal Character Building
										</h4>
										<ul className="mt-3 space-y-2 pl-1">
											{/* Menggunakan map untuk daftar lokasi akan lebih efisien */}
											<li className="flex justify-between items-center">
												<span className="flex items-center text-gray-600">
													<FiMapPin className="w-5 h-5 text-gray-400 mr-3" />
													Futsal Karadenan Square
												</span>
												<a
													href="https://maps.google.com/?q=Futsal+Karadenan+Square"
													target="_blank"
													rel="noopener noreferrer"
													className="text-sm text-primary hover:underline font-semibold"
												>
													Lihat Peta
												</a>
											</li>
											<li className="flex justify-between items-center">
												<span className="flex items-center text-gray-600">
													<FiMapPin className="w-5 h-5 text-gray-400 mr-3" />
													Leeds Futsal Budi Agung
												</span>
												<a
													href="https://maps.google.com/?q=Leeds+Futsal+Budi+Agung"
													target="_blank"
													rel="noopener noreferrer"
													className="text-sm text-primary hover:underline font-semibold"
												>
													Lihat Peta
												</a>
											</li>
											<li className="flex justify-between items-center">
												<span className="flex items-center text-gray-600">
													<FiMapPin className="w-5 h-5 text-gray-400 mr-3" />
													Sky Futsal BSD
												</span>
												<a
													href="https://maps.app.goo.gl/By6f8yRBATZsWZSx9"
													target="_blank"
													rel="noopener noreferrer"
													className="text-sm text-primary hover:underline font-semibold"
												>
													Lihat Peta
												</a>
											</li>
											<li className="flex justify-between items-center">
												<span className="flex items-center text-gray-600">
													<FiMapPin className="w-5 h-5 text-gray-400 mr-3" />
													Galaxy Futsal Centre (Tajur)
												</span>
												<a
													href="https://maps.app.goo.gl/ks1RjwSDjteVuNyS9"
													target="_blank"
													rel="noopener noreferrer"
													className="text-sm text-primary hover:underline font-semibold"
												>
													Lihat Peta
												</a>
											</li>
											<li className="flex justify-between items-center">
												<span className="flex items-center text-gray-600">
													<FiMapPin className="w-5 h-5 text-gray-400 mr-3" />
													Futsal Pajajaran 1
												</span>
											</li>
											{/* Tambahkan lokasi lain dengan format yang sama */}
										</ul>
									</div>

									{/* Bagian Program: Futsal Mastery Class */}
									<div>
										<h4 className="text-lg font-semibold text-gray-800 flex items-center">
											{/* Ikon untuk Program 2 */}
											<IoSchoolSharp className="w-6 h-6 text-primary mr-2" />
											Program Futsal Mastery Class
										</h4>
										<ul className="mt-3 space-y-2 pl-1">
											<li className="flex justify-between items-center">
												<span className="flex items-center text-gray-600">
													<FiMapPin className="w-5 h-5 text-gray-400 mr-3" />
													Lola Futsal Ciparigi
												</span>
												<a
													href="https://maps.google.com/?q=Lola+Futsal+Ciparigi"
													target="_blank"
													rel="noopener noreferrer"
													className="text-sm text-primary hover:underline font-semibold"
												>
													Lihat Peta
												</a>
											</li>
										</ul>
									</div>
								</div>
							</FAQItem>

							{/* FAQ 2: Biaya (Sudah Didesain Ulang) */}
							<FAQItem
								question="Berapa Biaya Gabung di Bogor Junior?"
								delay={100}
							>
								{/* ... kode dari jawaban sebelumnya ... */}
								<div className="p-6 bg-gray-50 rounded-b-lg">
									<div className="mb-6 pb-4 border-b border-gray-200">
										<h4 className="text-lg font-semibold text-gray-800">
											Trial
										</h4>
										<p className="mt-2">
											<span className="text-3xl font-bold text-primary">
												Rp 50.000
											</span>
										</p>
									</div>
									<div className="mb-6 border-gray-200">
										<h4 className="text-lg font-semibold text-gray-800">
											Paket Pendaftaran Awal
										</h4>
										<p className="mt-2">
											<span className="text-3xl font-bold text-primary">
												Rp 800.000
											</span>
										</p>
									</div>
									<p className="font-semibold text-gray-700 mb-3">
										Fasilitas yang didapat:
									</p>
									<ul className="space-y-3 list-none">
										<li className="flex items-center">
											<svg
												className="w-6 h-6 text-primary mr-3 flex-shrink-0"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
												/>
											</svg>
											<span>Biaya Pendaftaran & Administrasi</span>
										</li>
										<li className="flex items-center">
											<svg
												className="w-6 h-6 text-primary mr-3 flex-shrink-0"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
											<span>Iuran bulan pertama (termasuk 4x pertemuan)</span>
										</li>
										<li className="flex items-center">
											<svg
												className="w-6 h-6 text-primary mr-3 flex-shrink-0"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
												/>
											</svg>
											<span>1 Set Jersey Latihan Eksklusif</span>
										</li>
									</ul>
								</div>
							</FAQItem>

							{/* FAQ 3: Kontak */}
							<FAQItem
								question="Bagaimana Menghubungi Bogor Junior?"
								delay={200}
							>
								<div className="p-6 bg-gray-50 rounded-b-lg">
									<p className="text-gray-700 mb-4">
										Pilih kanal komunikasi yang paling nyaman bagi Anda:
									</p>
									<div className="space-y-3">
										{/* Kontak Whatsapp 1 */}
										<a
											href="https://wa.me/6285694682611"
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center p-4 bg-white border border-slate-200 rounded-lg hover:bg-gray-100 hover:shadow-sm transition-all duration-200"
										>
											{/* Ganti dengan ikon Whatsapp jika ada, atau gunakan ikon generik */}
											<FaWhatsapp className="w-7 h-7 text-green-500 mr-4 flex-shrink-0" />
											<div>
												<p className="font-semibold text-gray-800">
													Whatsapp 1
												</p>
												<p className="text-sm text-gray-500">0856-9468-2611</p>
											</div>
										</a>

										{/* Kontak Whatsapp 2 */}
										<a
											href="https://wa.me/628568608857"
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center p-4 bg-white border border-slate-200  rounded-lg hover:bg-gray-100 hover:shadow-sm transition-all duration-200"
										>
											<FaWhatsapp className="w-7 h-7 text-green-500 mr-4 flex-shrink-0" />
											<div>
												<p className="font-semibold text-gray-800">
													Whatsapp 2
												</p>
												<p className="text-sm text-gray-500">0856-8608-857</p>
											</div>
										</a>

										{/* Kontak Instagram */}
										<a
											href="https://instagram.com/bogorjuniorfs"
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center p-4 bg-white border border-slate-200  rounded-lg hover:bg-gray-100 hover:shadow-sm transition-all duration-200"
										>
											{/* Sebaiknya gunakan ikon logo Instagram di sini */}
											<FiInstagram className="w-7 h-7 text-pink-500 mr-4 flex-shrink-0" />
											<div>
												<p className="font-semibold text-gray-800">Instagram</p>
												<p className="text-sm text-gray-500">@bogorjuniorfs</p>
											</div>
										</a>
									</div>
								</div>
							</FAQItem>
						</>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-primary text-white pt-16 pb-8">
				<div className="container mx-auto px-6 text-center">
					<img
						src="/bjfs_logo.svg"
						alt="Logo BJFS"
						className="w-24 h-auto mx-auto mb-4 rounded-lg"
					/>

					{/* Footer Headline Section */}
					<div className="max-w-3xl mx-auto mb-12">
						<h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
							Mulai Perjalanan Ananda Hari Ini.
						</h3>
						<p className="text-lg text-gray-300 mb-6">
							Latihan kecil hari ini bisa jadi langkah besar di masa depan.
						</p>
						<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-l-4 border-secondary">
							<p className="text-xl italic text-white mb-2">
								💬 "Berani mencoba, berani tumbuh, berani jadi diri sendiri."
							</p>
							<p className="text-sm text-gray-400">— Tim BJFS</p>
						</div>
					</div>

					<div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between gap-8 my-10 text-left">
						{/* Office Info */}
						<div className="text-center md:text-left">
							<h4 className="font-bold text-lg mb-2">Office</h4>
							<div className="text-sm text-gray-400 space-y-1">
								<p>
									Emerald Cilebut Blok C27 Cilebut Barat Sukaraja Kab. Bogor
									Jawa Barat
								</p>
								<p>
									<strong>Jam Operasional:</strong> Senin - Jumat, 09.00 - 17.00
								</p>
								<div className="flex items-center gap-2 justify-center md:justify-start">
									<FiPhone />
									+62 813-1526-1946
								</div>
							</div>
						</div>
						{/* Social Media */}
						<div className="text-center">
							<h4 className="font-bold text-lg mb-3">Ikuti Kami</h4>
							<div className="flex justify-center gap-4">
								<a
									href="https://www.facebook.com/bogorjuniorfs"
									className="p-3 bg-white/10 rounded-full hover:bg-[var(--color-secondary)] transition-colors"
								>
									<FiFacebook size={20} />
								</a>
								<a
									href="https://www.instagram.com/bogorjuniorfs"
									className="p-3 bg-white/10 rounded-full hover:bg-[var(--color-secondary)] transition-colors"
								>
									<FiInstagram size={20} />
								</a>
								<a
									href="#"
									className="p-3 bg-white/10 rounded-full hover:bg-[var(--color-secondary)] transition-colors"
								>
									<FiYoutube size={20} />
								</a>
								<a
									href="#"
									className="p-3 bg-white/10 rounded-full hover:bg-[var(--color-secondary)] transition-colors"
								>
									<FiTwitter size={20} />
								</a>
							</div>
						</div>
						{/* Login Button */}
					</div>

					<p className="text-xs text-gray-500 mt-12 border-t border-white/10 pt-6">
						&copy; 2025 Bogor Junior. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
};

export default LandingPage;
