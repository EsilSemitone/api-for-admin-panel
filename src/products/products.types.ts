export const Products = {
    ALCOHOL: 'ALCOHOL',
    BIJOUTERIE: 'BIJOUTERIE',
    FOR_KIDS: 'FOR_KIDS',
    OFFICE: 'OFFICE',
    FURNITURE: 'FURNITURE',
    COSMETICS: 'COSMETICS',
    FOR_PETS: 'FOR_PETS',
};

export type ProductsType = keyof typeof Products;
