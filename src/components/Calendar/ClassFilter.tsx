import React from 'react';
import { ClassInfo } from '../../types/database';

interface ClassFilterProps {
  classes: ClassInfo[];
  selectedFilter: string; // 'all' or class.id
  onSelectFilter: (filterId: string) => void;
}

export const ClassFilter: React.FC<ClassFilterProps> = ({
  classes,
  selectedFilter,
  onSelectFilter,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
      <button
        type="button"
        onClick={() => onSelectFilter('all')}
        className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all ${
          selectedFilter === 'all'
            ? 'bg-slate-900 text-white shadow-xs'
            : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
        }`}
      >
        전체
      </button>

      {classes.map((cls) => (
        <button
          key={cls.id}
          type="button"
          onClick={() => onSelectFilter(cls.id)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all ${
            selectedFilter === cls.id
              ? 'bg-ocean-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          {cls.name}
        </button>
      ))}
    </div>
  );
};

