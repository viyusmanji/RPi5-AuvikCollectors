import React, {useState, useEffect, useCallback} from 'react';
import styles from './styles.module.css';

export interface ChecklistItemData {
  id: string;
  label: string;
}

export interface ChecklistProps {
  id: string;
  title: string;
  items: ChecklistItemData[];
  resetable?: boolean;
}

function getStorageKey(checklistId: string): string {
  return `checklist-${checklistId}`;
}

function loadCheckedItems(checklistId: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem(getStorageKey(checklistId));
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch {
    // Ignore localStorage errors
  }
  return new Set();
}

function saveCheckedItems(checklistId: string, checkedItems: Set<string>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(checklistId), JSON.stringify([...checkedItems]));
  } catch {
    // Ignore localStorage errors
  }
}

export default function Checklist({
  id,
  title,
  items,
  resetable = true,
}: ChecklistProps): React.ReactElement {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setCheckedItems(loadCheckedItems(id));
    setIsLoaded(true);
  }, [id]);

  // Save to localStorage when checked items change
  useEffect(() => {
    if (isLoaded) {
      saveCheckedItems(id, checkedItems);
    }
  }, [id, checkedItems, isLoaded]);

  const toggleItem = useCallback((itemId: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setCheckedItems(new Set());
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, itemId: string) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleItem(itemId);
      }
    },
    [toggleItem]
  );

  const completedCount = checkedItems.size;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isComplete = completedCount === totalCount && totalCount > 0;

  return (
    <div className={styles.checklist}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.headerRight}>
          <span className={`${styles.progress} ${isComplete ? styles.complete : ''}`}>
            {completedCount}/{totalCount}
          </span>
          {resetable && completedCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className={styles.resetButton}
              aria-label="Reset checklist"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className={styles.progressBar}>
        <div
          className={`${styles.progressFill} ${isComplete ? styles.complete : ''}`}
          style={{width: `${progressPercent}%`}}
        />
      </div>

      <ul className={styles.items} role="list">
        {items.map((item) => {
          const isChecked = checkedItems.has(item.id);
          return (
            <li
              key={item.id}
              className={`${styles.item} ${isChecked ? styles.checked : ''}`}
              onClick={() => toggleItem(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              role="checkbox"
              aria-checked={isChecked}
              tabIndex={0}
            >
              <span className={styles.checkbox}>
                {isChecked && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className={styles.checkIcon}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              <span className={styles.label}>{item.label}</span>
            </li>
          );
        })}
      </ul>

      {isComplete && (
        <div className={styles.completeMessage}>
          All items complete!
        </div>
      )}
    </div>
  );
}
