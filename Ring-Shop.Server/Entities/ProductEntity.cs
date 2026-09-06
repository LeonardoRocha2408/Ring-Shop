using System.ComponentModel.DataAnnotations.Schema;

namespace Ring_Shop.Server.Entities
{
    [Table("Products")]
    public class ProductEntity
    {
        [Column("Id")]
        public Guid Id { get; set; }

        [Column("Name")]
        public string Name { get; set; } = string.Empty;

        [Column("Price")]
        public decimal Price { get; set; }

        [Column("TypeId")]
        public Guid TypeId { get; set; }

        [Column("Picture")]
        public string Picture { get; set; } = string.Empty;

        [Column("ImageId")]
        public string ImageId { get; set; } = string.Empty;
    }
}
