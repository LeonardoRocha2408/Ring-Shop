using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Shared.SystemDTO
{
    public sealed record ProductTypeDTO
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Type name is required")]
        public string Name { get; set; } = string.Empty;
    }
}
