// File: src/App.jsx
import React, { useEffect } from "react";
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
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoutes";
import MainLayout from "./layouts/MainLayout";

import BranchManagementPage from "./pages/admin/BranchManagementPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import AttendancePage from "./pages/branch-admin/Attendance";
import MyProfilePage from "./pages/member/MyProfilePage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ScheduleManagementPage from "./pages/branch-admin/ScheduleManagementPage";
import BranchAdminLayout from "./layouts/BranchAdminLayout";
import AttendanceReportPage from "./pages/branch-admin/AttendanceReportPage";
import MemberLayout from "./layouts/MemberLayout";
import ProfileSettingsPage from "./pages/ProfileSettings";
import BranchDetailPage from "./pages/admin/BranchDetailPage";
import LandingPage from "./pages/LandingPage";
import MemberDetailPage from "./pages/MemberDetailPage";
import MemberListPage from "./pages/branch-admin/MemberListPage";
import ArticleManagementPage from "./pages/admin/ArticleManagementPage";
import ArticleEditorPage from "./pages/admin/ArticleEditorPage";
import MemberReportPage from "./pages/member/MemberRaportPage";
import MemberReportListPage from "./pages/member/MemberRaportList";
import AxiosInterceptor from "./components/AxiosInterceptor";
import PaymentPage from "./pages/member/PaymentPage";
import FeedbackPage from "./pages/admin/FeedbackPage";
import FeedbackHistoryPage from "./pages/member/FeedbackHistory";
import ArticleDetailPage from "./pages/public/ArticleDetailPage";
import ArticlesPage from "./pages/ArticlesPage";
import MatchManagementPage from "./pages/admin/MatchManagementPage";
import MatchEditorPage from "./pages/admin/MatchEditorPage";
import MatchDetailPage from "./pages/MatchDetailPage";
import AllMatchesPage from "./pages/AllMatchesPage";
import GalleryPage from "./pages/GalleryPage";
import HeroGalleryManagementPage from "./pages/admin/HeroGalleryManagementPage";
import BranchesPage from "./pages/public/BranchesPage";
import BranchSchedulePage from "./pages/public/BranchSchedulePage";
import NotFoundPage from "./pages/NotFoundPage";

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
						<Route path="pertandingan/:id" element={<MatchDetailPage />} />"
						<Route path="/login" element={<LoginPage />} />
						<Route element={<ProtectedRoute />}>
							<Route path="/portal" element={<RoleBasedRedirect />} />
							<Route path="/member/:id" element={<MemberDetailPage />} />
							<Route
								path="/member/:id/report/:evaluationId"
								element={<MemberReportPage />}
							/>

							{/* Rute untuk Super Admin dengan MainLayout */}
							<Route path="/admin" element={<MainLayout />}>
								<Route path="dashboard" element={<AdminDashboardPage />} />
								<Route path="cabang" element={<BranchManagementPage />} />
								<Route path="cabang/:id" element={<BranchDetailPage />} />
								<Route path="users" element={<UserManagementPage />} />
							<Route path="member/:id" element={<MemberDetailPage />} />
							<Route path="feedback" element={<FeedbackPage />} />
							<Route path="articles" element={<ArticleManagementPage />} />
							<Route path="hero-gallery" element={<HeroGalleryManagementPage />} />
							<Route path="pertandingan" element={<MatchManagementPage />} />"
								<Route
									path="pertandingan/edit/:id"
									element={<MatchEditorPage />}
								/>
								"
								<Route path="pertandingan/:id" element={<MatchEditorPage />} />"
								<Route
									path="/admin/articles/:id"
									element={<ArticleEditorPage />}
								/>
								<Route path="settings" element={<ProfileSettingsPage />} />
							</Route>

							{/* PERUBAHAN DI SINI: Rute untuk Admin Cabang dibungkus layout baru */}
							<Route element={<BranchAdminLayout />}>
								<Route path="/absensi" element={<AttendancePage />} />
								<Route path="/jadwal" element={<ScheduleManagementPage />} />
								<Route path="/members" element={<MemberListPage />} />
								<Route path="feedback" element={<FeedbackPage />} />
								<Route path="/laporan" element={<AttendanceReportPage />} />
								<Route
									path="/cabang/settings"
									element={<ProfileSettingsPage />}
								/>
								<Route
									path="branch/member/:id"
									element={<MemberDetailPage />}
								/>
							</Route>

							<Route element={<MemberLayout />}>
								<Route path="/profil" element={<MyProfilePage />} />
								<Route path="/rapor" element={<MemberReportListPage />} />
								<Route path="/pembayaran" element={<PaymentPage />} />
								<Route
									path="/feedback-saya"
									element={<FeedbackHistoryPage />}
								/>
								<Route
									path="/member/settings"
									element={<ProfileSettingsPage />}
								/>
							</Route>
						</Route>
						<Route path="*" element={<NotFoundPage />} />
					</Routes>
				</AxiosInterceptor>
			</AuthProvider>
		</Router>
	);
}

export default App;
