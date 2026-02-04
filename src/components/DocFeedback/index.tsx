import React, {useState} from 'react';
import styles from './styles.module.css';

export interface DocFeedbackProps {
  question?: string;
  thankYouMessage?: string;
}

type FeedbackType = 'positive' | 'negative' | null;

export default function DocFeedback({
  question = 'Was this page helpful?',
  thankYouMessage = 'Thank you for your feedback!',
}: DocFeedbackProps): React.ReactElement {
  const [feedback, setFeedback] = useState<FeedbackType>(null);

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type);
  };

  if (feedback) {
    return (
      <div className={styles.feedbackContainer} role="status" aria-live="polite">
        <p className={styles.thankYouMessage}>{thankYouMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.feedbackContainer}>
      <p className={styles.question}>{question}</p>
      <div className={styles.buttonGroup} role="group" aria-label="Page feedback">
        <button
          type="button"
          onClick={() => handleFeedback('positive')}
          className={styles.feedbackButton}
          aria-label="Yes, this page was helpful"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.icon}
          >
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
          <span className={styles.buttonLabel}>Yes</span>
        </button>

        <button
          type="button"
          onClick={() => handleFeedback('negative')}
          className={styles.feedbackButton}
          aria-label="No, this page was not helpful"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.icon}
          >
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
          </svg>
          <span className={styles.buttonLabel}>No</span>
        </button>
      </div>
    </div>
  );
}
