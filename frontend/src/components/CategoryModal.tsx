import React, { useState, useEffect } from 'react';
import type { Category, CreateCategory } from '../types/api';
import { X } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: CreateCategory, id?: number) => Promise<void>;
  categoryToEdit?: Category | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categoryToEdit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setDescription(categoryToEdit.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setError(null);
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Kategorinamn är obligatoriskt.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSave(
        {
          name: name.trim(),
          description: description.trim() || undefined,
        },
        categoryToEdit?.id
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte spara kategorin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{categoryToEdit ? 'Redigera Kategori' : 'Skapa Ny Kategori'}</h2>
          <button className="btn btn-sm btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Kategorinamn *</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="t.ex. Elektronik"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Beskrivning</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kort beskrivning av kategorin..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Avbryt
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sparar...' : categoryToEdit ? 'Spara Ändringar' : 'Skapa Kategori'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
