import React from "react";
import { FiFileText } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DocumentLinks = ({ memberInfo }) => {
	const hasDocuments =
		memberInfo.kk_url || memberInfo.akte_url || memberInfo.biodata_url;

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h2 className="text-xl font-bold text-primary mb-4">Dokumen Pendukung</h2>
			{hasDocuments ? (
				<div className="space-y-2">
					{memberInfo.kk_url && (
						<a
							href={`${API_BASE_URL}${memberInfo.kk_url}`}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
						>
							<FiFileText /> Lihat Kartu Keluarga (KK)
						</a>
					)}
					{memberInfo.akte_url && (
						<a
							href={`${API_BASE_URL}${memberInfo.akte_url}`}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
						>
							<FiFileText /> Lihat Akte Lahir
						</a>
					)}
					{memberInfo.biodata_url && (
						<a
							href={`${API_BASE_URL}${memberInfo.biodata_url}`}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
						>
							<FiFileText /> Lihat Biodata
						</a>
					)}
				</div>
			) : (
				<p className="text-sm text-gray-500">
					Member ini belum mengunggah dokumen pendukung.
				</p>
			)}
		</div>
	);
};

export default DocumentLinks;
