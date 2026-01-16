// File: src/pages/MatchDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
	FiArrowLeft,
	FiStar,
	FiCalendar,
	FiAward,
	FiZap,
} from "react-icons/fi";
import Header from "../layouts/Header";
import { Footer } from "../layouts/Footer";

const PlayerCard = ({ player }) => (
	<div className="w-42 flex-shrink-0 bg-gradient-to-b from-[var(--color-primary)] to-blue-900 text-white  rounded-lg shadow-lg text-center p-3 relative overflow-hidden group">
		<div className="relative z-10">
			<div className="w-30 h-30 rounded-full mx-auto bg-white/10 p-1 border-2 border-white/20">
				<img
					src={
						player.avatar ||
						`https://placehold.co/80x80/E0E0E0/757575?text=${player.player_name.charAt(
							0
						)}`
					}
					alt={player.player_name}
					className="w-full h-full rounded-full object-cover"
				/>
			</div>
			{/* PERBAIKAN: Hapus kelas 'truncate' agar nama bisa wrap */}
			<p className="font-bold text-sm mt-2 min-h-[40px] flex items-center justify-center">
				{player.player_name}
			</p>
			{parseInt(player.is_bjfs_player) === 1 && (
				<p className="text-xs font-mono opacity-70 bg-black/20 rounded-full px-2 mt-1 inline-block">
					{player.member_id}
				</p>
			)}
		</div>
	</div>
);

const LineupDisplay = ({ teamName, players }) => {
	if (!players || players.length === 0) {
		return (
			<div>
				<h3 className="text-xl font-bold mb-3 text-primary">{teamName}</h3>
				<p className="text-sm text-gray-500">Data lineup tidak tersedia.</p>
			</div>
		);
	}
	return (
		<div>
			<h3 className="text-xl font-bold mb-4 text-primary">{teamName}</h3>
			{/* PERBAIKAN: Hapus 'overflow-x-auto' dan tambahkan 'flex-wrap' */}
			<div className="flex flex-wrap gap-4 justify-center">
				{players.map((player, index) => (
					<PlayerCard key={index} player={player} />
				))}
			</div>
		</div>
	);
};

// Komponen untuk menampilkan daftar pencetak gol
const ScorersDisplay = ({ teamName, scorers }) => (
	// Pada mobile, text akan center. Pada desktop, text rata kiri.
	<div className="p-2 sm:p-4">
		<h3 className="font-bold text-base sm:text-lg mb-3 text-center md:text-left text-gray-300">
			{teamName}
		</h3>
		<ul className="space-y-2">
			{console.log(scorers)}
			{scorers && scorers.length > 0 ? (
				scorers.map((scorer, index) => (
					<li
						key={index}
						className="flex items-center gap-2 text-gray-300 justify-center md:justify-start text-sm sm:text-base"
					>
						<FiZap className="text-yellow-400" />
						<span>
							{scorer.player_name}{" "}
							{scorer.goals_scored > 1 && (
								<span className="text-yellow-400 font-semibold ">
									( {scorer.goals_scored} )
								</span>
							)}
						</span>
					</li>
				))
			) : (
				<li className="text-gray-500 italic text-center md:text-left text-sm sm:text-base">
					Belum ada pencetak gol
				</li>
			)}
		</ul>
	</div>
);

const MatchScorecard = ({ match_info, scorers }) => {
	// Fungsi helper untuk membuat inisial tim untuk logo placeholder
	const getInitials = (name = "") => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.substring(0, 2)
			.toUpperCase();
	};

	return (
		<div className="bg-gray-800 text-white font-sans rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 mb-8 max-w-4xl mx-auto border border-gray-700">
			{/* Header: Nama Event & Tanggal */}
			<div className="text-center mb-6">
				<h2 className="text-xl sm:text-2xl font-bold text-yellow-400 tracking-wide">
					{match_info.event_name}
				</h2>
				<p className="text-sm text-gray-400 flex items-center justify-center gap-2 mt-1">
					<FiCalendar size={14} />
					{new Date(match_info.match_date).toLocaleDateString("id-ID", {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</p>
			</div>

			{/* Papan Skor Utama */}
			<div className="flex justify-between items-center">
				{/* Tim A */}
				<div className="flex-1 flex flex-col-reverse md:flex-row items-center justify-end gap-3 md:gap-4">
					<h3 className="text-base sm:text-lg md:text-2xl font-bold text-center md:text-right">
						{match_info.team_a_name}
					</h3>
					<div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-2xl font-black shadow-lg border-2 border-blue-400">
						{getInitials(match_info.team_a_name)}
					</div>
				</div>

				{/* Skor */}
				<div className="px-3 sm:px-4 md:px-8">
					<span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter">
						{match_info.score_a} - {match_info.score_b}
					</span>
				</div>

				{/* Tim B */}
				<div className="flex-1 flex flex-col md:flex-row items-center justify-start gap-3 md:gap-4">
					<div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-2xl font-black shadow-lg border-2 border-red-400">
						{getInitials(match_info.team_b_name)}
					</div>
					<h3 className="text-base sm:text-lg md:text-2xl font-bold text-center md:text-left">
						{match_info.team_b_name}
					</h3>
				</div>
			</div>

			{/* Detail Pencetak Gol */}
			{scorers.team_a.length > 0 || scorers.team_b.length > 0 ? (
				<div className="mt-8 pt-6 border-t border-gray-700">
					<div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-gray-700">
						<ScorersDisplay
							teamName={match_info.team_a_name}
							scorers={scorers.team_a}
						/>
						<ScorersDisplay
							teamName={match_info.team_b_name}
							scorers={scorers.team_b}
						/>
					</div>
				</div>
			) : null}
		</div>
	);
};

const MatchDetailPage = () => {
	const { id } = useParams();
	const [data, setData] = useState(null);
	const [selectedImage, setSelectedImage] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios
			.get(`/api/matches/public/${id}`)
			.then((res) => setData(res.data))
			.catch((err) => console.error("Gagal memuat detail pertandingan", err))
			.finally(() => setLoading(false));
	}, [id]);

	if (loading)
		return <p className="text-center p-10">Memuat detail pertandingan...</p>;
	if (!data)
		return (
			<p className="text-center p-10">
				Gagal memuat data atau pertandingan tidak ditemukan.
			</p>
		);

	const { match_info, photos, lineups, scorers } = data;

	return (
		<div className="bg-gray-100 min-h-screen">
			<Header />
			<div className="container mx-auto px-6 py-12">
				<Link
					to="/pertandingan"
					className="inline-flex items-center gap-2 text-secondary font-semibold mb-8 hover:underline"
				>
					<FiArrowLeft /> Kembali ke Beranda
				</Link>

				{/* Info Utama & Skor */}
				<MatchScorecard match_info={match_info} scorers={scorers} />

				{/* Susunan Pemain */}
				<div className="bg-white rounded-xl shadow-lg p-6 mb-6">
					<h2 className="text-2xl font-bold text-primary mb-6">
						Susunan Pemain
					</h2>
					<div className="space-y-8">
						<LineupDisplay
							teamName={match_info.team_a_name}
							players={lineups.team_a}
						/>
						<LineupDisplay
							teamName={match_info.team_b_name}
							players={lineups.team_b}
						/>
					</div>
				</div>

				{/* Galeri Foto */}
				{photos.length > 0 && (
					<div className="mb-8">
						<h2 className="text-2xl font-bold text-primary mb-4">
							Galeri Foto
						</h2>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{photos.map((photo) => (
								<img
									key={photo.id}
									src={photo.photo_url}
									alt="Dokumentasi Pertandingan"
									className="rounded-lg cursor-pointer w-full h-40 object-cover hover:opacity-80 transition-opacity"
									onClick={() => setSelectedImage(photo.photo_url)}
								/>
							))}
						</div>
					</div>
				)}

				{/* Lightbox Modal untuk melihat foto */}
				{selectedImage && (
					<div
						className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
						onClick={() => setSelectedImage(null)}
					>
						<img
							src={selectedImage}
							alt="Tampilan Penuh"
							className="max-w-[90vw] max-h-[90vh] rounded-lg"
						/>
					</div>
				)}
			</div>
			<Footer />
		</div>
	);
};

export default MatchDetailPage;
