// File: src/pages/ProfileSettingsPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import Swal from "sweetalert2";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  FiCamera,
  FiUser,
  FiPhone,
  FiLock,
  FiUpload,
  FiCheckCircle,
  FiFileText,
  FiTrash2,
  FiEdit2,
  FiCalendar,
  FiUserPlus,
  FiMapPin,
  FiSave,
  FiX,
  FiAward,
  FiEdit,
  FiFile,
} from "react-icons/fi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  DocumentUploadField,
  AchievementItem,
  AddAchievementForm,
  CompetencyItem,
  AddCompetencyForm,
  InputField,
  TextareaField,
  PasswordField,
} from "../components/ProfileComponents";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProfileSettingsPage = () => {
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // State untuk form
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [dateOfBirth, setDateOfBirth] = useState(""); // State baru
  const [registrationDate, setRegistrationDate] = useState(""); // State baru
  const [address, setAddress] = useState(""); // State baru

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [signatureMode, setSignatureMode] = useState("draw"); // 'draw' atau 'upload'
  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState("");
  const [existingSignature, setExistingSignature] = useState(""); // Signature yang sudah ada
  const [achievements, setAchievements] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const sigCanvas = useRef({});

  const [documents, setDocuments] = useState({
    kk: null,
    akte: null,
    biodata: null,
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const triggerRefetch = () => setRefreshKey((prev) => prev + 1);

  const fetchProfile = async () => {
    try {
      const requests = [api.get("/api/users/my-profile")];

      // Tambahkan request sesuai role
      if (user.role === "member") {
        requests.push(api.get("/api/members/my-achievements"));
      } else if (user.role === "admin_cabang") {
        requests.push(api.get("/api/branch_admins/my-competencies"));
      }

      const responses = await Promise.all(requests);

      // Backend returns { success: true, profile: {...} }
      const profileData = responses[0].data.profile;

      setProfile(profileData);

      if (user.role === "member") {
        setAchievements(responses[1]?.data || []);
      } else if (user.role === "admin_cabang") {
        setCompetencies(responses[1]?.data || []);
      }

      setUsername(profileData.username || "");
      setFullName(profileData.full_name || "");
      setPhoneNumber(profileData.phone_number || "");
      setDateOfBirth(profileData.date_of_birth || "");
      setAddress(profileData.address || "");
      setRegistrationDate(
        profileData.registration_date
          ? profileData.registration_date.split(" ")[0]
          : "",
      );
      setAvatarPreview(profileData.avatar);
      setExistingSignature(profileData.signature || ""); // Set existing signature
    } catch {
      Swal.fire("Error", "Gagal memuat data profil.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchProfile();
  }, [user, refreshKey]);

  const handleDocumentChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setDocuments((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleDocumentUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    let fileCount = 0;
    if (documents.kk) {
      formData.append("kk", documents.kk);
      fileCount++;
    }
    if (documents.akte) {
      formData.append("akte", documents.akte);
      fileCount++;
    }
    if (documents.biodata) {
      formData.append("biodata", documents.biodata);
      fileCount++;
    }

    if (fileCount === 0) {
      Swal.fire("Info", "Pilih minimal satu file untuk diunggah.", "info");
      return;
    }

    try {
      await api.post("/api/members/upload-documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire("Sukses", "Dokumen Anda berhasil diunggah!", "success");
      fetchProfile();
    } catch (error) {
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Gagal mengunggah dokumen.",
        "error",
      );
    }
  };

  const handleDocumentDelete = async (docType) => {
    Swal.fire({
      title: "Hapus Dokumen Ini?",
      text: "Tindakan ini tidak dapat dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete("/api/members/delete-document", {
            doc_type: docType,
          });
          Swal.fire("Dihapus!", "Dokumen telah berhasil dihapus.", "success");
          fetchProfile(); // Muat ulang data profil untuk menampilkan form upload lagi
        } catch (err) {
          Swal.fire(
            "Gagal!",
            err.response?.data?.message || "Gagal menghapus dokumen.",
            "error",
          );
        }
      }
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    try {
      await api.post("/api/users/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire("Sukses", "Foto profil berhasil diperbarui!", "success");
    } catch (error) {
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Gagal mengunggah foto.",
        "error",
      );
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put("/api/users/update-profile", {
        username: username,
        full_name: fullName,
        phone_number: phoneNumber,
        address: address, // Kirim data baru
        date_of_birth: dateOfBirth, // Kirim data baru
        registration_date: registrationDate, // Kirim data baru
      });
      Swal.fire("Sukses", "Informasi profil berhasil diperbarui!", "success");
    } catch (error) {
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Gagal memperbarui profil.",
        "error",
      );
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      Swal.fire(
        "Oops...",
        "Password baru dan konfirmasi tidak cocok.",
        "warning",
      );
      return;
    }
    try {
      await api.post("/api/users/change-password", {
        current_password: passwords.current,
        new_password: passwords.new,
      });
      Swal.fire("Sukses", "Password berhasil diubah!", "success");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Gagal mengubah password.",
        "error",
      );
    }
  };

  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignatureFile(file);
      setSignaturePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveSignature = async () => {
    if (signatureMode === "draw") {
      if (sigCanvas.current.isEmpty()) {
        Swal.fire(
          "Info",
          "Silakan gambar tanda tangan Anda terlebih dahulu.",
          "info",
        );
        return;
      }
      const signatureData = sigCanvas.current.toDataURL();
      try {
        await api.post("/api/users/save-signature", {
          signature: signatureData,
        });
        Swal.fire("Sukses", "Tanda tangan berhasil disimpan!", "success");
        fetchProfile();
        sigCanvas.current.clear();
        setSignaturePreview("");
      } catch {
        Swal.fire("Gagal", "Gagal menyimpan tanda tangan.", "error");
      }
    } else {
      // Mode 'upload'
      if (!signatureFile) {
        Swal.fire(
          "Info",
          "Pilih file gambar tanda tangan terlebih dahulu.",
          "info",
        );
        return;
      }
      const formData = new FormData();
      formData.append("signature", signatureFile);
      try {
        await api.post("/api/users/save-signature", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Sukses", "Tanda tangan berhasil diunggah!", "success");
        fetchProfile();
        setSignatureFile(null);
        setSignaturePreview("");
      } catch (error) {
        Swal.fire(
          "Gagal",
          error.response?.data?.message || "Gagal mengunggah tanda tangan.",
          "error",
        );
      }
    }
  };

  const handleUpdateAchievement = async (id, data) => {
    try {
      await api.put(`/api/members/achievements/${id}`, {
        achievement_name: data.name,
        event_date: data.date,
        notes: data.notes,
      });
      Swal.fire("Sukses!", "Prestasi berhasil diperbarui.", "success");
      triggerRefetch();
    } catch {
      Swal.fire("Gagal", "Gagal memperbarui prestasi.", "error");
    }
  };

  const handleDeleteAchievement = (id) => {
    Swal.fire({
      title: "Hapus Prestasi Ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/members/achievements/${id}`);
          Swal.fire("Dihapus!", "Prestasi telah dihapus.", "success");
          triggerRefetch();
        } catch {
          Swal.fire("Gagal!", "Gagal menghapus prestasi.", "error");
        }
      }
    });
  };

  const handleUpdateCompetency = async (id, data) => {
    try {
      await api.put(`/api/branch_admins/competencies/${id}`, {
        id: id,
        competency_name: data.name,
        issuer: data.issuer,
        date_obtained: data.date_obtained,
        certificate_number: data.certificate_number,
        description: data.description,
      });
      Swal.fire("Sukses!", "Kompetensi berhasil diperbarui.", "success");
      triggerRefetch();
    } catch {
      Swal.fire("Gagal", "Gagal memperbarui kompetensi.", "error");
    }
  };

  const handleDeleteCompetency = (id) => {
    Swal.fire({
      title: "Hapus Kompetensi Ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/branch_admins/competencies/${id}`);
          Swal.fire("Dihapus!", "Kompetensi telah dihapus.", "success");
          triggerRefetch();
        } catch {
          Swal.fire("Gagal!", "Gagal menghapus kompetensi.", "error");
        }
      }
    });
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) return <p className="text-center p-10">Memuat...</p>;

  return (
    <div className="p-4 sm:p-6 ">
      <div className="bg-primary px-6 py-4 rounded-lg mb-6 shadow-md text-center">
        <h1 className="text-3xl font-bold text-white">Pengaturan Profil</h1>
      </div>
      <div className="">
        {user && user.role === "member" && (
          <>
            {/* Top Section: Avatar + Profile Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
              {/* Avatar Section */}
                <div className=" text-center">
                  <div className="relative w-60  mx-auto mb-4">
                    {(() => {
                      let imageSrc;

                      if (!avatarPreview) {
                        imageSrc = `https://placehold.co/128x128/E0E0E0/757575?text=${
                          fullName ? fullName.charAt(0) : "U"
                        }`;
                      } else if (avatarPreview.startsWith("blob:")) {
                        imageSrc = avatarPreview;
                      } else if (avatarPreview.startsWith("http")) {
                        imageSrc = avatarPreview;
                      } else {
                        imageSrc = `${API_BASE_URL}${avatarPreview}`;
                      }

                      return (
                        <img
                          src={imageSrc}
                          alt="Avatar Preview"
                          className="w-full rounded-full aspect-square object-cover"
                          onError={(e) => {
                            e.target.src = `https://placehold.co/128x128/E0E0E0/757575?text=${
                              fullName ? fullName.charAt(0) : "U"
                            }`;
                          }}
                        />
                      );
                    })()}
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-2 right-0  bg-secondary text-white p-4 rounded-full cursor-pointer hover:opacity-90"
                    >
                      <FiCamera />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  <button
                    onClick={handleAvatarUpload}
                    disabled={!avatarFile}
                    className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg disabled:bg-gray-400"
                  >
                    Simpan Foto
                  </button>
                </div>

                {/* Profile Info Section */}
                <form
                  onSubmit={handleProfileUpdate}
                  className="bg-white rounded-xl shadow-lg p-6 "
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Informasi Pribadi & Akun
                  </h2>
                  <div className="space-y-4">
                    <InputField
                      icon={<FiUser />}
                      label="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Masukkan username Anda"
                    />
                    <InputField
                      icon={<FiUser />}
                      label="Nama Lengkap"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <InputField
                      icon={<FiPhone />}
                      label="Nomor Telepon"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Contoh: 08123456789"
                    />

                    <TextareaField
                      icon={<FiMapPin />}
                      label="Alamat"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Masukkan alamat lengkap"
                      disabled={user?.role === "admin"}
                    />

                    <InputField
                      icon={<FiCalendar />}
                      label="Tanggal Lahir"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      disabled={user?.role === "admin"}
                    />
                    <InputField
                      icon={<FiUserPlus />}
                      label="Tanggal Awal Gabung"
                      type="date"
                      value={registrationDate}
                      onChange={(e) => setRegistrationDate(e.target.value)}
                      disabled={user?.role === "admin"}
                    />
                  </div>
                  <div className="text-right mt-6">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>

                {/* Password Section */}
                <form
                  onSubmit={handlePasswordChange}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Ubah Password
                  </h2>
                  <div className="space-y-4">
                    <PasswordField
                      label="Password Saat Ini"
                      value={passwords.current}
                      isVisible={passwordVisibility.current}
                      onToggle={() => togglePasswordVisibility("current")}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, current: e.target.value }))
                      }
                    />
                    <PasswordField
                      label="Password Baru"
                      value={passwords.new}
                      isVisible={passwordVisibility.new}
                      onToggle={() => togglePasswordVisibility("new")}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, new: e.target.value }))
                      }
                    />
                    <PasswordField
                      label="Konfirmasi Password Baru"
                      value={passwords.confirm}
                      isVisible={passwordVisibility.confirm}
                      onToggle={() => togglePasswordVisibility("confirm")}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, confirm: e.target.value }))
                      }
                    />
                  </div>
                  <div className="text-right mt-6">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg"
                    >
                      Ubah Password
                    </button>
                  </div>
                </form>
              </div>

              
              <div className="space-y-6">
                {/* Documents Section */}
              <form
                onSubmit={handleDocumentUpload}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Unggah Dokumen Pendukung
                </h2>
                <div className="space-y-4">
                  <DocumentUploadField
                    docType="kk"
                    docUrl={profile?.kk_url}
                    label="Kartu Keluarga (KK)"
                    onFileChange={handleDocumentChange}
                    fileName={documents.kk?.name}
                    onDelete={handleDocumentDelete}
                  />
                  <DocumentUploadField
                    docType="akte"
                    docUrl={profile?.akte_url}
                    label="Akte Lahir"
                    onFileChange={handleDocumentChange}
                    fileName={documents.akte?.name}
                    onDelete={handleDocumentDelete}
                  />
                  <DocumentUploadField
                    docType="biodata"
                    docUrl={profile?.biodata_url}
                    label="Biodata"
                    onFileChange={handleDocumentChange}
                    fileName={documents.biodata?.name}
                    onDelete={handleDocumentDelete}
                  />
                </div>
                <div className="text-right mt-6">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg"
                  >
                    Unggah Dokumen Terpilih
                  </button>
                </div>
              </form>

                {/* Add Achievement Form */}
                <AddAchievementForm refetch={triggerRefetch} />

                {/* Achievements List */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-primary mb-4">
                    Prestasi Saya
                  </h2>
                  <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-2">
                    {achievements.length > 0 ? (
                      achievements.map((ach) => (
                        <AchievementItem
                          key={ach.id}
                          achievement={ach}
                          onUpdate={handleUpdateAchievement}
                          onDelete={handleDeleteAchievement}
                        />
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        Belum ada prestasi yang ditambahkan.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {user && user.role === "admin_cabang" && (
          <>
            {/* Avatar + Signature Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Avatar Section */}
              <div className=" text-center">
                <div className="relative w-60  mx-auto mb-4">
                  {(() => {
                    let imageSrc;

                    if (!avatarPreview) {
                      imageSrc = `https://placehold.co/128x128/E0E0E0/757575?text=${
                        fullName ? fullName.charAt(0) : "U"
                      }`;
                    } else if (avatarPreview.startsWith("blob:")) {
                      imageSrc = avatarPreview;
                    } else if (avatarPreview.startsWith("http")) {
                      imageSrc = avatarPreview;
                    } else {
                      imageSrc = `${API_BASE_URL}${avatarPreview}`;
                    }

                    return (
                      <img
                        src={imageSrc}
                        alt="Avatar Preview"
                        className="w-full rounded-full aspect-square object-cover"
                        onError={(e) => {
                          e.target.src = `https://placehold.co/128x128/E0E0E0/757575?text=${
                            fullName ? fullName.charAt(0) : "U"
                          }`;
                        }}
                      />
                    );
                  })()}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-2 right-0  bg-secondary text-white p-4 rounded-full cursor-pointer hover:opacity-90"
                  >
                    <FiCamera />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <button
                  onClick={handleAvatarUpload}
                  disabled={!avatarFile}
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg disabled:bg-gray-400"
                >
                  Simpan Foto
                </button>
              </div>

              {/* Signature Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Tanda Tangan Digital
                </h2>

                {/* Display Existing Signature */}
                {existingSignature ? (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-sm font-medium text-gray-700">
                        Tanda Tangan Saat Ini
                      </p>
                      <button
                        onClick={() => {
                          if (window.confirm("Hapus tanda tangan ini?")) {
                            setExistingSignature("");
                          }
                        }}
                        className="text-xs text-red-600 hover:text-red-800 font-semibold"
                      >
                        Hapus
                      </button>
                    </div>
                    <div className="border rounded-md p-3 bg-white flex items-center justify-center h-40">
                      {existingSignature.startsWith("data:") ? (
                        <img
                          src={existingSignature}
                          alt="Existing Signature"
                          className="max-h-full max-w-full"
                        />
                      ) : (
                        <img
                          src={`${API_BASE_URL}${existingSignature}`}
                          alt="Existing Signature"
                          className="max-h-full max-w-full"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ctext x='10' y='50' font-size='12'%3EGambar tidak ditemukan%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Klik tombol Hapus di atas untuk mengganti dengan tanda
                      tangan baru
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Tombol Pilihan Mode */}
                    <div className="flex border border-gray-200 rounded-lg p-1 mb-4 w-min">
                      <button
                        onClick={() => setSignatureMode("draw")}
                        className={`flex items-center gap-2 px-3 py-1 text-sm rounded-md ${
                          signatureMode === "draw"
                            ? "bg-secondary text-white"
                            : "text-gray-500"
                        }`}
                      >
                        <FiEdit2 /> Gambar
                      </button>
                      <button
                        onClick={() => setSignatureMode("upload")}
                        className={`flex items-center gap-2 px-3 py-1 text-sm rounded-md ${
                          signatureMode === "upload"
                            ? "bg-secondary text-white"
                            : "text-gray-500"
                        }`}
                      >
                        <FiUpload /> Unggah
                      </button>
                    </div>

                    {signatureMode === "draw" ? (
                      <div>
                        <div className="border rounded-md">
                          <SignatureCanvas
                            ref={sigCanvas}
                            penColor="black"
                            canvasProps={{ className: "w-full h-48" }}
                          />
                        </div>
                        <button
                          onClick={() => sigCanvas.current.clear()}
                          className="text-xs text-gray-500 mt-2 hover:underline"
                        >
                          Bersihkan Kanvas
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-full sm:w-1/2">
                          <label
                            htmlFor="signature-upload"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Pilih File (PNG/JPG)
                          </label>
                          <input
                            id="signature-upload"
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleSignatureChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20"
                          />
                        </div>
                        <div className="w-full sm:w-1/2">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Preview
                          </p>
                          <div className="border rounded-md p-2 h-32 flex items-center justify-center bg-gray-50">
                            {signaturePreview ? (
                              <img
                                src={signaturePreview}
                                alt="Preview Tanda Tangan"
                                className="max-h-full max-w-full"
                              />
                            ) : (
                              <p className="text-xs text-gray-400">
                                Tidak ada gambar
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="text-right mt-6">
                      <button
                        onClick={handleSaveSignature}
                        className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg"
                      >
                        Simpan Tanda Tangan
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Profile Form + Password - 2 Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Profile Form */}
              <form
                onSubmit={handleProfileUpdate}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Informasi Pribadi & Akun
                </h2>
                <div className="space-y-4">
                  <InputField
                    icon={<FiUser />}
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username Anda"
                  />
                  <InputField
                    icon={<FiUser />}
                    label="Nama Lengkap"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <InputField
                    icon={<FiPhone />}
                    label="Nomor Telepon"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Contoh: 08123456789"
                  />

                  <TextareaField
                    icon={<FiMapPin />}
                    label="Alamat"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Masukkan alamat lengkap"
                  />
                </div>
                <div className="text-right mt-6">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>

              {/* Password Section */}
              <form
                onSubmit={handlePasswordChange}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Ubah Password
                </h2>
                <div className="space-y-4">
                  <PasswordField
                    label="Password Saat Ini"
                    value={passwords.current}
                    isVisible={passwordVisibility.current}
                    onToggle={() => togglePasswordVisibility("current")}
                    onChange={(e) =>
                      setPasswords((p) => ({ ...p, current: e.target.value }))
                    }
                  />
                  <PasswordField
                    label="Password Baru"
                    value={passwords.new}
                    isVisible={passwordVisibility.new}
                    onToggle={() => togglePasswordVisibility("new")}
                    onChange={(e) =>
                      setPasswords((p) => ({ ...p, new: e.target.value }))
                    }
                  />
                  <PasswordField
                    label="Konfirmasi Password Baru"
                    value={passwords.confirm}
                    isVisible={passwordVisibility.confirm}
                    onToggle={() => togglePasswordVisibility("confirm")}
                    onChange={(e) =>
                      setPasswords((p) => ({ ...p, confirm: e.target.value }))
                    }
                  />
                </div>
                <div className="text-right mt-6">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg"
                  >
                    Ubah Password
                  </button>
                </div>
              </form>
            </div>

            {/* Competencies Section - Full Width */}
            <AddCompetencyForm refetch={triggerRefetch} />

            <div className="bg-white rounded-xl shadow-lg p-6 my-6">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <FiAward /> Kompetensi & Sertifikasi Saya
              </h2>
              <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                {competencies.length > 0 ? (
                  competencies.map((comp) => (
                    <CompetencyItem
                      key={comp.id}
                      competency={comp}
                      onUpdate={handleUpdateCompetency}
                      onDelete={handleDeleteCompetency}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">
                    Belum ada kompetensi yang ditambahkan.
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 w-full bg-secondary text-white text-sm font-semibold rounded-lg disabled:bg-gray-400"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
