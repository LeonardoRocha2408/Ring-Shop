using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Shared.UserDTOs
{
    public sealed record LoginDTO
    {

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; init; } = string.Empty;


        [Required(ErrorMessage = "Password is required")]
        public string Password { get; init; } = string.Empty;
    }
}
