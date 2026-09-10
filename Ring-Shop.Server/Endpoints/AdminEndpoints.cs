using Enums.SystemEnums.AdminEnums;
using Microsoft.AspNetCore.Mvc;
using Ring_Shop.Server.Services;
using Shared.SystemDTO;
using System.Security.Claims;

namespace Ring_Shop.Server.Endpoints
{
    public class AdminEndpoints : Interface
    {
        public void MapEndpoints(WebApplication app)
        {
            // Register product types
            app.MapPost("/register-product-type", async (ProductTypeDTO request, AdminServices admin) =>
            {
                var result = await admin.RegisterProductType(request);
                return result switch
                {
                    ProductTypeActions.ProductTypeRegisteredSuccessfully => Results.Created(),
                    ProductTypeActions.InvalidInput => Results.BadRequest(),
                    ProductTypeActions.ProductTypeAlreadyExists => Results.Conflict(),
                    _ => Results.StatusCode(500)
                };
            })
                .RequireAuthorization("AdminOnly");

            // Get all types registrered and returns for frontend
            app.MapGet("/product-types", async (AdminServices admin) =>
            {
                return Results.Ok(await admin.GetTypes());
            });

            /* 
             * Delete the product type specified.
             * The product type id is received in query 
            */
            app.MapDelete("delete-product-type/{Id}", async (Guid Id, AdminServices admin) =>
            {
                var result = await admin.DeleteProductType(Id);
            })
                .RequireAuthorization("AdminOnly");

            // Post product to sale
            app.MapPost("/post-product", async (ProductDTO request, AdminServices admin, HttpContext context) =>
            {
                string? role = context.User.FindFirst(ClaimTypes.Role)?.Value;

                var result = await admin.PostProduct(request);

                return result switch
                {
                    PostProductEnum.ProductPostedSuccessfully => Results.Created(),
                    PostProductEnum.InvalidInput => Results.BadRequest(),
                    PostProductEnum.ProductAlreadyExists => Results.Conflict(),
                    PostProductEnum.ProductHasMustPicture => Results.BadRequest(),
                    PostProductEnum.ProductPictureIsBiggerThan10MB => Results.BadRequest(),
                    _ => Results.StatusCode(500)
                };
            })
                .RequireAuthorization("AdminOnly");
        }
    }
}
