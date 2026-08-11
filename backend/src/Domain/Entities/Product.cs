namespace Domain.Entities;

public class Product : BaseEntity
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }

    // Foreign key and navigation property
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
}
