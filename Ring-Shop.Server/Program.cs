using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Ring_Shop.Server.Endpoints;
using Ring_Shop.Server.Entities;
using Ring_Shop.Server.Services;
using System.Text;
using System.Threading.RateLimiting;
using CloudinaryDotNet;
using System.Text.Json.Serialization;

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

            // Add authorization for admins 
            builder.Services.AddAuthorization(options =>
            options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin")));

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

                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),

                        ValidateLifetime = false
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            context.Token = context.HttpContext.Request.Cookies["access_token"];
                            return Task.CompletedTask;
                        }
                    };
                });


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

                options.AddPolicy("ChangePasswordLimiter", httpContext => 
                RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: httpContext.Connection.RemoteIpAddress?.ToString(),
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 1,
                        Window = TimeSpan.FromMinutes(60),
                        QueueLimit = 0
                    }
                    ));
            });

            // Add MySQL database to backend and configure the connection string
            string? connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<DbContextEntity>(options => options.UseMySql
            (connectionString, ServerVersion.AutoDetect(connectionString)));

            // Add Cloudinary service to program and configure its dependencies: CloudName, ApiKey, ApiSecret - return an url HTPPS for to upload images
            builder.Services.AddSingleton(sp =>
            {
                var config = builder.Configuration;
                var account = new Account(
                    config["Cloudinary:CloudName"],
                    config["Cloudinary:ApiKey"],
                    config["Cloudinary:ApiSecret"]
                    );
                return new Cloudinary(account) { Api = { Secure = true } };
            });

            // Add conversion of the enum to string
            builder.Services.ConfigureHttpJsonOptions(options => 
                options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

            // Add scoped services to the container for dependency injection
            builder.Services.AddScoped<AuthServices>();
            builder.Services.AddScoped<UserServices>();
            builder.Services.AddScoped<AdminServices>();
            builder.Services.AddScoped<ProductServices>();

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

            app.MapEndpoints();

            app.Run();
        }
    }
}
