using System;
using System.Collections.Generic;
using System.Text;

namespace Enums.SystemEnums.AdminEnums
{
    public enum ProductTypeActions
    {
        // Register product type actions
        ProductTypeRegisteredSuccessfully,
        ProductTypeAlreadyExists,
        InvalidInput,

        // Delete product type actions
        ProductTypeDeletedSuccessfully,
        ProductTypeNotFound
    }
}
