using CloudinaryDotNet;
using Enums.SystemEnums.AdminEnums;
using Microsoft.EntityFrameworkCore;
using Ring_Shop.Server.Entities;
using Shared.SystemDTO;
using CloudinaryDotNet.Actions;

namespace Ring_Shop.Server.Services
{
    public interface IAdminServices
    {
        // Define methods for admin services to be implemented unit tests.
        public Task<RegisterTypeProduct> RegisterProductType (string productType);
        public Task<PostProductEnum> PostProduct (ProductDTO productDTO, IFormFile productPicture);
    }
    public class AdminServices : IAdminServices
    {
        private readonly DbContextEntity _context;
        private readonly Cloudinary _cloudinary;

        public AdminServices(DbContextEntity context, Cloudinary cloudinary)
        {
            _cloudinary = cloudinary;
            _context = context;
        }

        /* 
        * Register product type. 
        * If the product type already exists, return ProductTypeAlreadyExists. 
        * If the product type is invalid, return ProductTypeIsInvalid.
        * If the product type is registered successfully, return ProductTypeRegistered.
        */
        public Task<RegisterTypeProduct> RegisterProductType (string productType)
        {
            throw new NotImplementedException();
        }

        // Method to post products. Each product has must name, price, type and picture.
        public async Task<PostProductEnum> PostProduct(ProductDTO productDTO, IFormFile image)
        {
            if (string.IsNullOrWhiteSpace(productDTO.Name) || productDTO.Price <= 0)
            {
                return PostProductEnum.InvalidInput;
            }

            if (image.Length <= 10 * 1024 * 1024) // 10 MB
            {
                return PostProductEnum.ProductPictureIsBiggerThan10MB;
            }
            else if (image.Length == 0)
            {
                return PostProductEnum.ProductHasMustPicture;
            }

            var result = await _cloudinary.UploadAsync(new ImageUploadParams
            {
                File = new FileDescription(image.FileName, image.OpenReadStream()),
                Folder = "products",
                PublicId = $"{productDTO.Name}_{Guid.NewGuid()}",
                Overwrite = true
            });


            bool productExists = await _context.Products
                .AnyAsync(p => p.Name == productDTO.Name);

            if (productExists)
            {
                var resultDelete = await _cloudinary.DestroyAsync(new DeletionParams(result.PublicId));
                return PostProductEnum.ProductAlreadyExists;
            }

            var product = new ProductEntity
            {
                Id = Guid.NewGuid(),
                Name = productDTO.Name,
                Price = productDTO.Price,
                TypeId = productDTO.TypeId,
                Picture = result.SecureUrl.ToString(),
                ImageId = result.PublicId
            };

            await _context.AddAsync(product);
            await _context.SaveChangesAsync();
            return PostProductEnum.ProductPostedSuccessfully;
        }
    }
}
