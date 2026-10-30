type FeedbackToastProps = {
  type: 'success' | 'error'
  message: string
}

function FeedbackToast({ type, message }: FeedbackToastProps) {
  return (
    <div className={`feedback-toast feedback-toast-${type}`} role={type === 'error' ? 'alert' : 'status'} aria-live="polite">
      <span className="feedback-toast-mark" aria-hidden="true">{type === 'success' ? '✓' : '!'}</span>
      <span>{message}</span>
    </div>
  )
}

export default FeedbackToast
