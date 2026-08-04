import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Cập nhật state để lần render tiếp theo hiển thị UI thay thế
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Báo cáo lỗi (trong môi trường thực tế sẽ gửi tới Sentry / LogRocket)
    // Đã loại bỏ console.log để đảm bảo sạch code
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          role="alert" 
          style={{
            maxWidth: '600px',
            margin: '80px auto',
            padding: '32px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            border: '1px solid #fca5a5',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h1 style={{ fontSize: '24px', color: '#991b1b', marginBottom: '12px' }}>
            Đã xảy ra lỗi hệ thống bất ngờ!
          </h1>
          <p style={{ color: '#4b5563', marginBottom: '24px', lineHeight: '1.5' }}>
            Ứng dụng gặp sự cố trong quá trình xử lý dữ liệu. Bạn có thể thử khôi phục lại trang hoặc quay về trang chủ.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Tải lại trang
            </button>
            <button
              onClick={this.handleReset}
              style={{
                padding: '10px 20px',
                backgroundColor: '#e2e8f0',
                color: '#1e293b',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Về trang chủ
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}