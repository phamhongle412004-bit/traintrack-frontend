import React, { useState, useEffect } from 'react';

export function CourseForm({ initialData = null, instructors = [], onSubmit }) {
  // Pre-fill dữ liệu nếu có initialData (chế độ Sửa/Edit)
  const [formData, setFormData] = useState({
    title: '',
    level: 'BEGINNER',
    duration: '',
    price: '',
    instructorId: '',
    seats: '',
    summary: '',
    enrolledCount: 0, // Dùng để validate seats >= enrolledCount
  });

  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Pre-fill effect khi sửa khóa học
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        level: initialData.level || 'BEGINNER',
        duration: initialData.duration ?? '',
        price: initialData.price ?? '',
        instructorId: initialData.instructorId || initialData.instructor?.id || '',
        seats: initialData.seats ?? '',
        summary: initialData.summary || '',
        enrolledCount: initialData.enrolledCount || 0,
      });
    }
  }, [initialData]);

  // Hàm Validate Rules nghiêm ngặt theo đề bài
  const validate = () => {
    const errs = {};

    // 1. Title (5 - 120 ký tự)
    if (!formData.title.trim()) {
      errs.title = 'Tên khóa học không được để trống';
    } else if (formData.title.trim().length < 5 || formData.title.trim().length > 120) {
      errs.title = 'Tên khóa học phải từ 5 đến 120 ký tự';
    }

    // 2. Level (BEGINNER, INTERMEDIATE, ADVANCED)
    if (!['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(formData.level)) {
      errs.level = 'Cấp độ không hợp lệ';
    }

    // 3. Duration (1 - 500 giờ)
    const durationNum = Number(formData.duration);
    if (!formData.duration && formData.duration !== 0) {
      errs.duration = 'Thời lượng không được để trống';
    } else if (isNaN(durationNum) || durationNum < 1 || durationNum > 500) {
      errs.duration = 'Thời lượng phải từ 1 đến 500 giờ';
    }

    // 4. Price (>= 0, tối đa 2 chữ số thập phân)
    const priceNum = Number(formData.price);
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    if (formData.price === '' || formData.price === null) {
      errs.price = 'Giá không được để trống';
    } else if (isNaN(priceNum) || priceNum < 0) {
      errs.price = 'Giá phải lớn hơn hoặc bằng 0';
    } else if (!priceRegex.test(String(formData.price))) {
      errs.price = 'Giá tối đa 2 chữ số thập phân (VD: 99.99)';
    }

    // 5. Instructor (Chọn từ danh sách)
    if (!formData.instructorId) {
      errs.instructorId = 'Vui lòng chọn giảng viên';
    }

    // 6. Seats (Số nguyên >= 1, không nhỏ hơn số chỗ đã đăng ký)
    const seatsNum = Number(formData.seats);
    if (!formData.seats && formData.seats !== 0) {
      errs.seats = 'Số chỗ không được để trống';
    } else if (!Number.isInteger(seatsNum) || seatsNum < 1) {
      errs.seats = 'Số chỗ phải là số nguyên lớn hơn hoặc bằng 1';
    } else if (seatsNum < formData.enrolledCount) {
      errs.seats = `Số chỗ không được nhỏ hơn số học viên đã đăng ký (${formData.enrolledCount})`;
    }

    // 7. Summary (<= 500 ký tự)
    if (formData.summary && formData.summary.length > 500) {
      errs.summary = 'Mô tả tóm tắt tối đa 500 ký tự';
    }

    return errs;
  };

  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Đánh dấu đã chạm tất cả các trường khi bấm submit
    setTouched({
      title: true,
      level: true,
      duration: true,
      price: true,
      instructorId: true,
      seats: true,
      summary: true,
    });
    setServerError('');

    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        duration: Number(formData.duration),
        price: Number(formData.price),
        seats: Number(formData.seats),
      };
      await onSubmit(payload);
    } catch (err) {
      setServerError(err.message || 'Lỗi khi lưu khóa học!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      noValidate 
      aria-labelledby="course-form-heading"
      style={{ maxWidth: '650px', margin: '0 auto', padding: '24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
    >
      <h2 id="course-form-heading" style={{ marginBottom: '20px' }}>
        {initialData ? '✏️ Cập nhật khóa học' : '➕ Thêm khóa học mới'}
      </h2>

      {serverError && (
        <div role="alert" style={{ padding: '10px', background: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '4px', marginBottom: '16px' }}>
          ⚠️ {serverError}
        </div>
      )}

      {/* 1. Title */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="title" style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>
          Tên khóa học <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={touched.title && !!errors.title}
          aria-describedby={touched.title && errors.title ? 'title-error' : undefined}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: touched.title && errors.title ? '1px solid #dc2626' : '1px solid #cbd5e1' }}
        />
        {touched.title && errors.title && (
          <p id="title-error" role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>{errors.title}</p>
        )}
      </div>

      {/* 2. Level & 3. Duration */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label htmlFor="level" style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>
            Cấp độ <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
          >
            <option value="BEGINNER">Mới bắt đầu (BEGINNER)</option>
            <option value="INTERMEDIATE">Trung cấp (INTERMEDIATE)</option>
            <option value="ADVANCED">Nâng cao (ADVANCED)</option>
          </select>
        </div>

        <div>
          <label htmlFor="duration" style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>
            Thời lượng (giờ) <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            id="duration"
            name="duration"
            type="number"
            min="1"
            max="500"
            value={formData.duration}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.duration && !!errors.duration}
            aria-describedby={touched.duration && errors.duration ? 'duration-error' : undefined}
            disabled={isSubmitting}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: touched.duration && errors.duration ? '1px solid #dc2626' : '1px solid #cbd5e1' }}
          />
          {touched.duration && errors.duration && (
            <p id="duration-error" role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>{errors.duration}</p>
          )}
        </div>
      </div>

      {/* 4. Price & 5. Instructor */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label htmlFor="price" style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>
            Giá tiền ($) <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.price && !!errors.price}
            aria-describedby={touched.price && errors.price ? 'price-error' : undefined}
            disabled={isSubmitting}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: touched.price && errors.price ? '1px solid #dc2626' : '1px solid #cbd5e1' }}
          />
          {touched.price && errors.price && (
            <p id="price-error" role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>{errors.price}</p>
          )}
        </div>

        <div>
          <label htmlFor="instructorId" style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>
            Giảng viên <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <select
            id="instructorId"
            name="instructorId"
            value={formData.instructorId}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.instructorId && !!errors.instructorId}
            aria-describedby={touched.instructorId && errors.instructorId ? 'instructor-error' : undefined}
            disabled={isSubmitting}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: touched.instructorId && errors.instructorId ? '1px solid #dc2626' : '1px solid #cbd5e1' }}
          >
            <option value="">-- Chọn giảng viên --</option>
            {instructors.map((ins) => (
              <option key={ins.id || ins._id} value={ins.id || ins._id}>
                {ins.name}
              </option>
            ))}
          </select>
          {touched.instructorId && errors.instructorId && (
            <p id="instructor-error" role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>{errors.instructorId}</p>
          )}
        </div>
      </div>

      {/* 6. Seats */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="seats" style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>
          Số chỗ khả dụng <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <input
          id="seats"
          name="seats"
          type="number"
          min="1"
          value={formData.seats}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={touched.seats && !!errors.seats}
          aria-describedby={touched.seats && errors.seats ? 'seats-error' : undefined}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: touched.seats && errors.seats ? '1px solid #dc2626' : '1px solid #cbd5e1' }}
        />
        {touched.seats && errors.seats && (
          <p id="seats-error" role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>{errors.seats}</p>
        )}
      </div>

      {/* 7. Summary */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <label htmlFor="summary" style={{ fontWeight: '600' }}>Tóm tắt khóa học</label>
          <span style={{ fontSize: '12px', color: formData.summary.length > 500 ? '#dc2626' : '#64748b' }}>
            {formData.summary.length}/500 ký tự
          </span>
        </div>
        <textarea
          id="summary"
          name="summary"
          rows="4"
          value={formData.summary}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={touched.summary && !!errors.summary}
          aria-describedby={touched.summary && errors.summary ? 'summary-error' : undefined}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: touched.summary && errors.summary ? '1px solid #dc2626' : '1px solid #cbd5e1' }}
        />
        {touched.summary && errors.summary && (
          <p id="summary-error" role="alert" style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>{errors.summary}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '10px',
          background: isSubmitting ? '#94a3b8' : '#16a34a',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
        }}
      >
        {isSubmitting ? '⌛ Đang lưu khóa học...' : initialData ? 'Cập nhật' : 'Thêm mới'}
      </button>
    </form>
  );
}