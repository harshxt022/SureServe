import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error('ErrorBoundary caught an error', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-red-50 text-red-600 w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm">
                        <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <h1 className="text-4xl font-bold font-heading text-[#1A1A1A] mb-4">Oops! Something went wrong.</h1>
                    <p className="text-[#6B6B6B] max-w-md mb-8">
                        We're sorry, but an unexpected error occurred. Our team has been notified and is working on a fix.
                    </p>
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="bg-[#1A1A1A] text-white px-8 py-3 rounded-full font-bold hover:bg-[#333] transition-colors shadow-md"
                    >
                        Go back home
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-10 text-left bg-gray-100 p-6 rounded-2xl w-full max-w-4xl overflow-auto text-sm border border-gray-200">
                            <p className="font-bold text-red-600 mb-2">{this.state.error?.toString()}</p>
                            <pre className="text-gray-700 whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
