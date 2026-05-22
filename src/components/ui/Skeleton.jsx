export function Skeleton({ width, height, className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width: width || '100%', height: height || '1rem' }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <Skeleton height="2rem" width="40%" />
      <Skeleton height="3rem" />
      <Skeleton height="1rem" width="60%" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="skeleton-table">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row">
          <Skeleton height="2.5rem" />
        </div>
      ))}
    </div>
  );
}
