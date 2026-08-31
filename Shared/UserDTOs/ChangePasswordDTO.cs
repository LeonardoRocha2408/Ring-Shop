using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Shared.UserDTOs
{
    public sealed record ChangePasswordDTO
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress]
        public string Email { get; init; } = string.Empty;

        [Required(ErrorMessage = "Current password is required.")]
        public string Password { get; init; } = string.Empty;

        [Required(ErrorMessage = "New password is required.")]
        public string NewPassword { get; init; } = string.Empty;
    }
}
