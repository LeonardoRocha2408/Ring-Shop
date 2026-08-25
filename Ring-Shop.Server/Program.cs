using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Ring_Shop.Server.Entities;
using Ring_Shop.Server.Services;
using System.Threading.RateLimiting;

namespace Ring_Shop.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add CORS policy and configure the allowed methods
            builder.Services.AddCors(options =>
            options.AddPolicy("FrontEndOnly", policy =>
            {
                policy.WithOrigins("https://localhost:57103")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
            }));

            // Add authentication with JWT and configure the token validation parameters
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],

                        ValidateAudience = true,
                        ValidAudience = builder.Configuration["Jwt:Audience"],

                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            context.Token = context.Request.Cookies["access_token"];
                            return Task.CompletedTask;
                        }
                    };
                }
            );


            // Add rate limiter to API security
            builder.Services.AddRateLimiter(options =>
            {
                options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

                options.AddPolicy("CreateAccountLimiter", httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: httpContext.Connection.RemoteIpAddress?.ToString(),
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 1,
                        Window = TimeSpan.FromMinutes(60),
                        QueueLimit = 0
                    }
                    ));

                options.AddPolicy("LoginLimiter", httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: httpContext.Connection.RemoteIpAddress?.ToString(),
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 5,
                        Window = TimeSpan.FromMinutes(10),
                        QueueLimit = 0
                    }
                    ));
            });

            // Add MySQL database to backend and configure the connection string
            string? connectiomString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<DbContextEntity>(options => options.UseMySql(
                connectiomString,
                ServerVersion.AutoDetect(connectiomString)));

            builder.Services.AddScoped<AuthServices>();
            builder.Services.AddScoped<UserServices>();

            // Add services to the container.
            builder.Services.AddAuthorization();

            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.MapStaticAssets();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();

            app.UseCors("FrontEndOnly");

            app.UseRateLimiter();

            app.UseAuthentication();

            app.UseAuthorization();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
