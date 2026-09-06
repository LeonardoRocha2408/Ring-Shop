using Enums.AuthEnums;
using Enums.UserEnums;
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
        public Task<string> GenerateToken(Guid Id, Role role);
    }
    public class AuthServices : IAuthServices
    {
        private readonly PasswordHasher<UserEntity> _passwordHasher = new PasswordHasher<UserEntity>();
        private readonly IConfiguration _configuration;

        public AuthServices(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        /* Check if the password format meets the requirements, where the password must have: 
         * 8 characters, 
         * at least one uppercase letter, 
         * at least one lowercase letter,
         * at least one number
        */
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

        // Hash the password using PasswordHasher and return the hashed password.
        public Task<string> HashPassword(UserEntity user, string password)
        {
            return Task.FromResult(_passwordHasher.HashPassword(user, password));
        }

        // Check if the provided password meets the real password and return the result of the verification.
        public Task<PasswordVerificationResult> VerifyPassword(UserEntity user, string password, string providedPassword)
        {
            return Task.FromResult(_passwordHasher.VerifyHashedPassword(user, password, providedPassword));
        }


        /* Generate a JWT token for the user. Requires the user ID to generate the token.
         * Return the generate token as string to be saved in the cookie for future authentications.
         * The method create the claims with the user ID, get the JWT key, generate a symmetric security key, models the token, generates the JWT and return in string. 
         */
        public Task<string> GenerateToken(Guid Id, Role role)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, Id.ToString()),
                new Claim(ClaimTypes.Role, role.ToString())
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
