using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Shared.UserDTOs
{
    public sealed record CreateAccountDTO
    {
        [Required(ErrorMessage = "Name is required")] 
        public string Name { get; init; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; init; } = string.Empty;

        [Required(ErrorMessage = "Password is required")] 
        public string Password { get; init; } = string.Empty;
    }
}
