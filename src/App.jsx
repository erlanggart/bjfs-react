// File: src/App.jsx
import React, { useEffect, lazy, Suspense } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Outlet,
	Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AOS from "aos";
import "aos/dist/aos.css";
import ProtectedRoute from "./components/ProtectedRoutes";
import AxiosInterceptor from "./components/AxiosInterceptor";

// Lazy load all pages
const LoginPage = lazy(() => import("./pages/LoginPage"));
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const BranchManagementPage = lazy(() => import("./pages/admin/BranchManagementPage"));
const UserManagementPage = lazy(() => import("./pages/admin/UserManagementPage"));
const AttendancePage = lazy(() => import("./pages/branch-admin/Attendance"));
const MyProfilePage = lazy(() => import("./pages/member/MyProfilePage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const ScheduleManagementPage = lazy(() => import("./pages/branch-admin/ScheduleManagementPage"));
const AttendanceReportPage = lazy(() => import("./pages/branch-admin/AttendanceReportPage"));
const ProfileSettingsPage = lazy(() => import("./pages/ProfileSettings"));
const BranchDetailPage = lazy(() => import("./pages/admin/BranchDetailPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const MemberDetailPage = lazy(() => import("./pages/MemberDetailPage"));
const MemberListPage = lazy(() => import("./pages/branch-admin/MemberListPage"));
const ArticleManagementPage = lazy(() => import("./pages/admin/ArticleManagementPage"));
const ArticleEditorPage = lazy(() => import("./pages/admin/ArticleEditorPage"));
const MemberReportPage = lazy(() => import("./pages/member/MemberRaportPage"));
const MemberReportListPage = lazy(() => import("./pages/member/MemberRaportList"));
const PaymentPage = lazy(() => import("./pages/member/PaymentPage"));
const FeedbackPage = lazy(() => import("./pages/admin/FeedbackPage"));
const FeedbackHistoryPage = lazy(() => import("./pages/member/FeedbackHistory"));
const ArticleDetailPage = lazy(() => import("./pages/public/ArticleDetailPage"));
const ArticlesPage = lazy(() => import("./pages/ArticlesPage"));
const MatchManagementPage = lazy(() => import("./pages/admin/MatchManagementPage"));
const MatchEditorPage = lazy(() => import("./pages/admin/MatchEditorPage"));
const MatchDetailPage = lazy(() => import("./pages/MatchDetailPage"));
const AllMatchesPage = lazy(() => import("./pages/AllMatchesPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const HeroGalleryManagementPage = lazy(() => import("./pages/admin/HeroGalleryManagementPage"));
const BranchesPage = lazy(() => import("./pages/public/BranchesPage"));
const BranchSchedulePage = lazy(() => import("./pages/public/BranchSchedulePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const RoleBasedRedirect = () => {
	const { user } = useAuth();
	if (!user) return <Navigate to="/login" replace />;
	switch (user.role) {
		case "admin":
			return <Navigate to="/admin/dashboard" replace />;
		case "admin_cabang":
			return <Navigate to="/absensi" replace />;
		case "member":
			return <Navigate to="/profil" replace />;
		default:
			return <Navigate to="/login" replace />;
	}
};

function App() {
	useEffect(() => {
		AOS.init({
			duration: 800,
			once: true,
			easing: "ease-out",
		});
	}, []);

	return (
		<Router>
			<AuthProvider>
				<AxiosInterceptor>
					<Suspense fallback={
						<div className="flex items-center justify-center min-h-screen">
							<div className="text-center">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
								<p className="mt-4 text-gray-600">Memuat...</p>
							</div>
						</div>
					}>
					<Routes>
						<Route path="/" element={<LandingPage />} />
						<Route path="/cabang" element={<BranchesPage />} />
						<Route path="/jadwal-cabang" element={<BranchSchedulePage />} />
						<Route path="/articles" element={<ArticlesPage />} />
						<Route path="/gallery" element={<GalleryPage />} />
						<Route path="/pertandingan" element={<AllMatchesPage />} />
						<Route
							path="/match/:id"
							element={<MatchDetailPage isPublic={true} />}
						/>
						<Route
							path="/articles/:id"
							element={<ArticleDetailPage isPublic={true} />}
						/>
						<Route path="/login" element={<LoginPage />} />
						<Route element={<ProtectedRoute />}>
							<Route path="/portal" element={<RoleBasedRedirect />} />
							<Route path="/member/:id" element={<MemberDetailPage />} />
							<Route
								path="/member/:id/report/:evaluationId"
								element={<MemberReportPage />}
							/>

							{/* Unified Layout untuk semua role (admin, admin_cabang, member) */}
							<Route element={<MainLayout />}>
								{/* Admin Routes */}
								<Route path="/admin/dashboard" element={<AdminDashboardPage />} />
								<Route path="/admin/cabang" element={<BranchManagementPage />} />
								<Route path="/admin/cabang/:id" element={<BranchDetailPage />} />
								<Route path="/admin/users" element={<UserManagementPage />} />
								<Route path="/admin/member/:id" element={<MemberDetailPage />} />
								<Route path="/admin/feedback" element={<FeedbackPage />} />
								<Route path="/admin/articles" element={<ArticleManagementPage />} />
								<Route path="/admin/articles/:id" element={<ArticleEditorPage />} />
								<Route path="/admin/hero-gallery" element={<HeroGalleryManagementPage />} />
								<Route path="/admin/pertandingan" element={<MatchManagementPage />} />
								<Route path="/admin/pertandingan/edit/:id" element={<MatchEditorPage />} />
								<Route path="/admin/pertandingan/:id" element={<MatchEditorPage />} />
								<Route path="/admin/settings" element={<ProfileSettingsPage />} />

								{/* Admin Cabang Routes */}
								<Route path="/absensi" element={<AttendancePage />} />
								<Route path="/jadwal" element={<ScheduleManagementPage />} />
								<Route path="/members" element={<MemberListPage />} />
								<Route path="/laporan" element={<AttendanceReportPage />} />
								<Route path="/feedback" element={<FeedbackPage />} />
								<Route path="/cabang/settings" element={<ProfileSettingsPage />} />
								<Route path="/branch/member/:id" element={<MemberDetailPage />} />

								{/* Member Routes */}
								<Route path="/profil" element={<MyProfilePage />} />
								<Route path="/rapor" element={<MemberReportListPage />} />
								<Route path="/pembayaran" element={<PaymentPage />} />
								<Route path="/feedback-saya" element={<FeedbackHistoryPage />} />
								<Route path="/member/settings" element={<ProfileSettingsPage />} />
							</Route>
						</Route>
						<Route path="*" element={<NotFoundPage />} />
					</Routes>
					</Suspense>
				</AxiosInterceptor>
			</AuthProvider>
		</Router>
	);
}

export default App;
