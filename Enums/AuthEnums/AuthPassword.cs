using System;
using System.Collections.Generic;
using System.Text;

namespace Enums.AuthEnums
{
    public enum AuthPassword
    {
        // Verify if the password is in correct format and meets the requirements
        PasswordTooShort,
        PasswordIsInvalid,
        PasswordHasMustHaveOneSpecialCharacter,
        PasswordHasMUstHaveOneUppercaseLetter,
        PasswordHasMUstHaveOneLowercaseLetter,
        PasswordHasMustHaveOneNumber,
        PasswordIsOk
    }
}
