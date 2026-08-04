import React, { useState } from 'react';

export const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Hàm kiểm tra quy tắc (Validation)
  const validate = (data) => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!data.email) {
      errs.email = 'Vui lòng nhập Email.';
    } else if (!emailRegex.test(data.email)) {
      errs.email = 'Email không đúng định dạng.';
    }

    if (!data.password) {
      errs.password = 'Vui lòng nhập mật khẩu.';
    } else if (data.password.length < 8) {
      errs.password = 'Mật khẩu phải từ 8 ký tự trở lên.';
    }
    return errs;
  };

  // Chỉ báo lỗi khi người dùng đã bấm vào rồi thoát ra (onBlur)
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(formData));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (touched[name]) setErrors(validate(updated));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  setTouched({ email: true, password: true });
  const validationErrors = validate(formData);
  setErrors(validationErrors);
  
  if (Object.keys(validationErrors).length > 0) return;

  setIsSubmitting(true);
  setApiError('');

  try {
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  } catch (err) {
    console.error('Lỗi khi đăng nhập:', err);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>
      
      {apiError && (
        <div role="alert" className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">
          {apiError}
        </div>
      )}

      {/* Email Input */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={() => handleBlur('email')}
          aria-invalid={touched.email && !!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {touched.email && errors.email && (
          <p id="email-error" role="alert" className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={() => handleBlur('password')}
          aria-invalid={touched.password && !!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {touched.password && errors.password && (
          <p id="password-error" role="alert" className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Đang gửi...' : 'Đăng nhập'}
      </button>
    </form>
  );
};