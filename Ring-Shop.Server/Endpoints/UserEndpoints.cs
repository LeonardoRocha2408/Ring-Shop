using Enums.UserEnums;
using Ring_Shop.Server.Services;
using Shared.UserDTOs;
using System.Security.Claims;

namespace Ring_Shop.Server.Endpoints
{
    public class UserEndpoints : Interface
    {
        public void MapEndpoints(WebApplication app)
        {
            // Create Account Endpoint
            app.MapPost("/create-account", async (CreateAccountDTO request, UserServices userServices, AuthServices authServices, HttpContext httpContext) =>
            {
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Password))
                {
                    return Results.BadRequest("Invalid input data.");
                }

                var result = await userServices.CreateAccount(request);
                switch (result.Result)
                {
                    case CreateAccountResult.Success:
                        var cookies = new CookieOptions
                        {
                            HttpOnly = true,
                            Secure = true,
                            SameSite = SameSiteMode.None,
                        };
                        httpContext.Response.Cookies.Append("access_token", result.Token!, cookies);
                        return Results.Ok();

                    case CreateAccountResult.EmailAlreadyExists:
                        return Results.Conflict("Email already exists.");

                    case CreateAccountResult.InvalidInput:
                        return Results.BadRequest("Invalid input data.");

                    default:
                        return Results.StatusCode(500);
                }
            })
                .RequireRateLimiting("CreateAccountLimiter");


            // Login Account Endpoint
            app.MapPost("/login", async (LoginDTO request, UserServices userServices, AuthServices authServices, HttpContext httpContext) =>
            {
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                {
                    return Results.BadRequest("Invalid input data.");
                }

                var result = await userServices.Login(request);
                switch (result.Result)
                {
                    case LoginResult.Success:
                        var cookies = new CookieOptions
                        {
                            HttpOnly = true,
                            Secure = true,
                            SameSite = SameSiteMode.None,
                        };
                        httpContext.Response.Cookies.Append("access_token", result.Token!, cookies);
                        return Results.Ok();

                    case LoginResult.UserNotFound:
                        return Results.NotFound("User not found.");

                    case LoginResult.InvalidPassword:
                        return Results.Unauthorized();

                    default:
                        return Results.StatusCode(500);
                }
            })
                .RequireRateLimiting("LoginLimiter");

            // Change Password Endpoint
            app.MapPatch("change-password", async (ChangePasswordDTO request, UserServices userServices) =>
            {
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.NewPassword))
                {
                    return Results.BadRequest("Invalid input data.");
                }

                var result = await userServices.ChangePassword(request);

                return result switch
                {
                    ChangePasswordResult.Success => Results.Ok(),
                    ChangePasswordResult.UserNotFound => Results.NotFound("User not found."),
                    ChangePasswordResult.InvalidPassword => Results.Unauthorized(),
                    _ => Results.StatusCode(500),
                };
            })
                .RequireRateLimiting("ChangePasswordLimiter");

            // /me endpoint. Return user data
            app.MapGet("/me", async (UserServices userServices, HttpContext context) =>
            {
                string? userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (!Guid.TryParse(userId, out var Id))
                {
                    return Results.BadRequest();
                }

                return Results.Ok(await userServices.GetMe(Id));
            })
                .RequireAuthorization();
        }
    }
}
