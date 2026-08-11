using Application.DTOs.Category;
using Application.Interfaces;
using Application.Services;
using Domain.Entities;
using NSubstitute;
using Xunit;

namespace backend.Tests.Services;

public class CategoryServiceTests
{
    private readonly ICategoryRepository _categoryRepositoryMock;
    private readonly CategoryService _sut;

    public CategoryServiceTests()
    {
        _categoryRepositoryMock = Substitute.For<ICategoryRepository>();
        _sut = new CategoryService(_categoryRepositoryMock);
    }

    [Fact]
    public async Task GetAllCategoriesAsync_ShouldReturnCategoryDtosWithProductCount()
    {
        // Arrange
        var categories = new List<Category>
        {
            new Category
            {
                Id = 1,
                Name = "Elektronik",
                Description = "Prylar",
                Products = new List<Product>
                {
                    new Product { Id = 1, Name = "TV" },
                    new Product { Id = 2, Name = "Radio" }
                }
            }
        };

        _categoryRepositoryMock.GetCategoriesWithProductsAsync().Returns(categories);

        // Act
        var result = await _sut.GetAllCategoriesAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Single(result);
        Assert.Equal("Elektronik", result[0].Name);
        Assert.Equal(2, result[0].ProductCount);
    }

    [Fact]
    public async Task CreateCategoryAsync_ShouldAddCategoryAndReturnDto()
    {
        // Arrange
        var createDto = new CreateCategoryDto { Name = "Sport", Description = "Träningsutrustning" };
        var createdCategory = new Category { Id = 10, Name = "Sport", Description = "Träningsutrustning", CreatedAt = DateTime.UtcNow };

        _categoryRepositoryMock.AddAsync(Arg.Any<Category>()).Returns(createdCategory);

        // Act
        var result = await _sut.CreateCategoryAsync(createDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(10, result.Id);
        Assert.Equal("Sport", result.Name);
        await _categoryRepositoryMock.Received(1).AddAsync(Arg.Any<Category>());
    }
}
