using Domain.Entities;

namespace Application.Interfaces;

public interface ICategoryRepository : IGenericRepository<Category>
{
    Task<IReadOnlyList<Category>> GetCategoriesWithProductsAsync();
    Task<Category?> GetCategoryWithProductsAsync(int id);
}
