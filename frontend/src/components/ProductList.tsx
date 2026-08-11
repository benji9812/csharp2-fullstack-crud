import React, { useState } from 'react';
import type { Product, Category } from '../types/api';
import { Edit2, Trash2, Search, Filter, Box } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  categories,
  selectedCategoryId,
  onSelectCategory,
  onEditProduct,
  onDeleteProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategoryId === null || p.categoryId === selectedCategoryId;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div className="toolbar">
        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Sök produkt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filters */}
        <div className="filter-group">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Filter size={14} /> Kategori:
          </span>
          <button
            className={`filter-chip ${selectedCategoryId === null ? 'active' : ''}`}
            onClick={() => onSelectCategory(null)}
          >
            Alla ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                className={`filter-chip ${selectedCategoryId === cat.id ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.id)}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <Box size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3>Inga produkter hittades</h3>
          <p>Testa att ändra sökord eller välj en annan kategori.</p>
        </div>
      ) : (
        <div className="grid-container">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card">
              <div>
                <div className="card-header">
                  <h3 className="card-title">{product.name}</h3>
                  <span className="badge badge-indigo">
                    {product.categoryName || 'Okänd Kategori'}
                  </span>
                </div>

                <p className="card-desc">
                  {product.description || 'Ingen beskrivning angiven.'}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="price-tag">
                    {product.price.toLocaleString('sv-SE', { style: 'currency', currency: 'SEK' })}
                  </span>
                  
                  {product.stockQuantity > 10 ? (
                    <span className="badge badge-success">Lager: {product.stockQuantity}</span>
                  ) : product.stockQuantity > 0 ? (
                    <span className="badge badge-warning">Lågt lager ({product.stockQuantity})</span>
                  ) : (
                    <span className="badge badge-danger">Slut i lager</span>
                  )}
                </div>

                <div className="card-footer">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Skapad {new Date(product.createdAt).toLocaleDateString('sv-SE')}
                  </span>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-sm btn-secondary btn-icon"
                      title="Redigera"
                      onClick={() => onEditProduct(product)}
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      className="btn btn-sm btn-danger btn-icon"
                      title="Ta bort"
                      onClick={() => onDeleteProduct(product)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
