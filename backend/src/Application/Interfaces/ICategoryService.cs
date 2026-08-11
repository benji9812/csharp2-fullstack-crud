using Application.DTOs.Category;

namespace Application.Interfaces;

public interface ICategoryService
{
    Task<IReadOnlyList<CategoryDto>> GetAllCategoriesAsync();
    Task<CategoryDto?> GetCategoryByIdAsync(int id);
    Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createDto);
    Task<bool> UpdateCategoryAsync(int id, UpdateCategoryDto updateDto);
    Task<bool> DeleteCategoryAsync(int id);
}
