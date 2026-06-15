import './SourceBadge.css';

export function SourceBadge({ date = "August 2023" }) {
  return (
    <div className="source-badge">
      Source: CSAS · Updated {date}
    </div>
  );
}
