import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiFileText, FiChevronRight } from "react-icons/fi";

const MemberReportListPage = () => {
	const [reports, setReports] = useState([]);
	const [memberInfo, setMemberInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchReports = async () => {
			try {
				const response = await axios.get("/api/members/my-evaluations");
				setReports(response.data.evaluations);
				setMemberInfo(response.data.member_info);
			} catch (error) {
				console.error("Gagal memuat daftar rapor", error);
			} finally {
				setLoading(false);
			}
		};
		fetchReports();
	}, []);

	if (loading) return <p className="p-6">Memuat daftar rapor...</p>;

	return (
		<div className="p-4 sm:p-6">
			<h1 className="text-2xl font-bold text-gray-800 mb-4">
				Daftar Rapor Evaluasi
			</h1>
			<div className="bg-white rounded-lg shadow-md">
				{reports.length > 0 ? (
					reports.map((report) => (
						<Link
							to={`/member/${memberInfo.id}/report/${report.id}`}
							state={{ evaluation: report, memberInfo: memberInfo }}
							key={report.id}
							className="flex items-center justify-between p-4 border-b hover:bg-gray-50"
						>
							<div>
								<p className="font-semibold text-primary">
									Laporan{" "}
									{new Date(report.evaluation_date).toLocaleDateString(
										"id-ID",
										{ month: "long", year: "numeric" }
									)}
								</p>
								<p className="text-sm text-gray-500 capitalize">
									Tipe: {report.report_type}
								</p>
							</div>
							<FiChevronRight className="text-gray-400" />
						</Link>
					))
				) : (
					<p className="p-6 text-center text-gray-500">
						Belum ada rapor yang tersedia.
					</p>
				)}
			</div>
		</div>
	);
};

export default MemberReportListPage;
