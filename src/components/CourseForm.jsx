import React, { useState, useEffect } from 'react';

export const CourseForm = ({ initialData = null, instructors = [], onSubmitSuccess }) => {
  // Pre-fill dữ liệu cũ nếu là sửa khóa học
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    level: initialData?.level || 'BEGINNER',
    duration: initialData?.duration || '',
    price: initialData?.price || '',
    instructorId: initialData?.instructorId || '',
    seats: initialData?.seats || '',
    summary: initialData?.summary || '',
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Số chỗ đã đăng ký của khóa học hiện tại (nếu có)
  const enrolledSeats = initialData?.enrolledSeats || 0;

  // Hàm Validate đáp ứng 100% yêu cầu đề bài Task 4
  const validate = (data) => {
    const errs = {};

    // 1. Title (5-120 ký tự)
    if (!data.title || data.title.length < 5 || data.title.length > 120) {
      errs.title = 'Tiêu đề phải từ 5 đến 120 ký tự.';
    }

    // 2. Level (BEGINNER, INTERMEDIATE, ADVANCED)
    if (!['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(data.level)) {
      errs.level = 'Vui lòng chọn trình độ hợp lệ.';
    }

    // 3. Duration (1-500 giờ)
    const durationNum = Number(data.duration);
    if (!data.duration || durationNum < 1 || durationNum > 500) {
      errs.duration = 'Thời lượng phải từ 1 đến 500 giờ.';
    }

    // 4. Price (>= 0, tối đa 2 số thập phân)
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    if (data.price === '' || Number(data.price) < 0 || !priceRegex.test(String(data.price))) {
      errs.price = 'Giá tiền phải >= 0 và tối đa 2 chữ số thập phân (Ví dụ: 19.99).';
    }

    // 5. Instructor (Bắt buộc chọn)
    if (!data.instructorId) {
      errs.instructorId = 'Vui lòng chọn giảng viên.';
    }

    // 6. Seats (Nguyên >= 1, không nhỏ hơn chỗ đã đăng ký)
    const seatsNum = Number(data.seats);
    if (!Number.isInteger(seatsNum) || seatsNum < 1) {
      errs.seats = 'Số chỗ phải là số nguyên >= 1.';
    } else if (seatsNum < enrolledSeats) {
      errs.seats = `Số chỗ không được nhỏ hơn số học viên đã đăng ký (${enrolledSeats} chỗ).`;
    }

    // 7. Summary (<= 500 ký tự)
    if (data.summary && data.summary.length > 500) {
      errs.summary = 'Tóm tắt không được vượt quá 500 ký tự.';
    }

    return errs;
  };

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
    // Đánh dấu tất cả field là đã tương tác khi submit
    const allTouched = Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const url = initialData 
        ? `http://localhost:3001/api/courses/${initialData.id}`
        : 'http://localhost:3001/api/courses';
      
      const method = initialData ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      console.error('Lỗi khi lưu khóa học:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold">{initialData ? 'Sửa Khóa Học' : 'Thêm Khóa Học Mới'}</h2>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block font-medium">Tên khóa học</label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={() => handleBlur('title')}
          aria-invalid={touched.title && !!errors.title}
          className="w-full p-2 border rounded"
        />
        {touched.title && errors.title && <p role="alert" className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      {/* Level */}
      <div>
        <label htmlFor="level" className="block font-medium">Trình độ</label>
        <select
          id="level"
          name="level"
          value={formData.level}
          onChange={handleChange}
          onBlur={() => handleBlur('level')}
          aria-invalid={touched.level && !!errors.level}
          className="w-full p-2 border rounded"
        >
          <option value="BEGINNER">BEGINNER</option>
          <option value="INTERMEDIATE">INTERMEDIATE</option>
          <option value="ADVANCED">ADVANCED</option>
        </select>
        {touched.level && errors.level && <p role="alert" className="text-red-500 text-sm">{errors.level}</p>}
      </div>

      {/* Duration & Price (2 Cột) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="duration" className="block font-medium">Thời lượng (Giờ)</label>
          <input
            id="duration"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            onBlur={() => handleBlur('duration')}
            aria-invalid={touched.duration && !!errors.duration}
            className="w-full p-2 border rounded"
          />
          {touched.duration && errors.duration && <p role="alert" className="text-red-500 text-sm">{errors.duration}</p>}
        </div>

        <div>
          <label htmlFor="price" className="block font-medium">Giá tiền ($)</label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            onBlur={() => handleBlur('price')}
            aria-invalid={touched.price && !!errors.price}
            className="w-full p-2 border rounded"
          />
          {touched.price && errors.price && <p role="alert" className="text-red-500 text-sm">{errors.price}</p>}
        </div>
      </div>

      {/* Instructor Select */}
      <div>
        <label htmlFor="instructorId" className="block font-medium">Giảng viên</label>
        <select
          id="instructorId"
          name="instructorId"
          value={formData.instructorId}
          onChange={handleChange}
          onBlur={() => handleBlur('instructorId')}
          aria-invalid={touched.instructorId && !!errors.instructorId}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Chọn Giảng Viên --</option>
          {instructors.map((ins) => (
            <option key={ins.id} value={ins.id}>{ins.name}</option>
          ))}
        </select>
        {touched.instructorId && errors.instructorId && <p role="alert" className="text-red-500 text-sm">{errors.instructorId}</p>}
      </div>

      {/* Seats */}
      <div>
        <label htmlFor="seats" className="block font-medium">Số chỗ ngồi</label>
        <input
          id="seats"
          name="seats"
          type="number"
          value={formData.seats}
          onChange={handleChange}
          onBlur={() => handleBlur('seats')}
          aria-invalid={touched.seats && !!errors.seats}
          className="w-full p-2 border rounded"
        />
        {touched.seats && errors.seats && <p role="alert" className="text-red-500 text-sm">{errors.seats}</p>}
      </div>

      {/* Summary */}
      <div>
        <label htmlFor="summary" className="block font-medium">Tóm tắt mô tả</label>
        <textarea
          id="summary"
          name="summary"
          rows="3"
          value={formData.summary}
          onChange={handleChange}
          onBlur={() => handleBlur('summary')}
          aria-invalid={touched.summary && !!errors.summary}
          className="w-full p-2 border rounded"
        />
        {touched.summary && errors.summary && <p role="alert" className="text-red-500 text-sm">{errors.summary}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400 font-medium"
      >
        {isSubmitting ? 'Đang lưu...' : (initialData ? 'Cập Nhật Khóa Học' : 'Thêm Khóa Học')}
      </button>
    </form>
  );
};