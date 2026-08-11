namespace Domain.Entities;

public class Category : BaseEntity
{
    public required string Name { get; set; }
    public string? Description { get; set; }

    // Navigation property - 1 to Many relationship with Product
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
