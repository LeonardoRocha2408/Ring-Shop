using System.Text.Json;
using Ring_Shop.Server.Services;
using Shared.SystemDTO;

namespace Ring_Shop.Server.Endpoints
{
    public class CartEndpoints : Interface
    {
        public void MapEndpoints(WebApplication app)
        {
            app.MapPost("/add-cart", async (ProductRedisDTO product, HttpContext http, RedisServices redis) =>
            {
                var cartId = http.Request.Cookies["cartId"];

                if (cartId == null)
                {
                    cartId = Guid.NewGuid().ToString();
                    http.Response.Cookies.Append("cartId", cartId);
                }

                var database = redis.GetDatabase();

                var cacheKey = $"cart:guest:{cartId}";

                var cartData = await database.StringGetAsync(cacheKey); 

                if(cartData.HasValue)
                {
                    var products = JsonSerializer.Deserialize<List<ProductRedisDTO>>((string)cartData!);
                    products!.Add(product);
                    var updatedCartData = JsonSerializer.Serialize(products);
                    await database.StringSetAsync(cacheKey, updatedCartData, TimeSpan.FromHours(5));
                    return Results.Ok();
                }
                else
                {
                    var products = new List<ProductRedisDTO> { product };
                    var newCartData = JsonSerializer.Serialize(products);
                    await database.StringSetAsync(cacheKey, newCartData, TimeSpan.FromHours(5));
                    return Results.Ok();
                }
            });

            app.MapGet("/get-cart", async (HttpContext http, RedisServices redis) =>
            {
                var cartId = http.Request.Cookies["cartId"];

                var database = redis.GetDatabase();

                var cacheKey = $"cart:guest:{cartId}";

                var cart = await database.StringGetAsync(cacheKey);

                return cart.HasValue switch
                {
                    true => Results.Ok(JsonSerializer.Deserialize<List<ProductRedisDTO>>((string)cart!)),
                    false => Results.Ok(new List<ProductRedisDTO>())
                };
            });
        }
    }
}
