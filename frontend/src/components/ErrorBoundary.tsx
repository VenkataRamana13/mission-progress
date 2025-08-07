import React, { ErrorInfo } from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

/**
 * Simple React error boundary to capture runtime errors and display a fallback UI.
 * This prevents the entire React tree from unmounting when an error occurs.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error('ErrorBoundary caught an error', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Something went wrong.</h1>
          <p className="text-sm text-gray-400">Please refresh the page or contact support.</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary