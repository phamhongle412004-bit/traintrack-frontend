import React from 'react';

export function AsyncDataWrapper({ loading, error, isEmpty, onRetry, emptyMessage, children }) {
  // 1. Trạng thái Loading
  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        <div className="spinner" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⏳</div>
        <p>Đang tải dữ liệu từ máy chủ...</p>
      </div>
    );
  }

  // 2. Trạng thái Error
  if (error) {
    return (
      <div style={{ padding: '24px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#991b1b', margin: '16px 0' }}>
        <h4 style={{ margin: '0 0 8px 0' }}> Đã xảy ra lỗi khi tải dữ liệu</h4>
        <p style={{ margin: '0 0 16px 0' }}>{error}</p>
        {onRetry && (
          <button 
            onClick={onRetry} 
            style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
          >
             Thử lại
          </button>
        )}
      </div>
    );
  }

  // 3. Trạng thái Empty
  if (isEmpty) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', color: '#64748b' }}>
        <p style={{ fontSize: '1.1rem', margin: 0 }}>{emptyMessage || 'Không tìm thấy dữ liệu nào.'}</p>
      </div>
    );
  }

  // 4. Trạng thái Success
  return children;
}