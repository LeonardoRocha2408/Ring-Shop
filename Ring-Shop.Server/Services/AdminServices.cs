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
        public Task<ProductTypeActions> RegisterProductType (ProductTypeDTO dto);
        public Task<List<ProductTypeDTO>> GetTypes();
        public Task<PostProductEnum> PostProduct (ProductDTO productDTO);
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
        * If the product type is registered successfully, return ProductTypeRegisteredSuccessfully.
        */
        public async Task<ProductTypeActions> RegisterProductType (ProductTypeDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return ProductTypeActions.InvalidInput;
            }

            bool productTypeExists = _context.ProductTypes
                .Any(pt => pt.Name == dto.Name);

            if (productTypeExists) 
            {
                return ProductTypeActions.ProductTypeAlreadyExists;
            }

            var newProductType = new ProductTypeEntity
            {
                Id = Guid.NewGuid(),
                Name = dto.Name
            };

            await _context.ProductTypes.AddAsync(newProductType);
            await _context.SaveChangesAsync();
            return ProductTypeActions.ProductTypeRegisteredSuccessfully;
        }

        // Delete product type by id. 
        public async Task<ProductTypeActions> DeleteProductType(Guid Id)
        {
            var productType = await _context.ProductTypes.FindAsync(Id);

            if (productType == null)
            {
                return ProductTypeActions.ProductTypeNotFound;
            }

            _context.ProductTypes.Remove(productType);
            _context.SaveChanges();
            return ProductTypeActions.ProductTypeDeletedSuccessfully;
        }

        // Get all product types and returns as list
        public async Task<List<ProductTypeDTO>> GetTypes()
        {
            var productTypes = await _context.ProductTypes
                .Select(pt => new ProductTypeDTO
                {
                    Id = pt.Id,
                    Name = pt.Name
                })
                .ToListAsync();
            return productTypes;
        }

        /* Method to post products. Each product has must name, price, type and picture.
         * All values must exist and be valid. Products can't have the same name. 
         * The picture muste be less than 10 MB. 
         * If the product is posted successfully, return ProductPostedSuccessfully.
        */
        public async Task<PostProductEnum> PostProduct(ProductDTO productDTO)
        {
            if (string.IsNullOrWhiteSpace(productDTO.Name) || productDTO.Price <= 0)
            {
                return PostProductEnum.InvalidInput;
            }

            if (productDTO.Image.Length <= 10 * 1024 * 1024) // 10 MB
            {
                return PostProductEnum.ProductPictureIsBiggerThan10MB;
            }
            else if (productDTO.Image.Length == 0)
            {
                return PostProductEnum.ProductHasMustPicture;
            }

            var result = await _cloudinary.UploadAsync(new ImageUploadParams
            {
                File = new FileDescription(productDTO.Image.FileName, productDTO.Image.OpenReadStream()),
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
