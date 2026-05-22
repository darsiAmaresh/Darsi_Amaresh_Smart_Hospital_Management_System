import { Search, X } from 'lucide-react';

export function SearchBar({ value, onChange, placeholder = 'Search...', filters }) {
  return (
    <div className="search-bar">
      <Search size={18} className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')} aria-label="Clear">
          <X size={16} />
        </button>
      )}
      {filters}
    </div>
  );
}
