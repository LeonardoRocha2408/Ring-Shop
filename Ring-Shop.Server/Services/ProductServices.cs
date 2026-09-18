using Microsoft.EntityFrameworkCore;
using Ring_Shop.Server.Entities;
using Shared.SystemDTO;

namespace Ring_Shop.Server.Services
{
    public interface IProductServices
    {
        public Task<List<GetProductsDTO>> GetProductsByType(string type);
        public Task<GetProductsDTO?> GetProductById(Guid id);
    }
    public class ProductServices : IProductServices
    {
        private readonly DbContextEntity _context;

        public ProductServices(DbContextEntity context)
        {
            _context = context;
        }

        /* Get all products by type. 
         * If the "type" parameter is null, returns all products.
         * "IQueryable" is used to build the query dinamically baseado on the "type" parameter.
        */
        public async Task<List<GetProductsDTO>> GetProductsByType(string? type)
        {
            IQueryable<ProductEntity> query = _context.Products.Include(p => p.Type);

            if (!string.IsNullOrWhiteSpace(type))
            {
                query = query.Where(p => p.Type.Name == type);
            }

            return await query
                .AsNoTracking()
                .Select(p => new GetProductsDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    PictureURL = p.Picture
                })
                .ToListAsync();
        }

        // Get a product by its ID. Returns null if the product is not found.
        public async Task<GetProductsDTO?> GetProductById(Guid id)
        {
            IQueryable<ProductEntity> query = _context.Products.Include(p => p.Type);

            return await query
                .AsNoTracking()
                .Where(p => p.Id == id)
                .Select(p => new GetProductsDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    PictureURL = p.Picture,
                    Type = p.Type.Name
                })
                .FirstOrDefaultAsync();
        }
    }
}
