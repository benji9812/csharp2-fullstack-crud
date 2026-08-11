using Application.DTOs.Product;

namespace Application.Interfaces;

public interface IProductService
{
    Task<IReadOnlyList<ProductDto>> GetAllProductsAsync(int? categoryId = null);
    Task<ProductDto?> GetProductByIdAsync(int id);
    Task<ProductDto> CreateProductAsync(CreateProductDto createDto);
    Task<bool> UpdateProductAsync(int id, UpdateProductDto updateDto);
    Task<bool> DeleteProductAsync(int id);
}
