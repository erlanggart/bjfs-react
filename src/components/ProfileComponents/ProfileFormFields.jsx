import React from "react";
import { FiLock } from "react-icons/fi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Komponen helper untuk input field biasa
export const InputField = ({ icon, label, ...props }) => (
	<div>
		<label className="block text-sm font-medium text-gray-700 mb-1">
			{label}
		</label>
		<div className="relative">
			<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
				{icon}
			</span>
			<input
				{...props}
				className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-secondary"
			/>
		</div>
	</div>
);

export const TextareaField = ({ icon, label, ...props }) => (
	<div>
		<label className="block text-sm font-medium text-gray-700 mb-1">
			{label}
		</label>
		<div className="relative">
			<span className="absolute top-3 left-0 flex items-center pl-3 text-gray-400">
				{icon}
			</span>
			<textarea
				{...props}
				rows="3"
				className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-secondary"
			/>
		</div>
	</div>
);

// Komponen helper khusus untuk input password dengan tombol view/hide
export const PasswordField = ({ label, value, onChange, isVisible, onToggle }) => (
	<div>
		<label className="block text-sm font-medium text-gray-700 mb-1">
			{label}
		</label>
		<div className="relative">
			<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
				<FiLock />
			</span>
			<input
				type={isVisible ? "text" : "password"}
				value={value}
				onChange={onChange}
				className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-secondary"
			/>
			<button
				type="button"
				onClick={onToggle}
				className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
			>
				{isVisible ? <FaEyeSlash /> : <FaEye />}
			</button>
		</div>
	</div>
);
