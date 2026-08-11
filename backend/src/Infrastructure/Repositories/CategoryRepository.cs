using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
{
    public CategoryRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IReadOnlyList<Category>> GetCategoriesWithProductsAsync()
    {
        return await _dbSet.AsNoTracking()
            .Include(c => c.Products)
            .ToListAsync();
    }

    public async Task<Category?> GetCategoryWithProductsAsync(int id)
    {
        return await _dbSet.AsNoTracking()
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);
    }
}
