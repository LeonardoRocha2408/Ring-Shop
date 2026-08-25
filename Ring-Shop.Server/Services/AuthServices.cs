using Enums.AuthEnums;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Ring_Shop.Server.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Ring_Shop.Server.Services
{
    public interface IAuthServices
    {
        public AuthPassword VerifyPasswordFormat(string password);
        public Task<string> HashPassword(UserEntity user, string password);
        public Task<PasswordVerificationResult> VerifyPassword(UserEntity user, string password, string providedPassword);
        public Task<string> GenerateToken(Guid Id);
    }
    public class AuthServices : IAuthServices
    {
        private readonly PasswordHasher<UserEntity> _passwordHasher = new PasswordHasher<UserEntity>();
        private readonly IConfiguration _configuration;

        public AuthServices(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public AuthPassword VerifyPasswordFormat(string password)
        {
            if (password == null)
            {
                return AuthPassword.PasswordIsInvalid;
            }
            if (password.Length < 8)
            {
                return AuthPassword.PasswordTooShort;
            }
            if (!password.Any(char.IsLower))
            {
                return AuthPassword.PasswordHasMUstHaveOneLowercaseLetter;
            }
            if (!password.Any(char.IsUpper))
            {
                return AuthPassword.PasswordHasMUstHaveOneUppercaseLetter;
            }
            if (!password.Any(char.IsDigit))
            {
                return AuthPassword.PasswordHasMustHaveOneNumber;
            }
            return AuthPassword.PasswordIsOk;
        }

        public Task<string> HashPassword(UserEntity user, string password)
        {
            return Task.FromResult(_passwordHasher.HashPassword(user, password));
        }

        public Task<PasswordVerificationResult> VerifyPassword(UserEntity user, string password, string providedPassword)
        {
            return Task.FromResult(_passwordHasher.VerifyHashedPassword(user, password, providedPassword));
        }

        public Task<string> GenerateToken(Guid Id)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, Id.ToString())
            };

            string? keyValue = _configuration["Jwt:Key"];

            if (keyValue == null)
            {
                throw new InvalidOperationException("JWT key is not configured.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyValue));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken
            (
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                signingCredentials: credentials
            );

            var jwt = new JwtSecurityTokenHandler()
                .WriteToken(token);
            return Task.FromResult(jwt);
        }
    }
}
