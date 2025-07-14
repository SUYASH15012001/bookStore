import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to a service or console
    console.error('React ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can customize this UI
      return (
        <div style={{ padding: 32, textAlign: 'center', color: '#374151' }}>
          <h2>Something went wrong.</h2>
          <p>Please refresh the page or try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 