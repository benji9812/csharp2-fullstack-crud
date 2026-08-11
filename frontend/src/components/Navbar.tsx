import React from 'react';
import { Package, Layers, Plus } from 'lucide-react';

interface NavbarProps {
  activeTab: 'products' | 'categories';
  setActiveTab: (tab: 'products' | 'categories') => void;
  onOpenCreateModal: () => void;
  productCount: number;
  categoryCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateModal,
  productCount,
  categoryCount,
}) => {
  return (
    <header className="navbar">
      <div className="brand">
        <Package size={28} />
        <span>ProductHub Catalog</span>
      </div>

      <nav className="nav-links">
        <button
          className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={18} />
          Produkter ({productCount})
        </button>

        <button
          className={`nav-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <Layers size={18} />
          Kategorier ({categoryCount})
        </button>
      </nav>

      <button className="btn btn-primary" onClick={onOpenCreateModal}>
        <Plus size={18} />
        {activeTab === 'products' ? 'Ny Produkt' : 'Ny Kategori'}
      </button>
    </header>
  );
};
