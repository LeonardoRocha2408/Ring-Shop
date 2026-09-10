using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Shared.SystemDTO
{
    public sealed record ProductDTO
    {
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Product name is required.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Product price is required.")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Product type is required.")]
        public Guid TypeId { get; set; }

        [Required(ErrorMessage = "Product image is required.")]
        public IFormFile Image { get; set; } = null!;
    }
}
