import { useState, useEffect } from 'react'
import { checklistData } from './data'
import './index.css'

function App() {
  const [completedItems, setCompletedItems] = useState(() => {
    const saved = localStorage.getItem('completion-checklist-v1');
    return saved ? JSON.parse(saved) : [];
  });

  const [expandedItems, setExpandedItems] = useState([]);

  useEffect(() => {
    localStorage.setItem('completion-checklist-v1', JSON.stringify(completedItems));
  }, [completedItems]);

  const toggleItem = (id) => {
    setCompletedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleExpand = (e, id) => {
    e.stopPropagation();
    setExpandedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const saveProgress = () => {
    const dataStr = JSON.stringify(completedItems, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `checklist-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportReport = () => {
    const totalItems = checklistData.reduce((acc, cat) => acc + cat.items.length, 0);
    const completedCount = completedItems.length;
    const progress = Math.round((completedCount / totalItems) * 100);

    let report = "COMPLETION CHECKLIST REPORT\n";
    report += "===========================\n";
    report += `Date: ${new Date().toLocaleDateString()}\n`;
    report += `Progress: ${progress}% (${completedCount}/${totalItems})\n\n`;

    checklistData.forEach(category => {
      report += `${category.category.toUpperCase()}\n`;
      report += "-".repeat(category.category.length) + "\n";

      category.items.forEach(item => {
        const isDone = completedItems.includes(item.id);
        const status = isDone ? "[x]" : "[ ]";
        report += `${status} ${item.text}\n`;
      });
      report += "\n";
    });

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `checklist-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalItems = checklistData.reduce((acc, cat) => acc + cat.items.length, 0);
  const completedCount = completedItems.length;
  const progress = Math.round((completedCount / totalItems) * 100);

  return (
    <div className="app-container">
      <div className="progress-container">
        <div className="progress-text">
          <span>Completion Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <header>
        <h1>25 Ways to Complete Before Moving Forward</h1>
        <p style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }}>
          Clean Up Your Messes (Incompletions)
        </p>
        <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '2rem', fontStyle: 'italic' }}>
          Inspired by Jack Canfield's <em>The Success Principles</em>
        </p>

        <div className="controls">
          <button onClick={saveProgress} className="btn-secondary">
            💾 Save Backup
          </button>
          <button onClick={exportReport} className="btn-primary">
            📄 Export Report
          </button>
        </div>
      </header>

      <main>
        {checklistData.map((category) => (
          <div key={category.category} className="category-section">
            <h2>{category.category}</h2>
            <div className="items-grid">
              {category.items.map((item) => {
                const isCompleted = completedItems.includes(item.id);
                const isExpanded = expandedItems.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`card ${isCompleted ? 'completed' : ''}`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="card-header">
                      <div className="checkbox-container">
                        <span className="checkmark">✓</span>
                      </div>
                      <span className="item-text">{item.text}</span>
                      <button
                        className="info-btn"
                        onClick={(e) => toggleExpand(e, item.id)}
                        title="Why this matters"
                      >
                        {isExpanded ? '−' : 'ℹ'}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="subtext">
                        <strong>Coach's Tip:</strong> {item.subtext}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </main>

      {progress === 100 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--success-color)',
          color: 'var(--bg-color)',
          padding: '1rem 2rem',
          borderRadius: '50px',
          fontWeight: 'bold',
          boxShadow: '0 10px 25px rgba(102, 252, 241, 0.5)',
          animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          zIndex: 1000,
          textAlign: 'center',
          width: '90%',
          maxWidth: '400px'
        }}>
          🎉 All Tasks Completed! You are ready to move forward.
        </div>
      )}

      <style>{`
        @keyframes popIn {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default App
