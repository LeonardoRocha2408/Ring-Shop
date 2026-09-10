import { PackagePlus, PackageSearch, Users, Tags } from "lucide-react";

const adminLinks = [
    { id: "post product", label: "Postar produtos", to: "/post-product", icon: PackagePlus },
    { id: "manage products", label: "Gerenciar produtos", to: "/manage-products", icon: PackageSearch },
    { id: "manage users", label: "Gerenciar usuários", to: "/manage-users", icon: Users },
    { id: "manage product types", label: "Gerenciar tipos de produto", to: "/manage-type", icon: Tags }
]

export default adminLinks;