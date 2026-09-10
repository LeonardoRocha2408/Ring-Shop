using System.ComponentModel.DataAnnotations.Schema;

namespace Ring_Shop.Server.Entities
{
    [Table("ProductTypes")]
    public class ProductTypeEntity
    {
        [Column("Id")]
        public Guid Id { get; set; }
        [Column("Name")]
        public string Name { get; set; } = string.Empty;
    }
}
