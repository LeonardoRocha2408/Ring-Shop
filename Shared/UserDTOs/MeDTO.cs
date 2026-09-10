using Enums.UserEnums;
using System.ComponentModel.DataAnnotations;

namespace Shared.UserDTOs
{
    public sealed record MeDTO
    {
        [Required(ErrorMessage = "Email can not null")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;


        [Required]
        public string Role { get; set; } = string.Empty;
        public string PathProfile { get; set; } = string.Empty;
    }
}
