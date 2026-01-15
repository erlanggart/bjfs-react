import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../layouts/Header';
import { Footer } from '../layouts/Footer';
import SEO from '../components/common/SEO';

const NotFoundPage = () => {
  return (
    <>
      <SEO
        title="Under Construction - Coming Soon"
        description="Halaman ini sedang dalam pengembangan. Segera hadir dengan fitur-fitur menarik di Bogor Junior FS."
        url="/404"
      />
      <Header />
      <main className="min-h-[60vh] flex items-center justify-center px-4 py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
        <div className="max-w-3xl text-center">
          <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-[var(--color-primary)] text-white mx-auto shadow-2xl mb-6 animate-pulse">
            <span className="text-5xl">🚧</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">Under Construction</h1>
          <p className="text-xl md:text-2xl font-semibold text-blue-600 mb-6">Coming Soon!</p>
          <p className="text-gray-600 mb-6 text-lg">
            Kami sedang membangun sesuatu yang luar biasa untuk Anda. Halaman ini akan segera hadir dengan fitur-fitur menarik yang pastinya akan membuat pengalaman Anda lebih baik!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link
              to="/"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-[var(--color-primary)] text-white rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform"
            >
              🏠 Kembali ke Beranda
            </Link>

            <Link
              to="/articles"
              className="px-8 py-3 bg-white border-2 border-blue-500 text-blue-600 rounded-lg font-semibold shadow hover:scale-105 transition-transform hover:bg-blue-50"
            >
              📰 Baca Artikel
            </Link>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500">Nantikan update terbaru kami!</p>
            <p className="text-xs text-gray-400">Atau hubungi kami jika Anda memerlukan bantuan.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotFoundPage;
