using Enums.UserEnums;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ring_Shop.Server.Entities
{
    [Table("Users")]
    public class UserEntity
    {
        [Column("Id")]
        public Guid Id { get; set; }

        [Column("Role")]
        public Role Role { get; set; }

        [Column("Name")]
        public string Name { get; set; } = string.Empty;

        [Column("Email")]
        public string Email { get; set; } = string.Empty;

        [Column("PasswordHash")]
        public string PasswordHash { get; set; } = string.Empty;

        [Column("ProilePicture")]
        public string ProfilePicture { get; set; } = string.Empty;

        [Column("CreatedAt")]
        public DateTime CreatedAt { get; set; }

        [Column("UpdatedAt")]
        public DateTime UpdatedAt { get; set; }

        [Column("LastLoginAt")]
        public DateTime LastLoginAt { get; set; }
    }
}
