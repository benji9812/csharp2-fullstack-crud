using Application.DTOs.Product;
using Application.Interfaces;
using Domain.Entities;

namespace Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;

    public ProductService(IProductRepository productRepository, ICategoryRepository categoryRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<IReadOnlyList<ProductDto>> GetAllProductsAsync(int? categoryId = null)
    {
        IReadOnlyList<Product> products;
        if (categoryId.HasValue)
        {
            products = await _productRepository.GetProductsByCategoryIdAsync(categoryId.Value);
        }
        else
        {
            products = await _productRepository.GetProductsWithCategoryAsync();
        }

        return products.Select(p => MapToDto(p)).ToList();
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _productRepository.GetProductWithCategoryAsync(id);
        if (product == null) return null;

        return MapToDto(product);
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto createDto)
    {
        var categoryExists = await _categoryRepository.ExistsAsync(createDto.CategoryId);
        if (!categoryExists)
        {
            throw new ArgumentException($"Category with Id {createDto.CategoryId} does not exist.");
        }

        var product = new Product
        {
            Name = createDto.Name,
            Description = createDto.Description,
            Price = createDto.Price,
            StockQuantity = createDto.StockQuantity,
            CategoryId = createDto.CategoryId,
            CreatedAt = DateTime.UtcNow
        };

        var createdProduct = await _productRepository.AddAsync(product);
        var productWithCategory = await _productRepository.GetProductWithCategoryAsync(createdProduct.Id);

        return MapToDto(productWithCategory ?? createdProduct);
    }

    public async Task<bool> UpdateProductAsync(int id, UpdateProductDto updateDto)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) return false;

        var categoryExists = await _categoryRepository.ExistsAsync(updateDto.CategoryId);
        if (!categoryExists)
        {
            throw new ArgumentException($"Category with Id {updateDto.CategoryId} does not exist.");
        }

        product.Name = updateDto.Name;
        product.Description = updateDto.Description;
        product.Price = updateDto.Price;
        product.StockQuantity = updateDto.StockQuantity;
        product.CategoryId = updateDto.CategoryId;

        await _productRepository.UpdateAsync(product);
        return true;
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) return false;

        await _productRepository.DeleteAsync(product);
        return true;
    }

    private static ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            CategoryId = product.CategoryId,
            CategoryName = product.Category?.Name,
            CreatedAt = product.CreatedAt
        };
    }
}
