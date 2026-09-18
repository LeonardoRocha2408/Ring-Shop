using System.ComponentModel.DataAnnotations;

namespace Shared.SystemDTO
{
    public sealed record ProductRedisDTO
    {
        [Required(ErrorMessage = "Product Id is required")]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Product name is required")]
        public string Name { get; set; } = string.Empty;
        [Required(ErrorMessage = "Amount products is required")]
        public int Amount { get; set; }
        [Required(ErrorMessage = "Product image URL is required")]
        public string PictureURL { get; set; } = string.Empty;
    }
}
