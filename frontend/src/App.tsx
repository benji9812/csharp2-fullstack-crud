import { useState, useEffect, useCallback } from 'react';
import { apiService } from './api/apiService';
import type { Product, Category, CreateProduct, CreateCategory } from './types/api';
import { Navbar } from './components/Navbar';
import { ProductList } from './components/ProductList';
import { CategoryList } from './components/CategoryList';
import { ProductModal } from './components/ProductModal';
import { CategoryModal } from './components/CategoryModal';
import { ConfirmModal } from './components/ConfirmModal';
import { ErrorBanner } from './components/ErrorBanner';

export function App() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const [itemToDelete, setItemToDelete] = useState<{ type: 'product' | 'category'; id: number; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Kunde inte ansluta till Web API:t. Kontrollera att backend körs på localhost.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Product Actions
  const handleSaveProduct = async (productData: CreateProduct, id?: number) => {
    if (id) {
      await apiService.updateProduct(id, productData);
    } else {
      await apiService.createProduct(productData);
    }
    await fetchData();
  };

  // Category Actions
  const handleSaveCategory = async (categoryData: CreateCategory, id?: number) => {
    if (id) {
      await apiService.updateCategory(id, categoryData);
    } else {
      await apiService.createCategory(categoryData);
    }
    await fetchData();
  };

  // Confirm Delete Action
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setDeleteLoading(true);
      if (itemToDelete.type === 'product') {
        await apiService.deleteProduct(itemToDelete.id);
      } else {
        await apiService.deleteCategory(itemToDelete.id);
      }
      setItemToDelete(null);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod vid borttagning.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => {
          if (activeTab === 'products') {
            setProductToEdit(null);
            setIsProductModalOpen(true);
          } else {
            setCategoryToEdit(null);
            setIsCategoryModalOpen(true);
          }
        }}
        productCount={products.length}
        categoryCount={categories.length}
      />

      {error && (
        <ErrorBanner
          message={error}
          onRetry={fetchData}
          onDismiss={() => setError(null)}
        />
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <p>Hämtar data från servern...</p>
        </div>
      ) : activeTab === 'products' ? (
        <ProductList
          products={products}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          onEditProduct={(prod) => {
            setProductToEdit(prod);
            setIsProductModalOpen(true);
          }}
          onDeleteProduct={(prod) => {
            setItemToDelete({ type: 'product', id: prod.id, name: prod.name });
          }}
        />
      ) : (
        <CategoryList
          categories={categories}
          onEditCategory={(cat) => {
            setCategoryToEdit(cat);
            setIsCategoryModalOpen(true);
          }}
          onDeleteCategory={(cat) => {
            setItemToDelete({ type: 'category', id: cat.id, name: cat.name });
          }}
        />
      )}

      {/* Product Create/Edit Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        categories={categories}
      />

      {/* Category Create/Edit Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        categoryToEdit={categoryToEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        title={`Ta bort ${itemToDelete?.type === 'product' ? 'Produkt' : 'Kategori'}`}
        message={`Är du säker på att du vill ta bort "${itemToDelete?.name}"? Detta går inte att ångra.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
        loading={deleteLoading}
      />
    </div>
  );
}

export default App;
