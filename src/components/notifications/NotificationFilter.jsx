import React from 'react';
import { Search, X } from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../../data/notificationData';

export default function NotificationFilter({ search, setSearch, category, setCategory, priority, setPriority }) {
  return (
    <div className="nc-filter-bar">
      <div className="nc-search-wrap">
        <Search size={14} className="nc-search-icon" />
        <input
          className="nc-search-input"
          placeholder="Search notifications…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="nc-search-clear" onClick={() => setSearch('')}><X size={13} /></button>
        )}
      </div>

      <div className="nc-cat-tabs">
        {CATEGORIES.map(c => (
          <button key={c} className={`nc-cat-tab${category === c ? ' active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      <select className="nc-priority-select" value={priority} onChange={e => setPriority(e.target.value)}>
        {PRIORITIES.map(p => <option key={p}>{p}</option>)}
      </select>
    </div>
  );
}
