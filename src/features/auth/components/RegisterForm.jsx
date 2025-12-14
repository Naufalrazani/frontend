import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@features/auth/hooks/useAuth";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiMapPin,
  FiLoader,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      let cleaned = value.replace(/\D/g, "");

      if (cleaned === "") {
        setFormData({ ...formData, phone: "" });
        return;
      }

      if (cleaned === "0") {
        cleaned = "62";
      }

      if (cleaned === "6") {
        setFormData({ ...formData, phone: "6" });
        return;
      }

      if (cleaned === "62") {
        setFormData({ ...formData, phone: "62" });
        return;
      }

      if (!cleaned.startsWith("62")) {
        cleaned = "62" + cleaned;
      }

      setFormData({ ...formData, phone: cleaned });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    setIsLoading(true);

    const { confirmPassword, ...registerData } = formData;

    try {
      await register(registerData);

      alert("Pendaftaran berhasil! Silakan masuk dengan akun Anda.");
      navigate("/auth/login");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Terjadi kesalahan saat pendaftaran.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl space-y-4 border-t-4 border-red-500 max-w-sm sm:max-w-md mx-auto w-full"
    >
      {error && (
        <div
          className="p-2 sm:p-3 text-xs sm:text-sm text-red-700 bg-red-100 border border-red-400 rounded-md"
          role="alert"
        >
          {error}
        </div>
      )}

      <InputWithIcon
        id="name"
        name="name"
        type="text"
        label="Nama Lengkap"
        icon={FiUser}
        value={formData.name}
        onChange={handleChange}
        disabled={isLoading}
      />

      <InputWithIcon
        id="email"
        name="email"
        type="email"
        label="Alamat Email"
        icon={FiMail}
        value={formData.email}
        onChange={handleChange}
        disabled={isLoading}
      />

      <InputWithIcon
        id="phone"
        name="phone"
        type="tel"
        label="Nomor Telepon (Format: 62xxxxxxxxxx)"
        icon={FiPhone}
        value={formData.phone}
        onChange={handleChange}
        disabled={isLoading}
      />

      <InputWithIcon
        id="city"
        name="city"
        type="text"
        label="Kota Domisili"
        icon={FiMapPin}
        value={formData.city}
        onChange={handleChange}
        disabled={isLoading}
      />

      <PasswordInput
        id="password"
        name="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        disabled={isLoading}
        show={showPassword}
        toggle={() => setShowPassword(!showPassword)}
      />

      <PasswordInput
        id="confirmPassword"
        name="confirmPassword"
        label="Konfirmasi Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        disabled={isLoading}
        show={showConfirmPassword}
        toggle={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <FiLoader className="animate-spin mr-2 h-5 w-5" />
          ) : (
            "Daftar"
          )}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;

const InputWithIcon = ({
  id,
  name,
  type,
  label,
  icon: Icon,
  value,
  onChange,
  disabled,
  autoComplete = "off",
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-xs sm:text-sm font-medium text-primary-700"
    >
      {label}
    </label>

    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-400" />
      </div>

      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={label}
        className="appearance-none block w-full pl-10 pr-3 py-2.5 sm:py-3 border border-primary-300 rounded-md placeholder-gray-400 placeholder:text-xs sm:placeholder:text-sm text-sm focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:opacity-75"
      />
    </div>
  </div>
);

const PasswordInput = ({
  id,
  name,
  label,
  value,
  onChange,
  disabled,
  show,
  toggle,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-xs sm:text-sm font-medium text-primary-700"
    >
      {label}
    </label>

    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiLock className="h-4 w-4 sm:h-5 sm:w-5 text-primary-400" />
      </div>

      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        required
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={label}
        className="appearance-none block w-full pl-10 pr-10 py-2.5 sm:py-3 border border-primary-300 rounded-md placeholder-gray-400 placeholder:text-xs sm:placeholder:text-sm text-sm focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:opacity-75"
      />

      <button
        type="button"
        onClick={toggle}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary-400 hover:text-primary-600 cursor-pointer"
        tabIndex={-1}
      >
        {show ? (
          <FiEyeOff className="h-5 w-5" />
        ) : (
          <FiEye className="h-5 w-5" />
        )}
      </button>
    </div>
  </div>
);
