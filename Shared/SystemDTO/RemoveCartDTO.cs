using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.SystemDTO
{
    public sealed record RemoveCartDTO
    {
        public Guid Id { get; set; }
        public string DeleteWhat { get; set; } = string.Empty;
    }
}
