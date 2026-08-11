import React, { useState, useEffect } from 'react';
import type { Product, Category, CreateProduct } from '../types/api';
import { X } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: CreateProduct, id?: number) => Promise<void>;
  productToEdit?: Product | null;
  categories: Category[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  categories,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [stockQuantity, setStockQuantity] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setDescription(productToEdit.description || '');
      setPrice(productToEdit.price);
      setStockQuantity(productToEdit.stockQuantity);
      setCategoryId(productToEdit.categoryId);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setStockQuantity(0);
      setCategoryId(categories.length > 0 ? categories[0].id : '');
    }
    setError(null);
  }, [productToEdit, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Produktnamn är obligatoriskt.');
      return;
    }
    if (price === '' || Number(price) <= 0) {
      setError('Ange ett giltigt pris (större än 0).');
      return;
    }
    if (stockQuantity === '' || Number(stockQuantity) < 0) {
      setError('Lagersaldo kan inte vara negativt.');
      return;
    }
    if (!categoryId) {
      setError('Vänligen välj en kategori.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSave(
        {
          name: name.trim(),
          description: description.trim() || undefined,
          price: Number(price),
          stockQuantity: Number(stockQuantity),
          categoryId: Number(categoryId),
        },
        productToEdit?.id
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte spara produkten.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{productToEdit ? 'Redigera Produkt' : 'Skapa Ny Produkt'}</h2>
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
              <label className="form-label">Produktnamn *</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="t.ex. Trådlösa Hörlurar"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kategori *</label>
              <select
                className="form-select"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
              >
                <option value="" disabled>Välj kategori...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Pris (SEK) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lagersaldo *</label>
                <input
                  type="number"
                  className="form-input"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Beskrivning</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Valfri detaljerad beskrivning..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Avbryt
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sparar...' : productToEdit ? 'Spara Ändringar' : 'Skapa Produkt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
