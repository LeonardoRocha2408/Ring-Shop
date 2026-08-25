using Enums.AuthEnums;
using Enums.UserEnums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Ring_Shop.Server.Entities;
using Shared.UserDTOs;

namespace Ring_Shop.Server.Services
{
    public interface IUserServices
    {
        public Task<(CreateAccountResult Result, string? Token)> CreateAccount(CreateAccountDTO dto);
    }

    public class UserServices : IUserServices
    {
        private readonly DbContextEntity _context;
        private readonly AuthServices _authServices;

        public UserServices(DbContextEntity context, AuthServices authServices)
        {
            _context = context;
            _authServices = authServices;
        }


        // Create a new user account and return the result of the operation. Validate the input data and check if already exists accounts with the same email. 
        public async Task<(CreateAccountResult Result, string? Token)> CreateAccount(CreateAccountDTO dto)
        {
            bool userExists = await _context.Users
                .AsNoTracking()
                .AnyAsync(u => u.Email == dto.Email);

            if (userExists)
            {
                return (CreateAccountResult.EmailAlreadyExists, null);
            }
            var result = _authServices.VerifyPasswordFormat(dto.Password);
            if (result != AuthPassword.PasswordIsOk)
            {
                return (CreateAccountResult.InvalidInput, null);
            }

            var newUSer = new UserEntity
            {
                Id = Guid.NewGuid(),
                Role = Role.User,
                Name = dto.Name,
                Email = dto.Email,
                CreatedAt = DateTime.UtcNow
            };
            newUSer.PasswordHash = await _authServices.HashPassword(newUSer, dto.Password);

            await _context.AddAsync(newUSer);
            await _context.SaveChangesAsync();

            string token = await _authServices.GenerateToken(newUSer.Id);
            return (CreateAccountResult.Success, token);
        }

        // Login method to authenticate a user and return a JWT token if successful. Validate the input data and check if the user already exists.
        public async Task<(LoginResult Result, string? Token)> Login(LoginDTO dto)
        {
            UserEntity? user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null) 
            {
                return (LoginResult.UserNotFound, null);
            }
            var passwordVerification = await _authServices.VerifyPassword(user, user.PasswordHash, dto.Password);
            if (passwordVerification != PasswordVerificationResult.Success)
            {
                return (LoginResult.InvalidPassword, null);
            }

            var token = await _authServices.GenerateToken(user.Id);
            return (LoginResult.Success, token);
        }
    }
}
