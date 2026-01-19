import React from "react";
import { FiCheckCircle, FiFileText, FiTrash2 } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Komponen untuk menangani logika upload/view dokumen
const DocumentUploadField = ({
	docType,
	docUrl,
	label,
	onFileChange,
	fileName,
	onDelete,
}) => {
	if (docUrl) {
		return (
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					{label}
				</label>
				<div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
					<div className="flex items-center gap-2 text-green-700">
						<FiCheckCircle />
						<span className="font-semibold text-sm">
							Dokumen Sudah Terunggah
						</span>
					</div>
					<div className="flex flex-col  md:flex-row items-center gap-2">
						<a
							href={`${API_BASE_URL}${docUrl}`}
							target="_blank"
							rel="noopener noreferrer"
							className="py-1 px-6 bg-slate-200 rounded text-sm font-semibold text-secondary hover:underline"
						>
							Lihat
						</a>
						<button
							type="button"
							onClick={() => onDelete(docType)}
							className="flex items-center py-1 px-2 rounded bg-red-500 text-white gap-2 hover:text-red-700"
						>
							<FiTrash2 size={16} /> Hapus
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-1">
				{label}
			</label>
			<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
				<div className="space-y-1 text-center">
					<FiFileText className="mx-auto h-12 w-12 text-gray-400" />
					<div className="flex text-sm text-gray-600">
						<label
							htmlFor={docType}
							className="relative cursor-pointer bg-white rounded-md font-medium text-secondary hover:text-primary focus-within:outline-none"
						>
							<span>Pilih file</span>
							<input
								id={docType}
								name={docType}
								type="file"
								className="sr-only"
								onChange={onFileChange}
							/>
						</label>
						<p className="pl-1">atau seret dan lepas</p>
					</div>
					<p className="text-xs text-gray-500">
						{fileName || "PNG, JPG, PDF hingga 2MB"}
					</p>
				</div>
			</div>
		</div>
	);
};

export default DocumentUploadField;
