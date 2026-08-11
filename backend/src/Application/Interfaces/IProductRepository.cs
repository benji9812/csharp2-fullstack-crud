using Domain.Entities;

namespace Application.Interfaces;

public interface IProductRepository : IGenericRepository<Product>
{
    Task<IReadOnlyList<Product>> GetProductsWithCategoryAsync();
    Task<Product?> GetProductWithCategoryAsync(int id);
    Task<IReadOnlyList<Product>> GetProductsByCategoryIdAsync(int categoryId);
}
