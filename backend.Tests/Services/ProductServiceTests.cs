using Application.DTOs.Product;
using Application.Interfaces;
using Application.Services;
using Domain.Entities;
using NSubstitute;
using Xunit;

namespace backend.Tests.Services;

public class ProductServiceTests
{
    private readonly IProductRepository _productRepositoryMock;
    private readonly ICategoryRepository _categoryRepositoryMock;
    private readonly ProductService _sut; // System Under Test

    public ProductServiceTests()
    {
        _productRepositoryMock = Substitute.For<IProductRepository>();
        _categoryRepositoryMock = Substitute.For<ICategoryRepository>();
        _sut = new ProductService(_productRepositoryMock, _categoryRepositoryMock);
    }

    [Fact]
    public async Task GetAllProductsAsync_ShouldReturnAllProductDtos()
    {
        // Arrange
        var products = new List<Product>
        {
            new Product
            {
                Id = 1,
                Name = "Laptop",
                Price = 15000,
                StockQuantity = 5,
                CategoryId = 1,
                Category = new Category { Id = 1, Name = "Elektronik" },
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Id = 2,
                Name = "Mus",
                Price = 500,
                StockQuantity = 20,
                CategoryId = 1,
                Category = new Category { Id = 1, Name = "Elektronik" },
                CreatedAt = DateTime.UtcNow
            }
        };

        _productRepositoryMock.GetProductsWithCategoryAsync().Returns(products);

        // Act
        var result = await _sut.GetAllProductsAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count);
        Assert.Equal("Laptop", result[0].Name);
        Assert.Equal("Elektronik", result[0].CategoryName);
    }

    [Fact]
    public async Task GetProductByIdAsync_WhenProductExists_ShouldReturnProductDto()
    {
        // Arrange
        var product = new Product
        {
            Id = 10,
            Name = "Bok C#",
            Price = 399,
            StockQuantity = 12,
            CategoryId = 2,
            Category = new Category { Id = 2, Name = "Böcker" }
        };

        _productRepositoryMock.GetProductWithCategoryAsync(10).Returns(product);

        // Act
        var result = await _sut.GetProductByIdAsync(10);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(10, result.Id);
        Assert.Equal("Bok C#", result.Name);
        Assert.Equal("Böcker", result.CategoryName);
    }

    [Fact]
    public async Task GetProductByIdAsync_WhenProductDoesNotExist_ShouldReturnNull()
    {
        // Arrange
        _productRepositoryMock.GetProductWithCategoryAsync(99).Returns((Product?)null);

        // Act
        var result = await _sut.GetProductByIdAsync(99);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task CreateProductAsync_WhenCategoryDoesNotExist_ShouldThrowArgumentException()
    {
        // Arrange
        var createDto = new CreateProductDto
        {
            Name = "Ny Pryl",
            Price = 100,
            StockQuantity = 1,
            CategoryId = 999
        };

        _categoryRepositoryMock.ExistsAsync(999).Returns(false);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _sut.CreateProductAsync(createDto));
    }

    [Fact]
    public async Task CreateProductAsync_WhenValid_ShouldAddProductAndReturnDto()
    {
        // Arrange
        var createDto = new CreateProductDto
        {
            Name = "Skärm 27 tum",
            Description = "4K Skärm",
            Price = 4500,
            StockQuantity = 8,
            CategoryId = 1
        };

        _categoryRepositoryMock.ExistsAsync(1).Returns(true);

        var createdProduct = new Product
        {
            Id = 5,
            Name = createDto.Name,
            Description = createDto.Description,
            Price = createDto.Price,
            StockQuantity = createDto.StockQuantity,
            CategoryId = createDto.CategoryId,
            CreatedAt = DateTime.UtcNow
        };

        _productRepositoryMock.AddAsync(Arg.Any<Product>()).Returns(createdProduct);
        _productRepositoryMock.GetProductWithCategoryAsync(5).Returns(new Product
        {
            Id = 5,
            Name = createDto.Name,
            Description = createDto.Description,
            Price = createDto.Price,
            StockQuantity = createDto.StockQuantity,
            CategoryId = createDto.CategoryId,
            Category = new Category { Id = 1, Name = "Elektronik" },
            CreatedAt = DateTime.UtcNow
        });

        // Act
        var result = await _sut.CreateProductAsync(createDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(5, result.Id);
        Assert.Equal("Skärm 27 tum", result.Name);
        Assert.Equal("Elektronik", result.CategoryName);
        await _productRepositoryMock.Received(1).AddAsync(Arg.Any<Product>());
    }

    [Fact]
    public async Task DeleteProductAsync_WhenProductExists_ShouldDeleteAndReturnTrue()
    {
        // Arrange
        var existingProduct = new Product { Id = 3, Name = "Gammal Produkt" };
        _productRepositoryMock.GetByIdAsync(3).Returns(existingProduct);

        // Act
        var result = await _sut.DeleteProductAsync(3);

        // Assert
        Assert.True(result);
        await _productRepositoryMock.Received(1).DeleteAsync(existingProduct);
    }
}
