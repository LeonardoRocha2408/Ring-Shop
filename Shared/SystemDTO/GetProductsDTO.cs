using System.ComponentModel.DataAnnotations;

namespace Shared.SystemDTO
{
    public sealed record GetProductsDTO
    {
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Product name is required.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Product price is required.")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Product picture is required")]
        public string PictureURL { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;
    }
}
