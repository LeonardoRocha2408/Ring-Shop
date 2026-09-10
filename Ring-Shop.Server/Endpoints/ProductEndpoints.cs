using Ring_Shop.Server.Services;

namespace Ring_Shop.Server.Endpoints
{
    public class ProductEndpoints : Interface
    {
        public void MapEndpoints(WebApplication app)
        {
            app.MapGet("/products", async (string? type, ProductServices product) =>
            {
                return Results.Ok(await product.GetProductsByType(type));
            });
        }
    }
}
