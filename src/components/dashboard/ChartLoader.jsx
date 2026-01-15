// File: src/components/dashboard/ChartLoader.jsx
import React from "react";

const ChartLoader = () => {
	return (
		<div className="w-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-lg">
			<div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-secondary"></div>
			<p className="mt-4 text-sm font-semibold text-gray-500">
				Memuat data grafik...
			</p>
		</div>
	);
};

export default ChartLoader;
