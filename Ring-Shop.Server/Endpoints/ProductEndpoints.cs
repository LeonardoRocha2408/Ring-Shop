using Ring_Shop.Server.Services;
using Shared.SystemDTO;
using System.Text.Json;

namespace Ring_Shop.Server.Endpoints
{
    public class ProductEndpoints : Interface
    {
        public void MapEndpoints(WebApplication app)
        {
            // Get all products by type. If the "type" parameter is null, returns all products.
            app.MapGet("/products", async (string? type, ProductServices product, RedisServices redis) =>
            {
                var database = redis.GetDatabase();
                
                var cacheKey = $"products:{type ?? "all"}";

                var cachedProducts = await database.StringGetAsync(cacheKey);

                if(cachedProducts.HasValue)
                {
                    var products = JsonSerializer.Deserialize<List<GetProductsDTO>>((string)cachedProducts!);
                    Console.WriteLine("bateu no redis");
                    return Results.Ok(products);
                }

                var productsFromDB = await product.GetProductsByType(type);

                var json = JsonSerializer.Serialize(productsFromDB);

                await database.StringSetAsync(
                    cacheKey,
                    json,
                    TimeSpan.FromMinutes(10));
                Console.WriteLine("bateu no banco");
                return Results.Ok(productsFromDB);
            });

            // Get a product by its ID. Returns null if the product is not found.
            app.MapGet("/products/{Id}", async (Guid Id, ProductServices product, RedisServices redis) =>
            {
                var database = redis.GetDatabase();

                var cacheKey = $"products:{Id}";

                var cachedProduct = await database.StringGetAsync(cacheKey);

                if (cachedProduct.HasValue)
                {
                    return Results.Ok(JsonSerializer.Deserialize<GetProductsDTO>((string)cachedProduct!));
                    
                }

                var productFromDB = await product.GetProductById(Id);
                var json = JsonSerializer.Serialize(productFromDB);

                await database.StringSetAsync(
                    cacheKey,
                    json,
                    TimeSpan.FromMinutes(10));
                Console.WriteLine("bateu no banco");
                return Results.Ok(productFromDB);
            });
        }
    }
}
