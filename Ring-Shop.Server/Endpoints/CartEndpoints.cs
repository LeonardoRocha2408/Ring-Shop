using System.Text.Json;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Scaffolding.Metadata;
using Ring_Shop.Server.Services;
using Shared.SystemDTO;

namespace Ring_Shop.Server.Endpoints
{
    public class CartEndpoints : Interface
    {
        public void MapEndpoints(WebApplication app)
        {
            /* 
             * Add one product to cart.
             * If product already exists in the cart, add one more.
             * Otherwise, if the product not exists, add in the cart
            */
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

                List<ProductRedisDTO>? products;

                if(cartData.HasValue)
                {
                    products = JsonSerializer.Deserialize<List<ProductRedisDTO>>((string)cartData!);
                    var existingProduct = products!.FirstOrDefault(p => p.Id == product.Id);

                    if (existingProduct != null)
                    {
                        existingProduct.Amount++;
                    }
                    else
                    {
                        product.Amount = 1;
                        products!.Add(product);
                    }
                }
                else
                {
                    product.Amount = 1;
                    products = new List<ProductRedisDTO> { product };
                }
                var updatedCartData = JsonSerializer.Serialize(products);
                await database.StringSetAsync(cacheKey, updatedCartData, TimeSpan.FromHours(5));
                return Results.Ok(products);
            });

            /* 
             * Remove a product from cart
             * If "deleteWhat" is "all", delete all products of that type.
             * If "deleteWhat" is "one", delete one product of that type, subtracting one from amount.
            */
            app.MapDelete("/remove-cart", async ([FromBody] RemoveCartDTO request, RedisServices redis, HttpContext http) =>
            {
                var cartId = http.Request.Cookies["cartId"];

                var database = redis.GetDatabase();

                var cacheKey = $"cart:guest:{cartId}";

                var cartData = await database.StringGetAsync(cacheKey);

                var products = JsonSerializer.Deserialize<List<ProductRedisDTO>>((string)cartData!);

                var productToSubtract = products!.FirstOrDefault(p => p.Id == request.Id);

                if (request.DeleteWhat == "all")
                {
                    products!.RemoveAll(p => p.Id == request.Id);
                }
                else if (request.DeleteWhat == "one")
                {
                    if (productToSubtract!.Amount == 1)
                    {
                        products!.RemoveAll(p => p.Id == request.Id);
                    }
                    else
                    {
                        productToSubtract!.Amount--;
                    }
                }
                var updatedCart = JsonSerializer.Serialize(products);
                await database.StringSetAsync(cacheKey, updatedCart, TimeSpan.FromHours(5));
                return Results.Ok(products);
            });

            // Get all products in the cache and returns a product list
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
