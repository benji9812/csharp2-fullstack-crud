import React from 'react';
import type { Category } from '../types/api';
import { Edit2, Trash2, Layers } from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onEditCategory,
  onDeleteCategory,
}) => {
  if (categories.length === 0) {
    return (
      <div className="empty-state">
        <Layers size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <h3>Inga kategorier finns ännu</h3>
        <p>Klicka på "Ny Kategori" ovan för att skapa den första kategorin.</p>
      </div>
    );
  }

  return (
    <div className="grid-container">
      {categories.map((category) => (
        <div key={category.id} className="card">
          <div>
            <div className="card-header">
              <h3 className="card-title">{category.name}</h3>
              <span className="badge badge-indigo">
                {category.productCount} {category.productCount === 1 ? 'produkt' : 'produkter'}
              </span>
            </div>

            <p className="card-desc">
              {category.description || 'Ingen beskrivning angiven.'}
            </p>
          </div>

          <div className="card-footer">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Skapad {new Date(category.createdAt).toLocaleDateString('sv-SE')}
            </span>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-sm btn-secondary btn-icon"
                title="Redigera"
                onClick={() => onEditCategory(category)}
              >
                <Edit2 size={15} />
              </button>
              <button
                className="btn btn-sm btn-danger btn-icon"
                title="Ta bort"
                onClick={() => onDeleteCategory(category)}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
