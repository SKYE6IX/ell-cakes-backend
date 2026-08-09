/* eslint-disable */

export type UserWhereUniqueInput = {
  readonly id?: string | null
  readonly email?: string | null
  readonly phoneNumber?: string | null
  readonly delivaryAddress?: DelivaryAddressWhereUniqueInput | null
  readonly cart?: CartWhereUniqueInput | null
}

export type UserWhereInput = {
  readonly AND?: ReadonlyArray<UserWhereInput> | UserWhereInput | null
  readonly OR?: ReadonlyArray<UserWhereInput> | UserWhereInput | null
  readonly NOT?: ReadonlyArray<UserWhereInput> | UserWhereInput | null
  readonly id?: IDFilter | null
  readonly name?: StringFilter | null
  readonly email?: StringFilter | null
  readonly phoneNumber?: StringFilter | null
  readonly isUserVerified?: BooleanFilter | null
  readonly userVerificationToken?: StringNullableFilter | null
  readonly userVerificationTokenIssuedAt?: DateTimeNullableFilter | null
  readonly userVerificationTokenRedeemedAt?: DateTimeNullableFilter | null
  readonly role?: StringFilter | null
  readonly passwordResetToken?: StringNullableFilter | null
  readonly passwordResetIssuedAt?: DateTimeNullableFilter | null
  readonly passwordResetRedeemedAt?: DateTimeNullableFilter | null
  readonly firstOrderDiscountEligible?: BooleanFilter | null
  readonly delivaryAddress?: DelivaryAddressWhereInput | null
  readonly cart?: CartWhereInput | null
  readonly orders?: OrderManyRelationFilter | null
  readonly orderBeneficiaries?: OrderReceiverManyRelationFilter | null
  readonly payments?: PaymentManyRelationFilter | null
  readonly lastLogin?: DateTimeNullableFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type IDFilter = {
  readonly equals?: string | null
  readonly in?: ReadonlyArray<string> | string | null
  readonly notIn?: ReadonlyArray<string> | string | null
  readonly lt?: string | null
  readonly lte?: string | null
  readonly gt?: string | null
  readonly gte?: string | null
  readonly not?: IDFilter | null
}

export type StringFilter = {
  readonly equals?: string | null
  readonly in?: ReadonlyArray<string> | string | null
  readonly notIn?: ReadonlyArray<string> | string | null
  readonly lt?: string | null
  readonly lte?: string | null
  readonly gt?: string | null
  readonly gte?: string | null
  readonly contains?: string | null
  readonly startsWith?: string | null
  readonly endsWith?: string | null
  readonly mode?: QueryMode | null
  readonly not?: NestedStringFilter | null
}

export type QueryMode =
  | 'default'
  | 'insensitive'

export type NestedStringFilter = {
  readonly equals?: string | null
  readonly in?: ReadonlyArray<string> | string | null
  readonly notIn?: ReadonlyArray<string> | string | null
  readonly lt?: string | null
  readonly lte?: string | null
  readonly gt?: string | null
  readonly gte?: string | null
  readonly contains?: string | null
  readonly startsWith?: string | null
  readonly endsWith?: string | null
  readonly not?: NestedStringFilter | null
}

export type BooleanFilter = {
  readonly equals?: boolean | null
  readonly not?: BooleanFilter | null
}

export type StringNullableFilter = {
  readonly equals?: string | null
  readonly in?: ReadonlyArray<string> | string | null
  readonly notIn?: ReadonlyArray<string> | string | null
  readonly lt?: string | null
  readonly lte?: string | null
  readonly gt?: string | null
  readonly gte?: string | null
  readonly contains?: string | null
  readonly startsWith?: string | null
  readonly endsWith?: string | null
  readonly mode?: QueryMode | null
  readonly not?: StringNullableFilter | null
}

export type DateTimeNullableFilter = {
  readonly equals?: any | null
  readonly in?: ReadonlyArray<any> | any | null
  readonly notIn?: ReadonlyArray<any> | any | null
  readonly lt?: any | null
  readonly lte?: any | null
  readonly gt?: any | null
  readonly gte?: any | null
  readonly not?: DateTimeNullableFilter | null
}

export type OrderManyRelationFilter = {
  readonly every?: OrderWhereInput | null
  readonly some?: OrderWhereInput | null
  readonly none?: OrderWhereInput | null
}

export type OrderReceiverManyRelationFilter = {
  readonly every?: OrderReceiverWhereInput | null
  readonly some?: OrderReceiverWhereInput | null
  readonly none?: OrderReceiverWhereInput | null
}

export type PaymentManyRelationFilter = {
  readonly every?: PaymentWhereInput | null
  readonly some?: PaymentWhereInput | null
  readonly none?: PaymentWhereInput | null
}

export type UserOrderByInput = {
  readonly id?: OrderDirection | null
  readonly name?: OrderDirection | null
  readonly email?: OrderDirection | null
  readonly phoneNumber?: OrderDirection | null
  readonly isUserVerified?: OrderDirection | null
  readonly userVerificationToken?: OrderDirection | null
  readonly userVerificationTokenIssuedAt?: OrderDirection | null
  readonly userVerificationTokenRedeemedAt?: OrderDirection | null
  readonly role?: OrderDirection | null
  readonly passwordResetToken?: OrderDirection | null
  readonly passwordResetIssuedAt?: OrderDirection | null
  readonly passwordResetRedeemedAt?: OrderDirection | null
  readonly firstOrderDiscountEligible?: OrderDirection | null
  readonly lastLogin?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type OrderDirection =
  | 'asc'
  | 'desc'

export type UserUpdateInput = {
  readonly name?: string | null
  readonly email?: string | null
  readonly password?: string | null
  readonly phoneNumber?: string | null
  readonly isUserVerified?: boolean | null
  readonly userVerificationToken?: string | null
  readonly userVerificationTokenIssuedAt?: any | null
  readonly userVerificationTokenRedeemedAt?: any | null
  readonly role?: string | null
  readonly passwordResetToken?: string | null
  readonly passwordResetIssuedAt?: any | null
  readonly passwordResetRedeemedAt?: any | null
  readonly firstOrderDiscountEligible?: boolean | null
  readonly delivaryAddress?: DelivaryAddressRelateToOneForUpdateInput | null
  readonly cart?: CartRelateToOneForUpdateInput | null
  readonly orders?: OrderRelateToManyForUpdateInput | null
  readonly orderBeneficiaries?: OrderReceiverRelateToManyForUpdateInput | null
  readonly payments?: PaymentRelateToManyForUpdateInput | null
  readonly lastLogin?: any | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type DelivaryAddressRelateToOneForUpdateInput = {
  readonly create?: DelivaryAddressCreateInput | null
  readonly connect?: DelivaryAddressWhereUniqueInput | null
  readonly disconnect?: boolean | null
}

export type CartRelateToOneForUpdateInput = {
  readonly create?: CartCreateInput | null
  readonly connect?: CartWhereUniqueInput | null
  readonly disconnect?: boolean | null
}

export type OrderRelateToManyForUpdateInput = {
  readonly disconnect?: ReadonlyArray<OrderWhereUniqueInput> | OrderWhereUniqueInput | null
  readonly set?: ReadonlyArray<OrderWhereUniqueInput> | OrderWhereUniqueInput | null
  readonly create?: ReadonlyArray<OrderCreateInput> | OrderCreateInput | null
  readonly connect?: ReadonlyArray<OrderWhereUniqueInput> | OrderWhereUniqueInput | null
}

export type OrderReceiverRelateToManyForUpdateInput = {
  readonly disconnect?: ReadonlyArray<OrderReceiverWhereUniqueInput> | OrderReceiverWhereUniqueInput | null
  readonly set?: ReadonlyArray<OrderReceiverWhereUniqueInput> | OrderReceiverWhereUniqueInput | null
  readonly create?: ReadonlyArray<OrderReceiverCreateInput> | OrderReceiverCreateInput | null
  readonly connect?: ReadonlyArray<OrderReceiverWhereUniqueInput> | OrderReceiverWhereUniqueInput | null
}

export type PaymentRelateToManyForUpdateInput = {
  readonly disconnect?: ReadonlyArray<PaymentWhereUniqueInput> | PaymentWhereUniqueInput | null
  readonly set?: ReadonlyArray<PaymentWhereUniqueInput> | PaymentWhereUniqueInput | null
  readonly create?: ReadonlyArray<PaymentCreateInput> | PaymentCreateInput | null
  readonly connect?: ReadonlyArray<PaymentWhereUniqueInput> | PaymentWhereUniqueInput | null
}

export type UserUpdateArgs = {
  readonly where: UserWhereUniqueInput
  readonly data: UserUpdateInput
}

export type UserCreateInput = {
  readonly name?: string | null
  readonly email?: string | null
  readonly password?: string | null
  readonly phoneNumber?: string | null
  readonly isUserVerified?: boolean | null
  readonly userVerificationToken?: string | null
  readonly userVerificationTokenIssuedAt?: any | null
  readonly userVerificationTokenRedeemedAt?: any | null
  readonly role?: string | null
  readonly passwordResetToken?: string | null
  readonly passwordResetIssuedAt?: any | null
  readonly passwordResetRedeemedAt?: any | null
  readonly firstOrderDiscountEligible?: boolean | null
  readonly delivaryAddress?: DelivaryAddressRelateToOneForCreateInput | null
  readonly cart?: CartRelateToOneForCreateInput | null
  readonly orders?: OrderRelateToManyForCreateInput | null
  readonly orderBeneficiaries?: OrderReceiverRelateToManyForCreateInput | null
  readonly payments?: PaymentRelateToManyForCreateInput | null
  readonly lastLogin?: any | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type DelivaryAddressRelateToOneForCreateInput = {
  readonly create?: DelivaryAddressCreateInput | null
  readonly connect?: DelivaryAddressWhereUniqueInput | null
}

export type CartRelateToOneForCreateInput = {
  readonly create?: CartCreateInput | null
  readonly connect?: CartWhereUniqueInput | null
}

export type OrderRelateToManyForCreateInput = {
  readonly create?: ReadonlyArray<OrderCreateInput> | OrderCreateInput | null
  readonly connect?: ReadonlyArray<OrderWhereUniqueInput> | OrderWhereUniqueInput | null
  readonly set?: ReadonlyArray<OrderWhereUniqueInput> | OrderWhereUniqueInput | null
}

export type OrderReceiverRelateToManyForCreateInput = {
  readonly create?: ReadonlyArray<OrderReceiverCreateInput> | OrderReceiverCreateInput | null
  readonly connect?: ReadonlyArray<OrderReceiverWhereUniqueInput> | OrderReceiverWhereUniqueInput | null
  readonly set?: ReadonlyArray<OrderReceiverWhereUniqueInput> | OrderReceiverWhereUniqueInput | null
}

export type PaymentRelateToManyForCreateInput = {
  readonly create?: ReadonlyArray<PaymentCreateInput> | PaymentCreateInput | null
  readonly connect?: ReadonlyArray<PaymentWhereUniqueInput> | PaymentWhereUniqueInput | null
  readonly set?: ReadonlyArray<PaymentWhereUniqueInput> | PaymentWhereUniqueInput | null
}

export type DelivaryAddressWhereUniqueInput = {
  readonly id?: string | null
  readonly user?: UserWhereUniqueInput | null
}

export type DelivaryAddressWhereInput = {
  readonly AND?: ReadonlyArray<DelivaryAddressWhereInput> | DelivaryAddressWhereInput | null
  readonly OR?: ReadonlyArray<DelivaryAddressWhereInput> | DelivaryAddressWhereInput | null
  readonly NOT?: ReadonlyArray<DelivaryAddressWhereInput> | DelivaryAddressWhereInput | null
  readonly id?: IDFilter | null
  readonly user?: UserWhereInput | null
  readonly orders?: OrderManyRelationFilter | null
  readonly address?: StringFilter | null
  readonly apartmentNumber?: StringFilter | null
  readonly floor?: StringFilter | null
  readonly intercomCode?: StringFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type DelivaryAddressOrderByInput = {
  readonly id?: OrderDirection | null
  readonly address?: OrderDirection | null
  readonly apartmentNumber?: OrderDirection | null
  readonly floor?: OrderDirection | null
  readonly intercomCode?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type DelivaryAddressUpdateInput = {
  readonly user?: UserRelateToOneForUpdateInput | null
  readonly orders?: OrderRelateToManyForUpdateInput | null
  readonly address?: string | null
  readonly apartmentNumber?: string | null
  readonly floor?: string | null
  readonly intercomCode?: string | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type UserRelateToOneForUpdateInput = {
  readonly create?: UserCreateInput | null
  readonly connect?: UserWhereUniqueInput | null
  readonly disconnect?: boolean | null
}

export type DelivaryAddressUpdateArgs = {
  readonly where: DelivaryAddressWhereUniqueInput
  readonly data: DelivaryAddressUpdateInput
}

export type DelivaryAddressCreateInput = {
  readonly user?: UserRelateToOneForCreateInput | null
  readonly orders?: OrderRelateToManyForCreateInput | null
  readonly address?: string | null
  readonly apartmentNumber?: string | null
  readonly floor?: string | null
  readonly intercomCode?: string | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type UserRelateToOneForCreateInput = {
  readonly create?: UserCreateInput | null
  readonly connect?: UserWhereUniqueInput | null
}

export type ProductWhereUniqueInput = {
  readonly id?: string | null
  readonly slug?: string | null
  readonly mixBoxProduct?: MixBoxProductWhereUniqueInput | null
  readonly video?: ProductVideoWhereUniqueInput | null
}

export type ProductWhereInput = {
  readonly AND?: ReadonlyArray<ProductWhereInput> | ProductWhereInput | null
  readonly OR?: ReadonlyArray<ProductWhereInput> | ProductWhereInput | null
  readonly NOT?: ReadonlyArray<ProductWhereInput> | ProductWhereInput | null
  readonly id?: IDFilter | null
  readonly categories?: CategoryManyRelationFilter | null
  readonly name?: StringFilter | null
  readonly slug?: StringFilter | null
  readonly baseDescription?: StringFilter | null
  readonly type?: StringFilter | null
  readonly variantType?: StringFilter | null
  readonly fillings?: ProductFillingManyRelationFilter | null
  readonly mixBoxProduct?: MixBoxProductWhereInput | null
  readonly preparationDays?: IntNullableFilter | null
  readonly isAvailable?: BooleanFilter | null
  readonly badge?: StringNullableFilter | null
  readonly images?: ProductImageManyRelationFilter | null
  readonly video?: ProductVideoWhereInput | null
  readonly customizations?: CustomizationOptionManyRelationFilter | null
  readonly topping?: ToppingWhereInput | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type CategoryManyRelationFilter = {
  readonly every?: CategoryWhereInput | null
  readonly some?: CategoryWhereInput | null
  readonly none?: CategoryWhereInput | null
}

export type ProductFillingManyRelationFilter = {
  readonly every?: ProductFillingWhereInput | null
  readonly some?: ProductFillingWhereInput | null
  readonly none?: ProductFillingWhereInput | null
}

export type IntNullableFilter = {
  readonly equals?: number | null
  readonly in?: ReadonlyArray<number> | number | null
  readonly notIn?: ReadonlyArray<number> | number | null
  readonly lt?: number | null
  readonly lte?: number | null
  readonly gt?: number | null
  readonly gte?: number | null
  readonly not?: IntNullableFilter | null
}

export type ProductImageManyRelationFilter = {
  readonly every?: ProductImageWhereInput | null
  readonly some?: ProductImageWhereInput | null
  readonly none?: ProductImageWhereInput | null
}

export type CustomizationOptionManyRelationFilter = {
  readonly every?: CustomizationOptionWhereInput | null
  readonly some?: CustomizationOptionWhereInput | null
  readonly none?: CustomizationOptionWhereInput | null
}

export type ProductOrderByInput = {
  readonly id?: OrderDirection | null
  readonly name?: OrderDirection | null
  readonly slug?: OrderDirection | null
  readonly baseDescription?: OrderDirection | null
  readonly type?: OrderDirection | null
  readonly variantType?: OrderDirection | null
  readonly preparationDays?: OrderDirection | null
  readonly isAvailable?: OrderDirection | null
  readonly badge?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type ProductUpdateInput = {
  readonly categories?: CategoryRelateToManyForUpdateInput | null
  readonly name?: string | null
  readonly slug?: string | null
  readonly baseDescription?: string | null
  readonly type?: string | null
  readonly variantType?: string | null
  readonly fillings?: ProductFillingRelateToManyForUpdateInput | null
  readonly mixBoxProduct?: MixBoxProductRelateToOneForUpdateInput | null
  readonly preparationDays?: number | null
  readonly isAvailable?: boolean | null
  readonly badge?: string | null
  readonly images?: ProductImageRelateToManyForUpdateInput | null
  readonly video?: ProductVideoRelateToOneForUpdateInput | null
  readonly customizations?: CustomizationOptionRelateToManyForUpdateInput | null
  readonly topping?: ToppingRelateToOneForUpdateInput | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type CategoryRelateToManyForUpdateInput = {
  readonly disconnect?: ReadonlyArray<CategoryWhereUniqueInput> | CategoryWhereUniqueInput | null
  readonly set?: ReadonlyArray<CategoryWhereUniqueInput> | CategoryWhereUniqueInput | null
  readonly create?: ReadonlyArray<CategoryCreateInput> | CategoryCreateInput | null
  readonly connect?: ReadonlyArray<CategoryWhereUniqueInput> | CategoryWhereUniqueInput | null
}

export type ProductFillingRelateToManyForUpdateInput = {
  readonly disconnect?: ReadonlyArray<ProductFillingWhereUniqueInput> | ProductFillingWhereUniqueInput | null
  readonly set?: ReadonlyArray<ProductFillingWhereUniqueInput> | ProductFillingWhereUniqueInput | null
  readonly create?: ReadonlyArray<ProductFillingCreateInput> | ProductFillingCreateInput | null
  readonly connect?: ReadonlyArray<ProductFillingWhereUniqueInput> | ProductFillingWhereUniqueInput | null
}

export type MixBoxProductRelateToOneForUpdateInput = {
  readonly create?: MixBoxProductCreateInput | null
  readonly connect?: MixBoxProductWhereUniqueInput | null
  readonly disconnect?: boolean | null
}

export type ProductImageRelateToManyForUpdateInput = {
  readonly disconnect?: ReadonlyArray<ProductImageWhereUniqueInput> | ProductImageWhereUniqueInput | null
  readonly set?: ReadonlyArray<ProductImageWhereUniqueInput> | ProductImageWhereUniqueInput | null
  readonly create?: ReadonlyArray<ProductImageCreateInput> | ProductImageCreateInput | null
  readonly connect?: ReadonlyArray<ProductImageWhereUniqueInput> | ProductImageWhereUniqueInput | null
}

export type ProductVideoRelateToOneForUpdateInput = {
  readonly create?: ProductVideoCreateInput | null
  readonly connect?: ProductVideoWhereUniqueInput | null
  readonly disconnect?: boolean | null
}

export type CustomizationOptionRelateToManyForUpdateInput = {
  readonly disconnect?: ReadonlyArray<CustomizationOptionWhereUniqueInput> | CustomizationOptionWhereUniqueInput | null
  readonly set?: ReadonlyArray<CustomizationOptionWhereUniqueInput> | CustomizationOptionWhereUniqueInput | null
  readonly create?: ReadonlyArray<CustomizationOptionCreateInput> | CustomizationOptionCreateInput | null
  readonly connect?: ReadonlyArray<CustomizationOptionWhereUniqueInput> | CustomizationOptionWhereUniqueInput | null
}

export type ToppingRelateToOneForUpdateInput = {
  readonly create?: ToppingCreateInput | null
  readonly connect?: ToppingWhereUniqueInput | null
  readonly disconnect?: boolean | null
}

export type ProductUpdateArgs = {
  readonly where: ProductWhereUniqueInput
  readonly data: ProductUpdateInput
}

export type ProductCreateInput = {
  readonly categories?: CategoryRelateToManyForCreateInput | null
  readonly name?: string | null
  readonly slug?: string | null
  readonly baseDescription?: string | null
  readonly type?: string | null
  readonly variantType?: string | null
  readonly fillings?: ProductFillingRelateToManyForCreateInput | null
  readonly mixBoxProduct?: MixBoxProductRelateToOneForCreateInput | null
  readonly preparationDays?: number | null
  readonly isAvailable?: boolean | null
  readonly badge?: string | null
  readonly images?: ProductImageRelateToManyForCreateInput | null
  readonly video?: ProductVideoRelateToOneForCreateInput | null
  readonly customizations?: CustomizationOptionRelateToManyForCreateInput | null
  readonly topping?: ToppingRelateToOneForCreateInput | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type CategoryRelateToManyForCreateInput = {
  readonly create?: ReadonlyArray<CategoryCreateInput> | CategoryCreateInput | null
  readonly connect?: ReadonlyArray<CategoryWhereUniqueInput> | CategoryWhereUniqueInput | null
  readonly set?: ReadonlyArray<CategoryWhereUniqueInput> | CategoryWhereUniqueInput | null
}

export type ProductFillingRelateToManyForCreateInput = {
  readonly create?: ReadonlyArray<ProductFillingCreateInput> | ProductFillingCreateInput | null
  readonly connect?: ReadonlyArray<ProductFillingWhereUniqueInput> | ProductFillingWhereUniqueInput | null
  readonly set?: ReadonlyArray<ProductFillingWhereUniqueInput> | ProductFillingWhereUniqueInput | null
}

export type MixBoxProductRelateToOneForCreateInput = {
  readonly create?: MixBoxProductCreateInput | null
  readonly connect?: MixBoxProductWhereUniqueInput | null
}

export type ProductImageRelateToManyForCreateInput = {
  readonly create?: ReadonlyArray<ProductImageCreateInput> | ProductImageCreateInput | null
  readonly connect?: ReadonlyArray<ProductImageWhereUniqueInput> | ProductImageWhereUniqueInput | null
  readonly set?: ReadonlyArray<ProductImageWhereUniqueInput> | ProductImageWhereUniqueInput | null
}

export type ProductVideoRelateToOneForCreateInput = {
  readonly create?: ProductVideoCreateInput | null
  readonly connect?: ProductVideoWhereUniqueInput | null
}

export type CustomizationOptionRelateToManyForCreateInput = {
  readonly create?: ReadonlyArray<CustomizationOptionCreateInput> | CustomizationOptionCreateInput | null
  readonly connect?: ReadonlyArray<CustomizationOptionWhereUniqueInput> | CustomizationOptionWhereUniqueInput | null
  readonly set?: ReadonlyArray<CustomizationOptionWhereUniqueInput> | CustomizationOptionWhereUniqueInput | null
}

export type ToppingRelateToOneForCreateInput = {
  readonly create?: ToppingCreateInput | null
  readonly connect?: ToppingWhereUniqueInput | null
}

export type ImageExtension =
  | 'jpg'
  | 'png'
  | 'webp'
  | 'gif'

export type ProductFillingWhereUniqueInput = {
  readonly id?: string | null
  readonly slug?: string | null
}

export type ProductFillingWhereInput = {
  readonly AND?: ReadonlyArray<ProductFillingWhereInput> | ProductFillingWhereInput | null
  readonly OR?: ReadonlyArray<ProductFillingWhereInput> | ProductFillingWhereInput | null
  readonly NOT?: ReadonlyArray<ProductFillingWhereInput> | ProductFillingWhereInput | null
  readonly id?: IDFilter | null
  readonly products?: ProductManyRelationFilter | null
  readonly name?: StringFilter | null
  readonly slug?: StringFilter | null
  readonly hasDetails?: BooleanFilter | null
  readonly description?: StringFilter | null
  readonly carbonhydrate?: DecimalNullableFilter | null
  readonly calories?: DecimalNullableFilter | null
  readonly protein?: DecimalNullableFilter | null
  readonly fat?: DecimalNullableFilter | null
  readonly ingredients?: StringFilter | null
  readonly variants?: ProductVariantManyRelationFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type ProductManyRelationFilter = {
  readonly every?: ProductWhereInput | null
  readonly some?: ProductWhereInput | null
  readonly none?: ProductWhereInput | null
}

export type DecimalNullableFilter = {
  readonly equals?: import('@keystone-6/core/types').Decimal | string | null
  readonly in?: ReadonlyArray<import('@keystone-6/core/types').Decimal | string> | import('@keystone-6/core/types').Decimal | string | null
  readonly notIn?: ReadonlyArray<import('@keystone-6/core/types').Decimal | string> | import('@keystone-6/core/types').Decimal | string | null
  readonly lt?: import('@keystone-6/core/types').Decimal | string | null
  readonly lte?: import('@keystone-6/core/types').Decimal | string | null
  readonly gt?: import('@keystone-6/core/types').Decimal | string | null
  readonly gte?: import('@keystone-6/core/types').Decimal | string | null
  readonly not?: DecimalNullableFilter | null
}

export type ProductVariantManyRelationFilter = {
  readonly every?: ProductVariantWhereInput | null
  readonly some?: ProductVariantWhereInput | null
  readonly none?: ProductVariantWhereInput | null
}

export type ProductFillingOrderByInput = {
  readonly id?: OrderDirection | null
  readonly name?: OrderDirection | null
  readonly slug?: OrderDirection | null
  readonly hasDetails?: OrderDirection | null
  readonly description?: OrderDirection | null
  readonly carbonhydrate?: OrderDirection | null
  readonly calories?: OrderDirection | null
  readonly protein?: OrderDirection | null
  readonly fat?: OrderDirection | null
  readonly ingredients?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type ProductFillingUpdateInput = {
  readonly products?: ProductRelateToManyForUpdateInput | null
  readonly name?: string | null
  readonly slug?: string | null
  readonly hasDetails?: boolean | null
  readonly description?: string | null
  readonly carbonhydrate?: import('@keystone-6/core/types').Decimal | string | null
  readonly calories?: import('@keystone-6/core/types').Decimal | string | null
  readonly protein?: import('@keystone-6/core/types').Decimal | string | null
  readonly fat?: import('@keystone-6/core/types').Decimal | string | null
  readonly ingredients?: string | null
  readonly image_icon?: ImageFieldInput | null
  readonly variants?: ProductVariantRelateToManyForUpdateInput | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type ProductRelateToManyForUpdateInput = {
  readonly disconnect?: ReadonlyArray<ProductWhereUniqueInput> | ProductWhereUniqueInput | null
  readonly set?: ReadonlyArray<ProductWhereUniqueInput> | ProductWhereUniqueInput | null
  readonly create?: ReadonlyArray<ProductCreateInput> | ProductCreateInput | null
  readonly connect?: ReadonlyArray<ProductWhereUniqueInput> | ProductWhereUniqueInput | null
}

export type ImageFieldInput = {
  readonly upload: any
}

export type ProductVariantRelateToManyForUpdateInput = {
  readonly disconnect?: ReadonlyArray<ProductVariantWhereUniqueInput> | ProductVariantWhereUniqueInput | null
  readonly set?: ReadonlyArray<ProductVariantWhereUniqueInput> | ProductVariantWhereUniqueInput | null
  readonly create?: ReadonlyArray<ProductVariantCreateInput> | ProductVariantCreateInput | null
  readonly connect?: ReadonlyArray<ProductVariantWhereUniqueInput> | ProductVariantWhereUniqueInput | null
}

export type ProductFillingUpdateArgs = {
  readonly where: ProductFillingWhereUniqueInput
  readonly data: ProductFillingUpdateInput
}

export type ProductFillingCreateInput = {
  readonly products?: ProductRelateToManyForCreateInput | null
  readonly name?: string | null
  readonly slug?: string | null
  readonly hasDetails?: boolean | null
  readonly description?: string | null
  readonly carbonhydrate?: import('@keystone-6/core/types').Decimal | string | null
  readonly calories?: import('@keystone-6/core/types').Decimal | string | null
  readonly protein?: import('@keystone-6/core/types').Decimal | string | null
  readonly fat?: import('@keystone-6/core/types').Decimal | string | null
  readonly ingredients?: string | null
  readonly image_icon?: ImageFieldInput | null
  readonly variants?: ProductVariantRelateToManyForCreateInput | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type ProductRelateToManyForCreateInput = {
  readonly create?: ReadonlyArray<ProductCreateInput> | ProductCreateInput | null
  readonly connect?: ReadonlyArray<ProductWhereUniqueInput> | ProductWhereUniqueInput | null
  readonly set?: ReadonlyArray<ProductWhereUniqueInput> | ProductWhereUniqueInput | null
}

export type ProductVariantRelateToManyForCreateInput = {
  readonly create?: ReadonlyArray<ProductVariantCreateInput> | ProductVariantCreateInput | null
  readonly connect?: ReadonlyArray<ProductVariantWhereUniqueInput> | ProductVariantWhereUniqueInput | null
  readonly set?: ReadonlyArray<ProductVariantWhereUniqueInput> | ProductVariantWhereUniqueInput | null
}

export type ProductImageWhereUniqueInput = {
  readonly id?: string | null
}

export type ProductImageWhereInput = {
  readonly AND?: ReadonlyArray<ProductImageWhereInput> | ProductImageWhereInput | null
  readonly OR?: ReadonlyArray<ProductImageWhereInput> | ProductImageWhereInput | null
  readonly NOT?: ReadonlyArray<ProductImageWhereInput> | ProductImageWhereInput | null
  readonly id?: IDFilter | null
  readonly product?: ProductWhereInput | null
  readonly altText?: StringFilter | null
  readonly isMain?: BooleanFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type ProductImageOrderByInput = {
  readonly id?: OrderDirection | null
  readonly altText?: OrderDirection | null
  readonly isMain?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type ProductImageUpdateInput = {
  readonly product?: ProductRelateToOneForUpdateInput | null
  readonly image?: ImageFieldInput | null
  readonly altText?: string | null
  readonly isMain?: boolean | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type ProductRelateToOneForUpdateInput = {
  readonly create?: ProductCreateInput | null
  readonly connect?: ProductWhereUniqueInput | null
  readonly disconnect?: boolean | null
}

export type ProductImageUpdateArgs = {
  readonly where: ProductImageWhereUniqueInput
  readonly data: ProductImageUpdateInput
}

export type ProductImageCreateInput = {
  readonly product?: ProductRelateToOneForCreateInput | null
  readonly image?: ImageFieldInput | null
  readonly altText?: string | null
  readonly isMain?: boolean | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type ProductRelateToOneForCreateInput = {
  readonly create?: ProductCreateInput | null
  readonly connect?: ProductWhereUniqueInput | null
}

export type ProductVariantWhereUniqueInput = {
  readonly id?: string | null
}

export type ProductVariantWhereInput = {
  readonly AND?: ReadonlyArray<ProductVariantWhereInput> | ProductVariantWhereInput | null
  readonly OR?: ReadonlyArray<ProductVariantWhereInput> | ProductVariantWhereInput | null
  readonly NOT?: ReadonlyArray<ProductVariantWhereInput> | ProductVariantWhereInput | null
  readonly id?: IDFilter | null
  readonly filling?: ProductFillingWhereInput | null
  readonly weight?: DecimalNullableFilter | null
  readonly pieces?: IntNullableFilter | null
  readonly size?: IntNullableFilter | null
  readonly price?: IntFilter | null
  readonly serving?: IntNullableFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type IntFilter = {
  readonly equals?: number | null
  readonly in?: ReadonlyArray<number> | number | null
  readonly notIn?: ReadonlyArray<number> | number | null
  readonly lt?: number | null
  readonly lte?: number | null
  readonly gt?: number | null
  readonly gte?: number | null
  readonly not?: IntFilter | null
}

export type ProductVariantOrderByInput = {
  readonly id?: OrderDirection | null
  readonly weight?: OrderDirection | null
  readonly pieces?: OrderDirection | null
  readonly size?: OrderDirection | null
  readonly price?: OrderDirection | null
  readonly serving?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type ProductVariantUpdateInput = {
  readonly filling?: ProductFillingRelateToOneForUpdateInput | null
  readonly weight?: import('@keystone-6/core/types').Decimal | string | null
  readonly pieces?: number | null
  readonly size?: number | null
  readonly price?: number | null
  readonly serving?: number | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type ProductFillingRelateToOneForUpdateInput = {
  readonly create?: ProductFillingCreateInput | null
  readonly connect?: ProductFillingWhereUniqueInput | null
  readonly disconnect?: boolean | null
}

export type ProductVariantUpdateArgs = {
  readonly where: ProductVariantWhereUniqueInput
  readonly data: ProductVariantUpdateInput
}

export type ProductVariantCreateInput = {
  readonly filling?: ProductFillingRelateToOneForCreateInput | null
  readonly weight?: import('@keystone-6/core/types').Decimal | string | null
  readonly pieces?: number | null
  readonly size?: number | null
  readonly price?: number | null
  readonly serving?: number | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type ProductFillingRelateToOneForCreateInput = {
  readonly create?: ProductFillingCreateInput | null
  readonly connect?: ProductFillingWhereUniqueInput | null
}

export type CategoryWhereUniqueInput = {
  readonly id?: string | null
  readonly slug?: string | null
}

export type CategoryWhereInput = {
  readonly AND?: ReadonlyArray<CategoryWhereInput> | CategoryWhereInput | null
  readonly OR?: ReadonlyArray<CategoryWhereInput> | CategoryWhereInput | null
  readonly NOT?: ReadonlyArray<CategoryWhereInput> | CategoryWhereInput | null
  readonly id?: IDFilter | null
  readonly name?: StringFilter | null
  readonly slug?: StringFilter | null
  readonly parent?: CategoryWhereInput | null
  readonly isAvailable?: BooleanFilter | null
  readonly products?: ProductManyRelationFilter | null
  readonly priority?: IntNullableFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type CategoryOrderByInput = {
  readonly id?: OrderDirection | null
  readonly name?: OrderDirection | null
  readonly slug?: OrderDirection | null
  readonly isAvailable?: OrderDirection | null
  readonly priority?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type CategoryUpdateInput = {
  readonly name?: string | null
  readonly slug?: string | null
  readonly parent?: CategoryRelateToOneForUpdateInput | null
  readonly isAvailable?: boolean | null
  readonly products?: ProductRelateToManyForUpdateInput | null
  readonly priority?: number | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type CategoryRelateToOneForUpdateInput = {
  readonly create?: CategoryCreateInput | null
  readonly connect?: CategoryWhereUniqueInput | null
  readonly disconnect?: boolean | null
}

export type CategoryUpdateArgs = {
  readonly where: CategoryWhereUniqueInput
  readonly data: CategoryUpdateInput
}

export type CategoryCreateInput = {
  readonly name?: string | null
  readonly slug?: string | null
  readonly parent?: CategoryRelateToOneForCreateInput | null
  readonly isAvailable?: boolean | null
  readonly products?: ProductRelateToManyForCreateInput | null
  readonly priority?: number | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type CategoryRelateToOneForCreateInput = {
  readonly create?: CategoryCreateInput | null
  readonly connect?: CategoryWhereUniqueInput | null
}

export type CustomizationOptionWhereUniqueInput = {
  readonly id?: string | null
  readonly slug?: string | null
}

export type CustomizationOptionWhereInput = {
  readonly AND?: ReadonlyArray<CustomizationOptionWhereInput> | CustomizationOptionWhereInput | null
  readonly OR?: ReadonlyArray<CustomizationOptionWhereInput> | CustomizationOptionWhereInput | null
  readonly NOT?: ReadonlyArray<CustomizationOptionWhereInput> | CustomizationOptionWhereInput | null
  readonly id?: IDFilter | null
  readonly product?: ProductManyRelationFilter | null
  readonly name?: StringNullableFilter | null
  readonly slug?: StringFilter | null
  readonly customValues?: CustomizationOptionValueManyRelationFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type CustomizationOptionValueManyRelationFilter = {
  readonly every?: CustomizationOptionValueWhereInput | null
  readonly some?: CustomizationOptionValueWhereInput | null
  readonly none?: CustomizationOptionValueWhereInput | null
}

export type CustomizationOptionOrderByInput = {
  readonly id?: OrderDirection | null
  readonly name?: OrderDirection | null
  readonly slug?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type CustomizationOptionUpdateInput = {
  readonly product?: ProductRelateToManyForUpdateInput | null
  readonly name?: string | null
  readonly slug?: string | null
  readonly customValues?: CustomizationOptionValueRelateToManyForUpdateInput | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type CustomizationOptionValueRelateToManyForUpdateInput = {
  readonly disconnect?: ReadonlyArray<CustomizationOptionValueWhereUniqueInput> | CustomizationOptionValueWhereUniqueInput | null
  readonly set?: ReadonlyArray<CustomizationOptionValueWhereUniqueInput> | CustomizationOptionValueWhereUniqueInput | null
  readonly create?: ReadonlyArray<CustomizationOptionValueCreateInput> | CustomizationOptionValueCreateInput | null
  readonly connect?: ReadonlyArray<CustomizationOptionValueWhereUniqueInput> | CustomizationOptionValueWhereUniqueInput | null
}

export type CustomizationOptionUpdateArgs = {
  readonly where: CustomizationOptionWhereUniqueInput
  readonly data: CustomizationOptionUpdateInput
}

export type CustomizationOptionCreateInput = {
  readonly product?: ProductRelateToManyForCreateInput | null
  readonly name?: string | null
  readonly slug?: string | null
  readonly customValues?: CustomizationOptionValueRelateToManyForCreateInput | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type CustomizationOptionValueRelateToManyForCreateInput = {
  readonly create?: ReadonlyArray<CustomizationOptionValueCreateInput> | CustomizationOptionValueCreateInput | null
  readonly connect?: ReadonlyArray<CustomizationOptionValueWhereUniqueInput> | CustomizationOptionValueWhereUniqueInput | null
  readonly set?: ReadonlyArray<CustomizationOptionValueWhereUniqueInput> | CustomizationOptionValueWhereUniqueInput | null
}

export type CustomizationOptionValueWhereUniqueInput = {
  readonly id?: string | null
}

export type CustomizationOptionValueWhereInput = {
  readonly AND?: ReadonlyArray<CustomizationOptionValueWhereInput> | CustomizationOptionValueWhereInput | null
  readonly OR?: ReadonlyArray<CustomizationOptionValueWhereInput> | CustomizationOptionValueWhereInput | null
  readonly NOT?: ReadonlyArray<CustomizationOptionValueWhereInput> | CustomizationOptionValueWhereInput | null
  readonly id?: IDFilter | null
  readonly option?: CustomizationOptionWhereInput | null
  readonly value?: StringFilter | null
  readonly extraPrice?: IntNullableFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type CustomizationOptionValueOrderByInput = {
  readonly id?: OrderDirection | null
  readonly value?: OrderDirection | null
  readonly extraPrice?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type CustomizationOptionValueUpdateInput = {
  readonly option?: CustomizationOptionRelateToOneForUpdateInput | null
  readonly value?: string | null
  readonly extraPrice?: number | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type CustomizationOptionRelateToOneForUpdateInput = {
  readonly create?: CustomizationOptionCreateInput | null
  readonly connect?: CustomizationOptionWhereUniqueInput | null
  readonly disconnect?: boolean | null
}

export type CustomizationOptionValueUpdateArgs = {
  readonly where: CustomizationOptionValueWhereUniqueInput
  readonly data: CustomizationOptionValueUpdateInput
}

export type CustomizationOptionValueCreateInput = {
  readonly option?: CustomizationOptionRelateToOneForCreateInput | null
  readonly value?: string | null
  readonly extraPrice?: number | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type CustomizationOptionRelateToOneForCreateInput = {
  readonly create?: CustomizationOptionCreateInput | null
  readonly connect?: CustomizationOptionWhereUniqueInput | null
}

export type ToppingWhereUniqueInput = {
  readonly id?: string | null
  readonly name?: string | null
  readonly slug?: string | null
}

export type ToppingWhereInput = {
  readonly AND?: ReadonlyArray<ToppingWhereInput> | ToppingWhereInput | null
  readonly OR?: ReadonlyArray<ToppingWhereInput> | ToppingWhereInput | null
  readonly NOT?: ReadonlyArray<ToppingWhereInput> | ToppingWhereInput | null
  readonly id?: IDFilter | null
  readonly products?: ProductManyRelationFilter | null
  readonly name?: StringFilter | null
  readonly slug?: StringFilter | null
  readonly options?: ToppingOptionManyRelationFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type ToppingOptionManyRelationFilter = {
  readonly every?: ToppingOptionWhereInput | null
  readonly some?: ToppingOptionWhereInput | null
  readonly none?: ToppingOptionWhereInput | null
}

export type ToppingOrderByInput = {
  readonly id?: OrderDirection | null
  readonly name?: OrderDirection | null
  readonly slug?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type ToppingUpdateInput = {
  readonly products?: ProductRelateToManyForUpdateInput | null
  readonly name?: string | null
  readonly slug?: string | null
  readonly options?: ToppingOptionRelateToManyForUpdateInput | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type ToppingOptionRelateToManyForUpdateInput = {
  readonly disconnect?: ReadonlyArray<ToppingOptionWhereUniqueInput> | ToppingOptionWhereUniqueInput | null
  readonly set?: ReadonlyArray<ToppingOptionWhereUniqueInput> | ToppingOptionWhereUniqueInput | null
  readonly create?: ReadonlyArray<ToppingOptionCreateInput> | ToppingOptionCreateInput | null
  readonly connect?: ReadonlyArray<ToppingOptionWhereUniqueInput> | ToppingOptionWhereUniqueInput | null
}

export type ToppingUpdateArgs = {
  readonly where: ToppingWhereUniqueInput
  readonly data: ToppingUpdateInput
}

export type ToppingCreateInput = {
  readonly products?: ProductRelateToManyForCreateInput | null
  readonly name?: string | null
  readonly slug?: string | null
  readonly options?: ToppingOptionRelateToManyForCreateInput | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type ToppingOptionRelateToManyForCreateInput = {
  readonly create?: ReadonlyArray<ToppingOptionCreateInput> | ToppingOptionCreateInput | null
  readonly connect?: ReadonlyArray<ToppingOptionWhereUniqueInput> | ToppingOptionWhereUniqueInput | null
  readonly set?: ReadonlyArray<ToppingOptionWhereUniqueInput> | ToppingOptionWhereUniqueInput | null
}

export type ToppingOptionWhereUniqueInput = {
  readonly id?: string | null
}

export type ToppingOptionWhereInput = {
  readonly AND?: ReadonlyArray<ToppingOptionWhereInput> | ToppingOptionWhereInput | null
  readonly OR?: ReadonlyArray<ToppingOptionWhereInput> | ToppingOptionWhereInput | null
  readonly NOT?: ReadonlyArray<ToppingOptionWhereInput> | ToppingOptionWhereInput | null
  readonly id?: IDFilter | null
  readonly topping?: ToppingWhereInput | null
  readonly weight?: DecimalNullableFilter | null
  readonly pieces?: IntNullableFilter | null
  readonly extraPrice?: IntFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type ToppingOptionOrderByInput = {
  readonly id?: OrderDirection | null
  readonly weight?: OrderDirection | null
  readonly pieces?: OrderDirection | null
  readonly extraPrice?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type ToppingOptionUpdateInput = {
  readonly topping?: ToppingRelateToOneForUpdateInput | null
  readonly weight?: import('@keystone-6/core/types').Decimal | string | null
  readonly pieces?: number | null
  readonly extraPrice?: number | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type ToppingOptionUpdateArgs = {
  readonly where: ToppingOptionWhereUniqueInput
  readonly data: ToppingOptionUpdateInput
}

export type ToppingOptionCreateInput = {
  readonly topping?: ToppingRelateToOneForCreateInput | null
  readonly weight?: import('@keystone-6/core/types').Decimal | string | null
  readonly pieces?: number | null
  readonly extraPrice?: number | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type CartWhereUniqueInput = {
  readonly id?: string | null
  readonly sessionId?: string | null
  readonly user?: UserWhereUniqueInput | null
}

export type CartWhereInput = {
  readonly AND?: ReadonlyArray<CartWhereInput> | CartWhereInput | null
  readonly OR?: ReadonlyArray<CartWhereInput> | CartWhereInput | null
  readonly NOT?: ReadonlyArray<CartWhereInput> | CartWhereInput | null
  readonly id?: IDFilter | null
  readonly sessionId?: StringNullableFilter | null
  readonly user?: UserWhereInput | null
  readonly cartItems?: CartItemManyRelationFilter | null
  readonly subTotal?: IntNullableFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type CartItemManyRelationFilter = {
  readonly every?: CartItemWhereInput | null
  readonly some?: CartItemWhereInput | null
  readonly none?: CartItemWhereInput | null
}

export type CartOrderByInput = {
  readonly id?: OrderDirection | null
  readonly sessionId?: OrderDirection | null
  readonly subTotal?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type CartUpdateInput = {
  readonly sessionId?: string | null
  readonly user?: UserRelateToOneForUpdateInput | null
  readonly cartItems?: CartItemRelateToManyForUpdateInput | null
  readonly subTotal?: number | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type CartItemRelateToManyForUpdateInput = {
  readonly disconnect?: ReadonlyArray<CartItemWhereUniqueInput> | CartItemWhereUniqueInput | null
  readonly set?: ReadonlyArray<CartItemWhereUniqueInput> | CartItemWhereUniqueInput | null
  readonly create?: ReadonlyArray<CartItemCreateInput> | CartItemCreateInput | null
  readonly connect?: ReadonlyArray<CartItemWhereUniqueInput> | CartItemWhereUniqueInput | null
}

export type CartUpdateArgs = {
  readonly where: CartWhereUniqueInput
  readonly data: CartUpdateInput
}

export type CartCreateInput = {
  readonly sessionId?: string | null
  readonly user?: UserRelateToOneForCreateInput | null
  readonly cartItems?: CartItemRelateToManyForCreateInput | null
  readonly subTotal?: number | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type CartItemRelateToManyForCreateInput = {
  readonly create?: ReadonlyArray<CartItemCreateInput> | CartItemCreateInput | null
  readonly connect?: ReadonlyArray<CartItemWhereUniqueInput> | CartItemWhereUniqueInput | null
  readonly set?: ReadonlyArray<CartItemWhereUniqueInput> | CartItemWhereUniqueInput | null
}

export type CartItemWhereUniqueInput = {
  readonly id?: string | null
}

export type CartItemWhereInput = {
  readonly AND?: ReadonlyArray<CartItemWhereInput> | CartItemWhereInput | null
  readonly OR?: ReadonlyArray<CartItemWhereInput> | CartItemWhereInput | null
  readonly NOT?: ReadonlyArray<CartItemWhereInput> | CartItemWhereInput | null
  readonly id?: IDFilter | null
  readonly cart?: CartWhereInput | null
  readonly product?: ProductWhereInput | null
  readonly variant?: ProductVariantWhereInput | null
  readonly toppingOption?: ToppingOptionWhereInput | null
  readonly quantity?: IntNullableFilter | null
  readonly unitPrice?: IntNullableFilter | null
  readonly subTotal?: IntNullableFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type CartItemOrderByInput = {
  readonly id?: OrderDirection | null
  readonly quantity?: OrderDirection | null
  readonly unitPrice?: OrderDirection | null
  readonly subTotal?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type CartItemUpdateInput = {
  readonly cart?: CartRelateToOneForUpdateInput | null
  readonly product?: ProductRelateToOneForUpdateInput | null
  readonly variant?: ProductVariantRelateToOneForUpdateInput | null
  readonly toppingOption?: ToppingOptionRelateToOneForUpdateInput | null
  readonly compositions?: import('@keystone-6/core/types').JSONValue | null
  readonly customizations?: import('@keystone-6/core/types').JSONValue | null
  readonly quantity?: number | null
  readonly unitPrice?: number | null
  readonly subTotal?: number | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type ProductVariantRelateToOneForUpdateInput = {
  readonly create?: ProductVariantCreateInput | null
  readonly connect?: ProductVariantWhereUniqueInput | null
  readonly disconnect?: boolean | null
}

export type ToppingOptionRelateToOneForUpdateInput = {
  readonly create?: ToppingOptionCreateInput | null
  readonly connect?: ToppingOptionWhereUniqueInput | null
  readonly disconnect?: boolean | null
}

export type CartItemUpdateArgs = {
  readonly where: CartItemWhereUniqueInput
  readonly data: CartItemUpdateInput
}

export type CartItemCreateInput = {
  readonly cart?: CartRelateToOneForCreateInput | null
  readonly product?: ProductRelateToOneForCreateInput | null
  readonly variant?: ProductVariantRelateToOneForCreateInput | null
  readonly toppingOption?: ToppingOptionRelateToOneForCreateInput | null
  readonly compositions?: import('@keystone-6/core/types').JSONValue | null
  readonly customizations?: import('@keystone-6/core/types').JSONValue | null
  readonly quantity?: number | null
  readonly unitPrice?: number | null
  readonly subTotal?: number | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type ProductVariantRelateToOneForCreateInput = {
  readonly create?: ProductVariantCreateInput | null
  readonly connect?: ProductVariantWhereUniqueInput | null
}

export type ToppingOptionRelateToOneForCreateInput = {
  readonly create?: ToppingOptionCreateInput | null
  readonly connect?: ToppingOptionWhereUniqueInput | null
}

export type OrderWhereUniqueInput = {
  readonly id?: string | null
  readonly orderIntent?: OrderIntentWhereUniqueInput | null
  readonly orderReceiver?: OrderReceiverWhereUniqueInput | null
  readonly orderNumber?: string | null
  readonly payment?: PaymentWhereUniqueInput | null
}

export type OrderWhereInput = {
  readonly AND?: ReadonlyArray<OrderWhereInput> | OrderWhereInput | null
  readonly OR?: ReadonlyArray<OrderWhereInput> | OrderWhereInput | null
  readonly NOT?: ReadonlyArray<OrderWhereInput> | OrderWhereInput | null
  readonly id?: IDFilter | null
  readonly orderIntent?: OrderIntentWhereInput | null
  readonly user?: UserWhereInput | null
  readonly orderReceiver?: OrderReceiverWhereInput | null
  readonly orderItems?: OrderItemManyRelationFilter | null
  readonly orderNumber?: StringFilter | null
  readonly shippingCost?: IntNullableFilter | null
  readonly subTotalAmount?: IntNullableFilter | null
  readonly totalAmount?: IntNullableFilter | null
  readonly status?: StringNullableFilter | null
  readonly payment?: PaymentWhereInput | null
  readonly deliveryOption?: StringFilter | null
  readonly deliveryDate?: DateTimeNullableFilter | null
  readonly deliveryAddress?: DelivaryAddressWhereInput | null
  readonly note?: StringFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type OrderItemManyRelationFilter = {
  readonly every?: OrderItemWhereInput | null
  readonly some?: OrderItemWhereInput | null
  readonly none?: OrderItemWhereInput | null
}

export type OrderOrderByInput = {
  readonly id?: OrderDirection | null
  readonly orderNumber?: OrderDirection | null
  readonly shippingCost?: OrderDirection | null
  readonly subTotalAmount?: OrderDirection | null
  readonly totalAmount?: OrderDirection | null
  readonly status?: OrderDirection | null
  readonly deliveryOption?: OrderDirection | null
  readonly deliveryDate?: OrderDirection | null
  readonly note?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type OrderUpdateInput = {
  readonly orderIntent?: OrderIntentRelateToOneForUpdateInput | null
  readonly user?: UserRelateToOneForUpdateInput | null
  readonly orderReceiver?: OrderReceiverRelateToOneForUpdateInput | null
  readonly orderItems?: OrderItemRelateToManyForUpdateInput | null
  readonly orderNumber?: string | null
  readonly shippingCost?: number | null
  readonly subTotalAmount?: number | null
  readonly totalAmount?: number | null
  readonly status?: string | null
  readonly payment?: PaymentRelateToOneForUpdateInput | null
  readonly deliveryOption?: string | null
  readonly deliveryDate?: any | null
  readonly deliveryAddress?: DelivaryAddressRelateToOneForUpdateInput | null
  readonly note?: string | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type OrderIntentRelateToOneForUpdateInput = {
  readonly create?: OrderIntentCreateInput | null
  readonly connect?: OrderIntentWhereUniqueInput | null
  readonly disconnect?: boolean | null
}

export type OrderReceiverRelateToOneForUpdateInput = {
  readonly create?: OrderReceiverCreateInput | null
  readonly connect?: OrderReceiverWhereUniqueInput | null
  readonly disconnect?: boolean | null
}

export type OrderItemRelateToManyForUpdateInput = {
  readonly disconnect?: ReadonlyArray<OrderItemWhereUniqueInput> | OrderItemWhereUniqueInput | null
  readonly set?: ReadonlyArray<OrderItemWhereUniqueInput> | OrderItemWhereUniqueInput | null
  readonly create?: ReadonlyArray<OrderItemCreateInput> | OrderItemCreateInput | null
  readonly connect?: ReadonlyArray<OrderItemWhereUniqueInput> | OrderItemWhereUniqueInput | null
}

export type PaymentRelateToOneForUpdateInput = {
  readonly create?: PaymentCreateInput | null
  readonly connect?: PaymentWhereUniqueInput | null
  readonly disconnect?: boolean | null
}

export type OrderUpdateArgs = {
  readonly where: OrderWhereUniqueInput
  readonly data: OrderUpdateInput
}

export type OrderCreateInput = {
  readonly orderIntent?: OrderIntentRelateToOneForCreateInput | null
  readonly user?: UserRelateToOneForCreateInput | null
  readonly orderReceiver?: OrderReceiverRelateToOneForCreateInput | null
  readonly orderItems?: OrderItemRelateToManyForCreateInput | null
  readonly orderNumber?: string | null
  readonly shippingCost?: number | null
  readonly subTotalAmount?: number | null
  readonly totalAmount?: number | null
  readonly status?: string | null
  readonly payment?: PaymentRelateToOneForCreateInput | null
  readonly deliveryOption?: string | null
  readonly deliveryDate?: any | null
  readonly deliveryAddress?: DelivaryAddressRelateToOneForCreateInput | null
  readonly note?: string | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type OrderIntentRelateToOneForCreateInput = {
  readonly create?: OrderIntentCreateInput | null
  readonly connect?: OrderIntentWhereUniqueInput | null
}

export type OrderReceiverRelateToOneForCreateInput = {
  readonly create?: OrderReceiverCreateInput | null
  readonly connect?: OrderReceiverWhereUniqueInput | null
}

export type OrderItemRelateToManyForCreateInput = {
  readonly create?: ReadonlyArray<OrderItemCreateInput> | OrderItemCreateInput | null
  readonly connect?: ReadonlyArray<OrderItemWhereUniqueInput> | OrderItemWhereUniqueInput | null
  readonly set?: ReadonlyArray<OrderItemWhereUniqueInput> | OrderItemWhereUniqueInput | null
}

export type PaymentRelateToOneForCreateInput = {
  readonly create?: PaymentCreateInput | null
  readonly connect?: PaymentWhereUniqueInput | null
}

export type OrderReceiverWhereUniqueInput = {
  readonly id?: string | null
  readonly order?: OrderWhereUniqueInput | null
}

export type OrderReceiverWhereInput = {
  readonly AND?: ReadonlyArray<OrderReceiverWhereInput> | OrderReceiverWhereInput | null
  readonly OR?: ReadonlyArray<OrderReceiverWhereInput> | OrderReceiverWhereInput | null
  readonly NOT?: ReadonlyArray<OrderReceiverWhereInput> | OrderReceiverWhereInput | null
  readonly id?: IDFilter | null
  readonly benefactor?: UserWhereInput | null
  readonly order?: OrderWhereInput | null
  readonly name?: StringFilter | null
  readonly phoneNumber?: StringFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type OrderReceiverOrderByInput = {
  readonly id?: OrderDirection | null
  readonly name?: OrderDirection | null
  readonly phoneNumber?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type OrderReceiverUpdateInput = {
  readonly benefactor?: UserRelateToOneForUpdateInput | null
  readonly order?: OrderRelateToOneForUpdateInput | null
  readonly name?: string | null
  readonly phoneNumber?: string | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type OrderRelateToOneForUpdateInput = {
  readonly create?: OrderCreateInput | null
  readonly connect?: OrderWhereUniqueInput | null
  readonly disconnect?: boolean | null
}

export type OrderReceiverUpdateArgs = {
  readonly where: OrderReceiverWhereUniqueInput
  readonly data: OrderReceiverUpdateInput
}

export type OrderReceiverCreateInput = {
  readonly benefactor?: UserRelateToOneForCreateInput | null
  readonly order?: OrderRelateToOneForCreateInput | null
  readonly name?: string | null
  readonly phoneNumber?: string | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type OrderRelateToOneForCreateInput = {
  readonly create?: OrderCreateInput | null
  readonly connect?: OrderWhereUniqueInput | null
}

export type OrderItemWhereUniqueInput = {
  readonly id?: string | null
}

export type OrderItemWhereInput = {
  readonly AND?: ReadonlyArray<OrderItemWhereInput> | OrderItemWhereInput | null
  readonly OR?: ReadonlyArray<OrderItemWhereInput> | OrderItemWhereInput | null
  readonly NOT?: ReadonlyArray<OrderItemWhereInput> | OrderItemWhereInput | null
  readonly id?: IDFilter | null
  readonly order?: OrderWhereInput | null
  readonly product?: ProductWhereInput | null
  readonly variant?: ProductVariantWhereInput | null
  readonly toppingOption?: ToppingOptionWhereInput | null
  readonly quantity?: IntNullableFilter | null
  readonly unitPrice?: IntNullableFilter | null
  readonly subTotal?: IntNullableFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type OrderItemOrderByInput = {
  readonly id?: OrderDirection | null
  readonly quantity?: OrderDirection | null
  readonly unitPrice?: OrderDirection | null
  readonly subTotal?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type OrderItemUpdateInput = {
  readonly order?: OrderRelateToOneForUpdateInput | null
  readonly product?: ProductRelateToOneForUpdateInput | null
  readonly variant?: ProductVariantRelateToOneForUpdateInput | null
  readonly toppingOption?: ToppingOptionRelateToOneForUpdateInput | null
  readonly compositions?: import('@keystone-6/core/types').JSONValue | null
  readonly customizations?: import('@keystone-6/core/types').JSONValue | null
  readonly quantity?: number | null
  readonly unitPrice?: number | null
  readonly subTotal?: number | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type OrderItemUpdateArgs = {
  readonly where: OrderItemWhereUniqueInput
  readonly data: OrderItemUpdateInput
}

export type OrderItemCreateInput = {
  readonly order?: OrderRelateToOneForCreateInput | null
  readonly product?: ProductRelateToOneForCreateInput | null
  readonly variant?: ProductVariantRelateToOneForCreateInput | null
  readonly toppingOption?: ToppingOptionRelateToOneForCreateInput | null
  readonly compositions?: import('@keystone-6/core/types').JSONValue | null
  readonly customizations?: import('@keystone-6/core/types').JSONValue | null
  readonly quantity?: number | null
  readonly unitPrice?: number | null
  readonly subTotal?: number | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type PaymentWhereUniqueInput = {
  readonly id?: string | null
  readonly order?: OrderWhereUniqueInput | null
  readonly yooMoneyId?: string | null
}

export type PaymentWhereInput = {
  readonly AND?: ReadonlyArray<PaymentWhereInput> | PaymentWhereInput | null
  readonly OR?: ReadonlyArray<PaymentWhereInput> | PaymentWhereInput | null
  readonly NOT?: ReadonlyArray<PaymentWhereInput> | PaymentWhereInput | null
  readonly id?: IDFilter | null
  readonly user?: UserWhereInput | null
  readonly order?: OrderWhereInput | null
  readonly yooMoneyId?: StringFilter | null
  readonly redirectUrl?: StringFilter | null
  readonly confirmationUrl?: StringFilter | null
  readonly amount?: StringFilter | null
  readonly method?: StringFilter | null
  readonly status?: StringNullableFilter | null
  readonly paidAt?: DateTimeNullableFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type PaymentOrderByInput = {
  readonly id?: OrderDirection | null
  readonly yooMoneyId?: OrderDirection | null
  readonly redirectUrl?: OrderDirection | null
  readonly confirmationUrl?: OrderDirection | null
  readonly amount?: OrderDirection | null
  readonly method?: OrderDirection | null
  readonly status?: OrderDirection | null
  readonly paidAt?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type PaymentUpdateInput = {
  readonly user?: UserRelateToOneForUpdateInput | null
  readonly order?: OrderRelateToOneForUpdateInput | null
  readonly yooMoneyId?: string | null
  readonly redirectUrl?: string | null
  readonly confirmationUrl?: string | null
  readonly amount?: string | null
  readonly method?: string | null
  readonly status?: string | null
  readonly paidAt?: any | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type PaymentUpdateArgs = {
  readonly where: PaymentWhereUniqueInput
  readonly data: PaymentUpdateInput
}

export type PaymentCreateInput = {
  readonly user?: UserRelateToOneForCreateInput | null
  readonly order?: OrderRelateToOneForCreateInput | null
  readonly yooMoneyId?: string | null
  readonly redirectUrl?: string | null
  readonly confirmationUrl?: string | null
  readonly amount?: string | null
  readonly method?: string | null
  readonly status?: string | null
  readonly paidAt?: any | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type ProductHomeBannerWhereUniqueInput = {
  readonly id?: string | null
}

export type ProductHomeBannerWhereInput = {
  readonly AND?: ReadonlyArray<ProductHomeBannerWhereInput> | ProductHomeBannerWhereInput | null
  readonly OR?: ReadonlyArray<ProductHomeBannerWhereInput> | ProductHomeBannerWhereInput | null
  readonly NOT?: ReadonlyArray<ProductHomeBannerWhereInput> | ProductHomeBannerWhereInput | null
  readonly id?: IDFilter | null
  readonly product?: ProductWhereInput | null
  readonly bannerText?: StringFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type ProductHomeBannerOrderByInput = {
  readonly id?: OrderDirection | null
  readonly bannerText?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type ProductHomeBannerUpdateInput = {
  readonly product?: ProductRelateToOneForUpdateInput | null
  readonly bannerText?: string | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type ProductHomeBannerUpdateArgs = {
  readonly where: ProductHomeBannerWhereUniqueInput
  readonly data: ProductHomeBannerUpdateInput
}

export type ProductHomeBannerCreateInput = {
  readonly product?: ProductRelateToOneForCreateInput | null
  readonly bannerText?: string | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type CustomizeImageWhereUniqueInput = {
  readonly id?: string | null
}

export type CustomizeImageWhereInput = {
  readonly AND?: ReadonlyArray<CustomizeImageWhereInput> | CustomizeImageWhereInput | null
  readonly OR?: ReadonlyArray<CustomizeImageWhereInput> | CustomizeImageWhereInput | null
  readonly NOT?: ReadonlyArray<CustomizeImageWhereInput> | CustomizeImageWhereInput | null
  readonly id?: IDFilter | null
  readonly altText?: StringFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type CustomizeImageOrderByInput = {
  readonly id?: OrderDirection | null
  readonly altText?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type CustomizeImageUpdateInput = {
  readonly image?: ImageFieldInput | null
  readonly altText?: string | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type CustomizeImageUpdateArgs = {
  readonly where: CustomizeImageWhereUniqueInput
  readonly data: CustomizeImageUpdateInput
}

export type CustomizeImageCreateInput = {
  readonly image?: ImageFieldInput | null
  readonly altText?: string | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type FeaturedProductWhereUniqueInput = {
  readonly id?: string | null
}

export type FeaturedProductWhereInput = {
  readonly AND?: ReadonlyArray<FeaturedProductWhereInput> | FeaturedProductWhereInput | null
  readonly OR?: ReadonlyArray<FeaturedProductWhereInput> | FeaturedProductWhereInput | null
  readonly NOT?: ReadonlyArray<FeaturedProductWhereInput> | FeaturedProductWhereInput | null
  readonly id?: IDFilter | null
  readonly products?: ProductManyRelationFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type FeaturedProductOrderByInput = {
  readonly id?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type FeaturedProductUpdateInput = {
  readonly products?: ProductRelateToManyForUpdateInput | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type FeaturedProductUpdateArgs = {
  readonly where: FeaturedProductWhereUniqueInput
  readonly data: FeaturedProductUpdateInput
}

export type FeaturedProductCreateInput = {
  readonly products?: ProductRelateToManyForCreateInput | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type OrderIntentWhereUniqueInput = {
  readonly id?: string | null
  readonly intentId?: string | null
  readonly yooMoneyId?: string | null
  readonly order?: OrderWhereUniqueInput | null
}

export type OrderIntentWhereInput = {
  readonly AND?: ReadonlyArray<OrderIntentWhereInput> | OrderIntentWhereInput | null
  readonly OR?: ReadonlyArray<OrderIntentWhereInput> | OrderIntentWhereInput | null
  readonly NOT?: ReadonlyArray<OrderIntentWhereInput> | OrderIntentWhereInput | null
  readonly id?: IDFilter | null
  readonly intentId?: StringFilter | null
  readonly yooMoneyId?: StringFilter | null
  readonly paymentId?: StringFilter | null
  readonly cart?: CartWhereInput | null
  readonly user?: UserWhereInput | null
  readonly orderReceiver?: OrderReceiverWhereInput | null
  readonly deliveryAddress?: DelivaryAddressWhereInput | null
  readonly deliveryOption?: StringFilter | null
  readonly deliveryDate?: DateTimeNullableFilter | null
  readonly note?: StringFilter | null
  readonly paymentStatus?: StringNullableFilter | null
  readonly shippingCost?: IntNullableFilter | null
  readonly totalAmount?: IntNullableFilter | null
  readonly order?: OrderWhereInput | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type OrderIntentOrderByInput = {
  readonly id?: OrderDirection | null
  readonly intentId?: OrderDirection | null
  readonly yooMoneyId?: OrderDirection | null
  readonly paymentId?: OrderDirection | null
  readonly deliveryOption?: OrderDirection | null
  readonly deliveryDate?: OrderDirection | null
  readonly note?: OrderDirection | null
  readonly paymentStatus?: OrderDirection | null
  readonly shippingCost?: OrderDirection | null
  readonly totalAmount?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type OrderIntentUpdateInput = {
  readonly intentId?: string | null
  readonly yooMoneyId?: string | null
  readonly paymentId?: string | null
  readonly cart?: CartRelateToOneForUpdateInput | null
  readonly user?: UserRelateToOneForUpdateInput | null
  readonly orderReceiver?: OrderReceiverRelateToOneForUpdateInput | null
  readonly deliveryAddress?: DelivaryAddressRelateToOneForUpdateInput | null
  readonly deliveryOption?: string | null
  readonly deliveryDate?: any | null
  readonly note?: string | null
  readonly paymentStatus?: string | null
  readonly shippingCost?: number | null
  readonly totalAmount?: number | null
  readonly order?: OrderRelateToOneForUpdateInput | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type OrderIntentUpdateArgs = {
  readonly where: OrderIntentWhereUniqueInput
  readonly data: OrderIntentUpdateInput
}

export type OrderIntentCreateInput = {
  readonly intentId?: string | null
  readonly yooMoneyId?: string | null
  readonly paymentId?: string | null
  readonly cart?: CartRelateToOneForCreateInput | null
  readonly user?: UserRelateToOneForCreateInput | null
  readonly orderReceiver?: OrderReceiverRelateToOneForCreateInput | null
  readonly deliveryAddress?: DelivaryAddressRelateToOneForCreateInput | null
  readonly deliveryOption?: string | null
  readonly deliveryDate?: any | null
  readonly note?: string | null
  readonly paymentStatus?: string | null
  readonly shippingCost?: number | null
  readonly totalAmount?: number | null
  readonly order?: OrderRelateToOneForCreateInput | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type MixBoxProductWhereUniqueInput = {
  readonly id?: string | null
  readonly product?: ProductWhereUniqueInput | null
}

export type MixBoxProductWhereInput = {
  readonly AND?: ReadonlyArray<MixBoxProductWhereInput> | MixBoxProductWhereInput | null
  readonly OR?: ReadonlyArray<MixBoxProductWhereInput> | MixBoxProductWhereInput | null
  readonly NOT?: ReadonlyArray<MixBoxProductWhereInput> | MixBoxProductWhereInput | null
  readonly id?: IDFilter | null
  readonly product?: ProductWhereInput | null
  readonly compositions?: ProductManyRelationFilter | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type MixBoxProductOrderByInput = {
  readonly id?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type MixBoxProductUpdateInput = {
  readonly product?: ProductRelateToOneForUpdateInput | null
  readonly compositions?: ProductRelateToManyForUpdateInput | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type MixBoxProductUpdateArgs = {
  readonly where: MixBoxProductWhereUniqueInput
  readonly data: MixBoxProductUpdateInput
}

export type MixBoxProductCreateInput = {
  readonly product?: ProductRelateToOneForCreateInput | null
  readonly compositions?: ProductRelateToManyForCreateInput | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type ProductVideoWhereUniqueInput = {
  readonly id?: string | null
  readonly product?: ProductWhereUniqueInput | null
}

export type ProductVideoWhereInput = {
  readonly AND?: ReadonlyArray<ProductVideoWhereInput> | ProductVideoWhereInput | null
  readonly OR?: ReadonlyArray<ProductVideoWhereInput> | ProductVideoWhereInput | null
  readonly NOT?: ReadonlyArray<ProductVideoWhereInput> | ProductVideoWhereInput | null
  readonly id?: IDFilter | null
  readonly product?: ProductWhereInput | null
  readonly createdAt?: DateTimeNullableFilter | null
  readonly updatedAt?: DateTimeNullableFilter | null
}

export type ProductVideoOrderByInput = {
  readonly id?: OrderDirection | null
  readonly createdAt?: OrderDirection | null
  readonly updatedAt?: OrderDirection | null
}

export type ProductVideoUpdateInput = {
  readonly product?: ProductRelateToOneForUpdateInput | null
  readonly video?: FileFieldInput | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type FileFieldInput = {
  readonly upload: any
}

export type ProductVideoUpdateArgs = {
  readonly where: ProductVideoWhereUniqueInput
  readonly data: ProductVideoUpdateInput
}

export type ProductVideoCreateInput = {
  readonly product?: ProductRelateToOneForCreateInput | null
  readonly video?: FileFieldInput | null
  readonly createdAt?: any | null
  readonly updatedAt?: any | null
}

export type KeystoneAdminUIFieldMetaIsNonNull =
  | 'read'
  | 'create'
  | 'update'

export type KeystoneAdminUIFieldMetaItemViewFieldPosition =
  | 'form'
  | 'sidebar'

export type KeystoneAdminUIFieldMetaListViewFieldMode =
  | 'read'
  | 'hidden'

export type KeystoneAdminUIActionMetaItemViewNavigation =
  | 'follow'
  | 'refetch'
  | 'return'

export type KeystoneAdminUISortDirection =
  | 'ASC'
  | 'DESC'

export type OrderReceiverInput = {
  readonly name: string
  readonly phoneNumber: string
}

export type RegisterUserInput = {
  readonly name: string
  readonly email: string
  readonly password: string
  readonly phoneNumber: string
}

export type CustomizationInput = {
  readonly optionId: string
  readonly valueId: string
  readonly inscriptionText?: string | null
  readonly imagesId?: ReadonlyArray<string> | string | null
}

export type CompositionOptionInput = {
  readonly productId: string
  readonly quantity: number
}

type ResolvedUserCreateInput = {
  id?: import('../prisma/client').Prisma.UserCreateInput['id']
  name?: import('../prisma/client').Prisma.UserCreateInput['name']
  email?: import('../prisma/client').Prisma.UserCreateInput['email']
  password: import('../prisma/client').Prisma.UserCreateInput['password']
  phoneNumber?: import('../prisma/client').Prisma.UserCreateInput['phoneNumber']
  isUserVerified?: import('../prisma/client').Prisma.UserCreateInput['isUserVerified']
  userVerificationToken?: import('../prisma/client').Prisma.UserCreateInput['userVerificationToken']
  userVerificationTokenIssuedAt?: import('../prisma/client').Prisma.UserCreateInput['userVerificationTokenIssuedAt']
  userVerificationTokenRedeemedAt?: import('../prisma/client').Prisma.UserCreateInput['userVerificationTokenRedeemedAt']
  role?: import('../prisma/client').Prisma.UserCreateInput['role']
  passwordResetToken?: import('../prisma/client').Prisma.UserCreateInput['passwordResetToken']
  passwordResetIssuedAt?: import('../prisma/client').Prisma.UserCreateInput['passwordResetIssuedAt']
  passwordResetRedeemedAt?: import('../prisma/client').Prisma.UserCreateInput['passwordResetRedeemedAt']
  firstOrderDiscountEligible?: import('../prisma/client').Prisma.UserCreateInput['firstOrderDiscountEligible']
  delivaryAddress?: import('../prisma/client').Prisma.UserCreateInput['delivaryAddress']
  cart?: import('../prisma/client').Prisma.UserCreateInput['cart']
  orders?: import('../prisma/client').Prisma.UserCreateInput['orders']
  orderBeneficiaries?: import('../prisma/client').Prisma.UserCreateInput['orderBeneficiaries']
  payments?: import('../prisma/client').Prisma.UserCreateInput['payments']
  lastLogin?: import('../prisma/client').Prisma.UserCreateInput['lastLogin']
  createdAt?: import('../prisma/client').Prisma.UserCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.UserCreateInput['updatedAt']
}
type ResolvedUserUpdateInput = {
  id?: undefined
  name?: import('../prisma/client').Prisma.UserUpdateInput['name']
  email?: import('../prisma/client').Prisma.UserUpdateInput['email']
  password?: import('../prisma/client').Prisma.UserUpdateInput['password']
  phoneNumber?: import('../prisma/client').Prisma.UserUpdateInput['phoneNumber']
  isUserVerified?: import('../prisma/client').Prisma.UserUpdateInput['isUserVerified']
  userVerificationToken?: import('../prisma/client').Prisma.UserUpdateInput['userVerificationToken']
  userVerificationTokenIssuedAt?: import('../prisma/client').Prisma.UserUpdateInput['userVerificationTokenIssuedAt']
  userVerificationTokenRedeemedAt?: import('../prisma/client').Prisma.UserUpdateInput['userVerificationTokenRedeemedAt']
  role?: import('../prisma/client').Prisma.UserUpdateInput['role']
  passwordResetToken?: import('../prisma/client').Prisma.UserUpdateInput['passwordResetToken']
  passwordResetIssuedAt?: import('../prisma/client').Prisma.UserUpdateInput['passwordResetIssuedAt']
  passwordResetRedeemedAt?: import('../prisma/client').Prisma.UserUpdateInput['passwordResetRedeemedAt']
  firstOrderDiscountEligible?: import('../prisma/client').Prisma.UserUpdateInput['firstOrderDiscountEligible']
  delivaryAddress?: import('../prisma/client').Prisma.UserUpdateInput['delivaryAddress']
  cart?: import('../prisma/client').Prisma.UserUpdateInput['cart']
  orders?: import('../prisma/client').Prisma.UserUpdateInput['orders']
  orderBeneficiaries?: import('../prisma/client').Prisma.UserUpdateInput['orderBeneficiaries']
  payments?: import('../prisma/client').Prisma.UserUpdateInput['payments']
  lastLogin?: import('../prisma/client').Prisma.UserUpdateInput['lastLogin']
  createdAt?: import('../prisma/client').Prisma.UserUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.UserUpdateInput['updatedAt']
}
type ResolvedDelivaryAddressCreateInput = {
  id?: import('../prisma/client').Prisma.DelivaryAddressCreateInput['id']
  user?: import('../prisma/client').Prisma.DelivaryAddressCreateInput['user']
  orders?: import('../prisma/client').Prisma.DelivaryAddressCreateInput['orders']
  address?: import('../prisma/client').Prisma.DelivaryAddressCreateInput['address']
  apartmentNumber?: import('../prisma/client').Prisma.DelivaryAddressCreateInput['apartmentNumber']
  floor?: import('../prisma/client').Prisma.DelivaryAddressCreateInput['floor']
  intercomCode?: import('../prisma/client').Prisma.DelivaryAddressCreateInput['intercomCode']
  createdAt?: import('../prisma/client').Prisma.DelivaryAddressCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.DelivaryAddressCreateInput['updatedAt']
}
type ResolvedDelivaryAddressUpdateInput = {
  id?: undefined
  user?: import('../prisma/client').Prisma.DelivaryAddressUpdateInput['user']
  orders?: import('../prisma/client').Prisma.DelivaryAddressUpdateInput['orders']
  address?: import('../prisma/client').Prisma.DelivaryAddressUpdateInput['address']
  apartmentNumber?: import('../prisma/client').Prisma.DelivaryAddressUpdateInput['apartmentNumber']
  floor?: import('../prisma/client').Prisma.DelivaryAddressUpdateInput['floor']
  intercomCode?: import('../prisma/client').Prisma.DelivaryAddressUpdateInput['intercomCode']
  createdAt?: import('../prisma/client').Prisma.DelivaryAddressUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.DelivaryAddressUpdateInput['updatedAt']
}
type ResolvedProductCreateInput = {
  id?: import('../prisma/client').Prisma.ProductCreateInput['id']
  categories?: import('../prisma/client').Prisma.ProductCreateInput['categories']
  name?: import('../prisma/client').Prisma.ProductCreateInput['name']
  slug?: import('../prisma/client').Prisma.ProductCreateInput['slug']
  baseDescription?: import('../prisma/client').Prisma.ProductCreateInput['baseDescription']
  type: import('../prisma/client').Prisma.ProductCreateInput['type']
  variantType: import('../prisma/client').Prisma.ProductCreateInput['variantType']
  fillings?: import('../prisma/client').Prisma.ProductCreateInput['fillings']
  mixBoxProduct?: import('../prisma/client').Prisma.ProductCreateInput['mixBoxProduct']
  preparationDays?: import('../prisma/client').Prisma.ProductCreateInput['preparationDays']
  isAvailable?: import('../prisma/client').Prisma.ProductCreateInput['isAvailable']
  badge?: import('../prisma/client').Prisma.ProductCreateInput['badge']
  images?: import('../prisma/client').Prisma.ProductCreateInput['images']
  video?: import('../prisma/client').Prisma.ProductCreateInput['video']
  customizations?: import('../prisma/client').Prisma.ProductCreateInput['customizations']
  topping?: import('../prisma/client').Prisma.ProductCreateInput['topping']
  createdAt?: import('../prisma/client').Prisma.ProductCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.ProductCreateInput['updatedAt']
}
type ResolvedProductUpdateInput = {
  id?: undefined
  categories?: import('../prisma/client').Prisma.ProductUpdateInput['categories']
  name?: import('../prisma/client').Prisma.ProductUpdateInput['name']
  slug?: import('../prisma/client').Prisma.ProductUpdateInput['slug']
  baseDescription?: import('../prisma/client').Prisma.ProductUpdateInput['baseDescription']
  type?: import('../prisma/client').Prisma.ProductUpdateInput['type']
  variantType?: import('../prisma/client').Prisma.ProductUpdateInput['variantType']
  fillings?: import('../prisma/client').Prisma.ProductUpdateInput['fillings']
  mixBoxProduct?: import('../prisma/client').Prisma.ProductUpdateInput['mixBoxProduct']
  preparationDays?: import('../prisma/client').Prisma.ProductUpdateInput['preparationDays']
  isAvailable?: import('../prisma/client').Prisma.ProductUpdateInput['isAvailable']
  badge?: import('../prisma/client').Prisma.ProductUpdateInput['badge']
  images?: import('../prisma/client').Prisma.ProductUpdateInput['images']
  video?: import('../prisma/client').Prisma.ProductUpdateInput['video']
  customizations?: import('../prisma/client').Prisma.ProductUpdateInput['customizations']
  topping?: import('../prisma/client').Prisma.ProductUpdateInput['topping']
  createdAt?: import('../prisma/client').Prisma.ProductUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.ProductUpdateInput['updatedAt']
}
type ResolvedProductFillingCreateInput = {
  id?: import('../prisma/client').Prisma.ProductFillingCreateInput['id']
  products?: import('../prisma/client').Prisma.ProductFillingCreateInput['products']
  name?: import('../prisma/client').Prisma.ProductFillingCreateInput['name']
  slug?: import('../prisma/client').Prisma.ProductFillingCreateInput['slug']
  hasDetails?: import('../prisma/client').Prisma.ProductFillingCreateInput['hasDetails']
  description?: import('../prisma/client').Prisma.ProductFillingCreateInput['description']
  carbonhydrate?: import('../prisma/client').Prisma.ProductFillingCreateInput['carbonhydrate']
  calories?: import('../prisma/client').Prisma.ProductFillingCreateInput['calories']
  protein?: import('../prisma/client').Prisma.ProductFillingCreateInput['protein']
  fat?: import('../prisma/client').Prisma.ProductFillingCreateInput['fat']
  ingredients?: import('../prisma/client').Prisma.ProductFillingCreateInput['ingredients']
  image_icon: {
  id?: import('../prisma/client').Prisma.ProductFillingCreateInput['image_icon_id']
  extension?: import('../prisma/client').Prisma.ProductFillingCreateInput['image_icon_extension']
  filesize?: import('../prisma/client').Prisma.ProductFillingCreateInput['image_icon_filesize']
  width?: import('../prisma/client').Prisma.ProductFillingCreateInput['image_icon_width']
  height?: import('../prisma/client').Prisma.ProductFillingCreateInput['image_icon_height']
  }
  variants?: import('../prisma/client').Prisma.ProductFillingCreateInput['variants']
  createdAt?: import('../prisma/client').Prisma.ProductFillingCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.ProductFillingCreateInput['updatedAt']
}
type ResolvedProductFillingUpdateInput = {
  id?: undefined
  products?: import('../prisma/client').Prisma.ProductFillingUpdateInput['products']
  name?: import('../prisma/client').Prisma.ProductFillingUpdateInput['name']
  slug?: import('../prisma/client').Prisma.ProductFillingUpdateInput['slug']
  hasDetails?: import('../prisma/client').Prisma.ProductFillingUpdateInput['hasDetails']
  description?: import('../prisma/client').Prisma.ProductFillingUpdateInput['description']
  carbonhydrate?: import('../prisma/client').Prisma.ProductFillingUpdateInput['carbonhydrate']
  calories?: import('../prisma/client').Prisma.ProductFillingUpdateInput['calories']
  protein?: import('../prisma/client').Prisma.ProductFillingUpdateInput['protein']
  fat?: import('../prisma/client').Prisma.ProductFillingUpdateInput['fat']
  ingredients?: import('../prisma/client').Prisma.ProductFillingUpdateInput['ingredients']
  image_icon: {
  id?: import('../prisma/client').Prisma.ProductFillingUpdateInput['image_icon_id']
  extension?: import('../prisma/client').Prisma.ProductFillingUpdateInput['image_icon_extension']
  filesize?: import('../prisma/client').Prisma.ProductFillingUpdateInput['image_icon_filesize']
  width?: import('../prisma/client').Prisma.ProductFillingUpdateInput['image_icon_width']
  height?: import('../prisma/client').Prisma.ProductFillingUpdateInput['image_icon_height']
  }
  variants?: import('../prisma/client').Prisma.ProductFillingUpdateInput['variants']
  createdAt?: import('../prisma/client').Prisma.ProductFillingUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.ProductFillingUpdateInput['updatedAt']
}
type ResolvedProductImageCreateInput = {
  id?: import('../prisma/client').Prisma.ProductImageCreateInput['id']
  product?: import('../prisma/client').Prisma.ProductImageCreateInput['product']
  image: {
  id?: import('../prisma/client').Prisma.ProductImageCreateInput['image_id']
  extension?: import('../prisma/client').Prisma.ProductImageCreateInput['image_extension']
  filesize?: import('../prisma/client').Prisma.ProductImageCreateInput['image_filesize']
  width?: import('../prisma/client').Prisma.ProductImageCreateInput['image_width']
  height?: import('../prisma/client').Prisma.ProductImageCreateInput['image_height']
  }
  altText?: import('../prisma/client').Prisma.ProductImageCreateInput['altText']
  isMain?: import('../prisma/client').Prisma.ProductImageCreateInput['isMain']
  createdAt?: import('../prisma/client').Prisma.ProductImageCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.ProductImageCreateInput['updatedAt']
}
type ResolvedProductImageUpdateInput = {
  id?: undefined
  product?: import('../prisma/client').Prisma.ProductImageUpdateInput['product']
  image: {
  id?: import('../prisma/client').Prisma.ProductImageUpdateInput['image_id']
  extension?: import('../prisma/client').Prisma.ProductImageUpdateInput['image_extension']
  filesize?: import('../prisma/client').Prisma.ProductImageUpdateInput['image_filesize']
  width?: import('../prisma/client').Prisma.ProductImageUpdateInput['image_width']
  height?: import('../prisma/client').Prisma.ProductImageUpdateInput['image_height']
  }
  altText?: import('../prisma/client').Prisma.ProductImageUpdateInput['altText']
  isMain?: import('../prisma/client').Prisma.ProductImageUpdateInput['isMain']
  createdAt?: import('../prisma/client').Prisma.ProductImageUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.ProductImageUpdateInput['updatedAt']
}
type ResolvedProductVariantCreateInput = {
  id?: import('../prisma/client').Prisma.ProductVariantCreateInput['id']
  filling?: import('../prisma/client').Prisma.ProductVariantCreateInput['filling']
  weight?: import('../prisma/client').Prisma.ProductVariantCreateInput['weight']
  pieces?: import('../prisma/client').Prisma.ProductVariantCreateInput['pieces']
  size?: import('../prisma/client').Prisma.ProductVariantCreateInput['size']
  price: import('../prisma/client').Prisma.ProductVariantCreateInput['price']
  serving?: import('../prisma/client').Prisma.ProductVariantCreateInput['serving']
  createdAt?: import('../prisma/client').Prisma.ProductVariantCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.ProductVariantCreateInput['updatedAt']
}
type ResolvedProductVariantUpdateInput = {
  id?: undefined
  filling?: import('../prisma/client').Prisma.ProductVariantUpdateInput['filling']
  weight?: import('../prisma/client').Prisma.ProductVariantUpdateInput['weight']
  pieces?: import('../prisma/client').Prisma.ProductVariantUpdateInput['pieces']
  size?: import('../prisma/client').Prisma.ProductVariantUpdateInput['size']
  price?: import('../prisma/client').Prisma.ProductVariantUpdateInput['price']
  serving?: import('../prisma/client').Prisma.ProductVariantUpdateInput['serving']
  createdAt?: import('../prisma/client').Prisma.ProductVariantUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.ProductVariantUpdateInput['updatedAt']
}
type ResolvedCategoryCreateInput = {
  id?: import('../prisma/client').Prisma.CategoryCreateInput['id']
  name?: import('../prisma/client').Prisma.CategoryCreateInput['name']
  slug?: import('../prisma/client').Prisma.CategoryCreateInput['slug']
  parent?: import('../prisma/client').Prisma.CategoryCreateInput['parent']
  isAvailable?: import('../prisma/client').Prisma.CategoryCreateInput['isAvailable']
  products?: import('../prisma/client').Prisma.CategoryCreateInput['products']
  priority?: import('../prisma/client').Prisma.CategoryCreateInput['priority']
  createdAt?: import('../prisma/client').Prisma.CategoryCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.CategoryCreateInput['updatedAt']
}
type ResolvedCategoryUpdateInput = {
  id?: undefined
  name?: import('../prisma/client').Prisma.CategoryUpdateInput['name']
  slug?: import('../prisma/client').Prisma.CategoryUpdateInput['slug']
  parent?: import('../prisma/client').Prisma.CategoryUpdateInput['parent']
  isAvailable?: import('../prisma/client').Prisma.CategoryUpdateInput['isAvailable']
  products?: import('../prisma/client').Prisma.CategoryUpdateInput['products']
  priority?: import('../prisma/client').Prisma.CategoryUpdateInput['priority']
  createdAt?: import('../prisma/client').Prisma.CategoryUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.CategoryUpdateInput['updatedAt']
}
type ResolvedCustomizationOptionCreateInput = {
  id?: import('../prisma/client').Prisma.CustomizationOptionCreateInput['id']
  product?: import('../prisma/client').Prisma.CustomizationOptionCreateInput['product']
  name?: import('../prisma/client').Prisma.CustomizationOptionCreateInput['name']
  slug?: import('../prisma/client').Prisma.CustomizationOptionCreateInput['slug']
  customValues?: import('../prisma/client').Prisma.CustomizationOptionCreateInput['customValues']
  createdAt?: import('../prisma/client').Prisma.CustomizationOptionCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.CustomizationOptionCreateInput['updatedAt']
}
type ResolvedCustomizationOptionUpdateInput = {
  id?: undefined
  product?: import('../prisma/client').Prisma.CustomizationOptionUpdateInput['product']
  name?: import('../prisma/client').Prisma.CustomizationOptionUpdateInput['name']
  slug?: import('../prisma/client').Prisma.CustomizationOptionUpdateInput['slug']
  customValues?: import('../prisma/client').Prisma.CustomizationOptionUpdateInput['customValues']
  createdAt?: import('../prisma/client').Prisma.CustomizationOptionUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.CustomizationOptionUpdateInput['updatedAt']
}
type ResolvedCustomizationOptionValueCreateInput = {
  id?: import('../prisma/client').Prisma.CustomizationOptionValueCreateInput['id']
  option?: import('../prisma/client').Prisma.CustomizationOptionValueCreateInput['option']
  value?: import('../prisma/client').Prisma.CustomizationOptionValueCreateInput['value']
  extraPrice?: import('../prisma/client').Prisma.CustomizationOptionValueCreateInput['extraPrice']
  createdAt?: import('../prisma/client').Prisma.CustomizationOptionValueCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.CustomizationOptionValueCreateInput['updatedAt']
}
type ResolvedCustomizationOptionValueUpdateInput = {
  id?: undefined
  option?: import('../prisma/client').Prisma.CustomizationOptionValueUpdateInput['option']
  value?: import('../prisma/client').Prisma.CustomizationOptionValueUpdateInput['value']
  extraPrice?: import('../prisma/client').Prisma.CustomizationOptionValueUpdateInput['extraPrice']
  createdAt?: import('../prisma/client').Prisma.CustomizationOptionValueUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.CustomizationOptionValueUpdateInput['updatedAt']
}
type ResolvedToppingCreateInput = {
  id?: import('../prisma/client').Prisma.ToppingCreateInput['id']
  products?: import('../prisma/client').Prisma.ToppingCreateInput['products']
  name?: import('../prisma/client').Prisma.ToppingCreateInput['name']
  slug?: import('../prisma/client').Prisma.ToppingCreateInput['slug']
  options?: import('../prisma/client').Prisma.ToppingCreateInput['options']
  createdAt?: import('../prisma/client').Prisma.ToppingCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.ToppingCreateInput['updatedAt']
}
type ResolvedToppingUpdateInput = {
  id?: undefined
  products?: import('../prisma/client').Prisma.ToppingUpdateInput['products']
  name?: import('../prisma/client').Prisma.ToppingUpdateInput['name']
  slug?: import('../prisma/client').Prisma.ToppingUpdateInput['slug']
  options?: import('../prisma/client').Prisma.ToppingUpdateInput['options']
  createdAt?: import('../prisma/client').Prisma.ToppingUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.ToppingUpdateInput['updatedAt']
}
type ResolvedToppingOptionCreateInput = {
  id?: import('../prisma/client').Prisma.ToppingOptionCreateInput['id']
  topping?: import('../prisma/client').Prisma.ToppingOptionCreateInput['topping']
  weight?: import('../prisma/client').Prisma.ToppingOptionCreateInput['weight']
  pieces?: import('../prisma/client').Prisma.ToppingOptionCreateInput['pieces']
  extraPrice: import('../prisma/client').Prisma.ToppingOptionCreateInput['extraPrice']
  createdAt?: import('../prisma/client').Prisma.ToppingOptionCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.ToppingOptionCreateInput['updatedAt']
}
type ResolvedToppingOptionUpdateInput = {
  id?: undefined
  topping?: import('../prisma/client').Prisma.ToppingOptionUpdateInput['topping']
  weight?: import('../prisma/client').Prisma.ToppingOptionUpdateInput['weight']
  pieces?: import('../prisma/client').Prisma.ToppingOptionUpdateInput['pieces']
  extraPrice?: import('../prisma/client').Prisma.ToppingOptionUpdateInput['extraPrice']
  createdAt?: import('../prisma/client').Prisma.ToppingOptionUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.ToppingOptionUpdateInput['updatedAt']
}
type ResolvedCartCreateInput = {
  id?: import('../prisma/client').Prisma.CartCreateInput['id']
  sessionId?: import('../prisma/client').Prisma.CartCreateInput['sessionId']
  user?: import('../prisma/client').Prisma.CartCreateInput['user']
  cartItems?: import('../prisma/client').Prisma.CartCreateInput['cartItems']
  subTotal?: import('../prisma/client').Prisma.CartCreateInput['subTotal']
  createdAt?: import('../prisma/client').Prisma.CartCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.CartCreateInput['updatedAt']
}
type ResolvedCartUpdateInput = {
  id?: undefined
  sessionId?: import('../prisma/client').Prisma.CartUpdateInput['sessionId']
  user?: import('../prisma/client').Prisma.CartUpdateInput['user']
  cartItems?: import('../prisma/client').Prisma.CartUpdateInput['cartItems']
  subTotal?: import('../prisma/client').Prisma.CartUpdateInput['subTotal']
  createdAt?: import('../prisma/client').Prisma.CartUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.CartUpdateInput['updatedAt']
}
type ResolvedCartItemCreateInput = {
  id?: import('../prisma/client').Prisma.CartItemCreateInput['id']
  cart?: import('../prisma/client').Prisma.CartItemCreateInput['cart']
  product?: import('../prisma/client').Prisma.CartItemCreateInput['product']
  variant?: import('../prisma/client').Prisma.CartItemCreateInput['variant']
  toppingOption?: import('../prisma/client').Prisma.CartItemCreateInput['toppingOption']
  compositions?: import('../prisma/client').Prisma.CartItemCreateInput['compositions']
  customizations?: import('../prisma/client').Prisma.CartItemCreateInput['customizations']
  quantity?: import('../prisma/client').Prisma.CartItemCreateInput['quantity']
  unitPrice?: import('../prisma/client').Prisma.CartItemCreateInput['unitPrice']
  subTotal?: import('../prisma/client').Prisma.CartItemCreateInput['subTotal']
  createdAt?: import('../prisma/client').Prisma.CartItemCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.CartItemCreateInput['updatedAt']
}
type ResolvedCartItemUpdateInput = {
  id?: undefined
  cart?: import('../prisma/client').Prisma.CartItemUpdateInput['cart']
  product?: import('../prisma/client').Prisma.CartItemUpdateInput['product']
  variant?: import('../prisma/client').Prisma.CartItemUpdateInput['variant']
  toppingOption?: import('../prisma/client').Prisma.CartItemUpdateInput['toppingOption']
  compositions?: import('../prisma/client').Prisma.CartItemUpdateInput['compositions']
  customizations?: import('../prisma/client').Prisma.CartItemUpdateInput['customizations']
  quantity?: import('../prisma/client').Prisma.CartItemUpdateInput['quantity']
  unitPrice?: import('../prisma/client').Prisma.CartItemUpdateInput['unitPrice']
  subTotal?: import('../prisma/client').Prisma.CartItemUpdateInput['subTotal']
  createdAt?: import('../prisma/client').Prisma.CartItemUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.CartItemUpdateInput['updatedAt']
}
type ResolvedOrderCreateInput = {
  id?: import('../prisma/client').Prisma.OrderCreateInput['id']
  orderIntent?: import('../prisma/client').Prisma.OrderCreateInput['orderIntent']
  user?: import('../prisma/client').Prisma.OrderCreateInput['user']
  orderReceiver?: import('../prisma/client').Prisma.OrderCreateInput['orderReceiver']
  orderDetails?: undefined
  orderItems?: import('../prisma/client').Prisma.OrderCreateInput['orderItems']
  orderNumber?: import('../prisma/client').Prisma.OrderCreateInput['orderNumber']
  shippingCost?: import('../prisma/client').Prisma.OrderCreateInput['shippingCost']
  subTotalAmount?: import('../prisma/client').Prisma.OrderCreateInput['subTotalAmount']
  totalAmount?: import('../prisma/client').Prisma.OrderCreateInput['totalAmount']
  status?: import('../prisma/client').Prisma.OrderCreateInput['status']
  payment?: import('../prisma/client').Prisma.OrderCreateInput['payment']
  deliveryOption?: import('../prisma/client').Prisma.OrderCreateInput['deliveryOption']
  virtualDeliveryDate?: undefined
  deliveryDate?: import('../prisma/client').Prisma.OrderCreateInput['deliveryDate']
  deliveryAddress?: import('../prisma/client').Prisma.OrderCreateInput['deliveryAddress']
  note?: import('../prisma/client').Prisma.OrderCreateInput['note']
  createdAt?: import('../prisma/client').Prisma.OrderCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.OrderCreateInput['updatedAt']
}
type ResolvedOrderUpdateInput = {
  id?: undefined
  orderIntent?: import('../prisma/client').Prisma.OrderUpdateInput['orderIntent']
  user?: import('../prisma/client').Prisma.OrderUpdateInput['user']
  orderReceiver?: import('../prisma/client').Prisma.OrderUpdateInput['orderReceiver']
  orderDetails?: undefined
  orderItems?: import('../prisma/client').Prisma.OrderUpdateInput['orderItems']
  orderNumber?: import('../prisma/client').Prisma.OrderUpdateInput['orderNumber']
  shippingCost?: import('../prisma/client').Prisma.OrderUpdateInput['shippingCost']
  subTotalAmount?: import('../prisma/client').Prisma.OrderUpdateInput['subTotalAmount']
  totalAmount?: import('../prisma/client').Prisma.OrderUpdateInput['totalAmount']
  status?: import('../prisma/client').Prisma.OrderUpdateInput['status']
  payment?: import('../prisma/client').Prisma.OrderUpdateInput['payment']
  deliveryOption?: import('../prisma/client').Prisma.OrderUpdateInput['deliveryOption']
  virtualDeliveryDate?: undefined
  deliveryDate?: import('../prisma/client').Prisma.OrderUpdateInput['deliveryDate']
  deliveryAddress?: import('../prisma/client').Prisma.OrderUpdateInput['deliveryAddress']
  note?: import('../prisma/client').Prisma.OrderUpdateInput['note']
  createdAt?: import('../prisma/client').Prisma.OrderUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.OrderUpdateInput['updatedAt']
}
type ResolvedOrderReceiverCreateInput = {
  id?: import('../prisma/client').Prisma.OrderReceiverCreateInput['id']
  benefactor?: import('../prisma/client').Prisma.OrderReceiverCreateInput['benefactor']
  order?: import('../prisma/client').Prisma.OrderReceiverCreateInput['order']
  name?: import('../prisma/client').Prisma.OrderReceiverCreateInput['name']
  phoneNumber?: import('../prisma/client').Prisma.OrderReceiverCreateInput['phoneNumber']
  createdAt?: import('../prisma/client').Prisma.OrderReceiverCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.OrderReceiverCreateInput['updatedAt']
}
type ResolvedOrderReceiverUpdateInput = {
  id?: undefined
  benefactor?: import('../prisma/client').Prisma.OrderReceiverUpdateInput['benefactor']
  order?: import('../prisma/client').Prisma.OrderReceiverUpdateInput['order']
  name?: import('../prisma/client').Prisma.OrderReceiverUpdateInput['name']
  phoneNumber?: import('../prisma/client').Prisma.OrderReceiverUpdateInput['phoneNumber']
  createdAt?: import('../prisma/client').Prisma.OrderReceiverUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.OrderReceiverUpdateInput['updatedAt']
}
type ResolvedOrderItemCreateInput = {
  id?: import('../prisma/client').Prisma.OrderItemCreateInput['id']
  order?: import('../prisma/client').Prisma.OrderItemCreateInput['order']
  product?: import('../prisma/client').Prisma.OrderItemCreateInput['product']
  variant?: import('../prisma/client').Prisma.OrderItemCreateInput['variant']
  toppingOption?: import('../prisma/client').Prisma.OrderItemCreateInput['toppingOption']
  compositions?: import('../prisma/client').Prisma.OrderItemCreateInput['compositions']
  customizations?: import('../prisma/client').Prisma.OrderItemCreateInput['customizations']
  quantity?: import('../prisma/client').Prisma.OrderItemCreateInput['quantity']
  unitPrice?: import('../prisma/client').Prisma.OrderItemCreateInput['unitPrice']
  subTotal?: import('../prisma/client').Prisma.OrderItemCreateInput['subTotal']
  createdAt?: import('../prisma/client').Prisma.OrderItemCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.OrderItemCreateInput['updatedAt']
}
type ResolvedOrderItemUpdateInput = {
  id?: undefined
  order?: import('../prisma/client').Prisma.OrderItemUpdateInput['order']
  product?: import('../prisma/client').Prisma.OrderItemUpdateInput['product']
  variant?: import('../prisma/client').Prisma.OrderItemUpdateInput['variant']
  toppingOption?: import('../prisma/client').Prisma.OrderItemUpdateInput['toppingOption']
  compositions?: import('../prisma/client').Prisma.OrderItemUpdateInput['compositions']
  customizations?: import('../prisma/client').Prisma.OrderItemUpdateInput['customizations']
  quantity?: import('../prisma/client').Prisma.OrderItemUpdateInput['quantity']
  unitPrice?: import('../prisma/client').Prisma.OrderItemUpdateInput['unitPrice']
  subTotal?: import('../prisma/client').Prisma.OrderItemUpdateInput['subTotal']
  createdAt?: import('../prisma/client').Prisma.OrderItemUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.OrderItemUpdateInput['updatedAt']
}
type ResolvedPaymentCreateInput = {
  id?: import('../prisma/client').Prisma.PaymentCreateInput['id']
  user?: import('../prisma/client').Prisma.PaymentCreateInput['user']
  order?: import('../prisma/client').Prisma.PaymentCreateInput['order']
  yooMoneyId?: import('../prisma/client').Prisma.PaymentCreateInput['yooMoneyId']
  redirectUrl?: import('../prisma/client').Prisma.PaymentCreateInput['redirectUrl']
  confirmationUrl?: import('../prisma/client').Prisma.PaymentCreateInput['confirmationUrl']
  amount?: import('../prisma/client').Prisma.PaymentCreateInput['amount']
  method?: import('../prisma/client').Prisma.PaymentCreateInput['method']
  status?: import('../prisma/client').Prisma.PaymentCreateInput['status']
  paidAt?: import('../prisma/client').Prisma.PaymentCreateInput['paidAt']
  createdAt?: import('../prisma/client').Prisma.PaymentCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.PaymentCreateInput['updatedAt']
}
type ResolvedPaymentUpdateInput = {
  id?: undefined
  user?: import('../prisma/client').Prisma.PaymentUpdateInput['user']
  order?: import('../prisma/client').Prisma.PaymentUpdateInput['order']
  yooMoneyId?: import('../prisma/client').Prisma.PaymentUpdateInput['yooMoneyId']
  redirectUrl?: import('../prisma/client').Prisma.PaymentUpdateInput['redirectUrl']
  confirmationUrl?: import('../prisma/client').Prisma.PaymentUpdateInput['confirmationUrl']
  amount?: import('../prisma/client').Prisma.PaymentUpdateInput['amount']
  method?: import('../prisma/client').Prisma.PaymentUpdateInput['method']
  status?: import('../prisma/client').Prisma.PaymentUpdateInput['status']
  paidAt?: import('../prisma/client').Prisma.PaymentUpdateInput['paidAt']
  createdAt?: import('../prisma/client').Prisma.PaymentUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.PaymentUpdateInput['updatedAt']
}
type ResolvedProductHomeBannerCreateInput = {
  id?: import('../prisma/client').Prisma.ProductHomeBannerCreateInput['id']
  product?: import('../prisma/client').Prisma.ProductHomeBannerCreateInput['product']
  bannerText?: import('../prisma/client').Prisma.ProductHomeBannerCreateInput['bannerText']
  createdAt?: import('../prisma/client').Prisma.ProductHomeBannerCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.ProductHomeBannerCreateInput['updatedAt']
}
type ResolvedProductHomeBannerUpdateInput = {
  id?: undefined
  product?: import('../prisma/client').Prisma.ProductHomeBannerUpdateInput['product']
  bannerText?: import('../prisma/client').Prisma.ProductHomeBannerUpdateInput['bannerText']
  createdAt?: import('../prisma/client').Prisma.ProductHomeBannerUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.ProductHomeBannerUpdateInput['updatedAt']
}
type ResolvedCustomizeImageCreateInput = {
  id?: import('../prisma/client').Prisma.CustomizeImageCreateInput['id']
  image: {
  id?: import('../prisma/client').Prisma.CustomizeImageCreateInput['image_id']
  extension?: import('../prisma/client').Prisma.CustomizeImageCreateInput['image_extension']
  filesize?: import('../prisma/client').Prisma.CustomizeImageCreateInput['image_filesize']
  width?: import('../prisma/client').Prisma.CustomizeImageCreateInput['image_width']
  height?: import('../prisma/client').Prisma.CustomizeImageCreateInput['image_height']
  }
  altText?: import('../prisma/client').Prisma.CustomizeImageCreateInput['altText']
  createdAt?: import('../prisma/client').Prisma.CustomizeImageCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.CustomizeImageCreateInput['updatedAt']
}
type ResolvedCustomizeImageUpdateInput = {
  id?: undefined
  image: {
  id?: import('../prisma/client').Prisma.CustomizeImageUpdateInput['image_id']
  extension?: import('../prisma/client').Prisma.CustomizeImageUpdateInput['image_extension']
  filesize?: import('../prisma/client').Prisma.CustomizeImageUpdateInput['image_filesize']
  width?: import('../prisma/client').Prisma.CustomizeImageUpdateInput['image_width']
  height?: import('../prisma/client').Prisma.CustomizeImageUpdateInput['image_height']
  }
  altText?: import('../prisma/client').Prisma.CustomizeImageUpdateInput['altText']
  createdAt?: import('../prisma/client').Prisma.CustomizeImageUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.CustomizeImageUpdateInput['updatedAt']
}
type ResolvedFeaturedProductCreateInput = {
  id?: import('../prisma/client').Prisma.FeaturedProductCreateInput['id']
  products?: import('../prisma/client').Prisma.FeaturedProductCreateInput['products']
  createdAt?: import('../prisma/client').Prisma.FeaturedProductCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.FeaturedProductCreateInput['updatedAt']
}
type ResolvedFeaturedProductUpdateInput = {
  id?: undefined
  products?: import('../prisma/client').Prisma.FeaturedProductUpdateInput['products']
  createdAt?: import('../prisma/client').Prisma.FeaturedProductUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.FeaturedProductUpdateInput['updatedAt']
}
type ResolvedOrderIntentCreateInput = {
  id?: import('../prisma/client').Prisma.OrderIntentCreateInput['id']
  intentId?: import('../prisma/client').Prisma.OrderIntentCreateInput['intentId']
  yooMoneyId?: import('../prisma/client').Prisma.OrderIntentCreateInput['yooMoneyId']
  paymentId?: import('../prisma/client').Prisma.OrderIntentCreateInput['paymentId']
  cart?: import('../prisma/client').Prisma.OrderIntentCreateInput['cart']
  user?: import('../prisma/client').Prisma.OrderIntentCreateInput['user']
  orderReceiver?: import('../prisma/client').Prisma.OrderIntentCreateInput['orderReceiver']
  deliveryAddress?: import('../prisma/client').Prisma.OrderIntentCreateInput['deliveryAddress']
  deliveryOption?: import('../prisma/client').Prisma.OrderIntentCreateInput['deliveryOption']
  deliveryDate?: import('../prisma/client').Prisma.OrderIntentCreateInput['deliveryDate']
  note?: import('../prisma/client').Prisma.OrderIntentCreateInput['note']
  paymentStatus?: import('../prisma/client').Prisma.OrderIntentCreateInput['paymentStatus']
  shippingCost?: import('../prisma/client').Prisma.OrderIntentCreateInput['shippingCost']
  totalAmount?: import('../prisma/client').Prisma.OrderIntentCreateInput['totalAmount']
  order?: import('../prisma/client').Prisma.OrderIntentCreateInput['order']
  createdAt?: import('../prisma/client').Prisma.OrderIntentCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.OrderIntentCreateInput['updatedAt']
}
type ResolvedOrderIntentUpdateInput = {
  id?: undefined
  intentId?: import('../prisma/client').Prisma.OrderIntentUpdateInput['intentId']
  yooMoneyId?: import('../prisma/client').Prisma.OrderIntentUpdateInput['yooMoneyId']
  paymentId?: import('../prisma/client').Prisma.OrderIntentUpdateInput['paymentId']
  cart?: import('../prisma/client').Prisma.OrderIntentUpdateInput['cart']
  user?: import('../prisma/client').Prisma.OrderIntentUpdateInput['user']
  orderReceiver?: import('../prisma/client').Prisma.OrderIntentUpdateInput['orderReceiver']
  deliveryAddress?: import('../prisma/client').Prisma.OrderIntentUpdateInput['deliveryAddress']
  deliveryOption?: import('../prisma/client').Prisma.OrderIntentUpdateInput['deliveryOption']
  deliveryDate?: import('../prisma/client').Prisma.OrderIntentUpdateInput['deliveryDate']
  note?: import('../prisma/client').Prisma.OrderIntentUpdateInput['note']
  paymentStatus?: import('../prisma/client').Prisma.OrderIntentUpdateInput['paymentStatus']
  shippingCost?: import('../prisma/client').Prisma.OrderIntentUpdateInput['shippingCost']
  totalAmount?: import('../prisma/client').Prisma.OrderIntentUpdateInput['totalAmount']
  order?: import('../prisma/client').Prisma.OrderIntentUpdateInput['order']
  createdAt?: import('../prisma/client').Prisma.OrderIntentUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.OrderIntentUpdateInput['updatedAt']
}
type ResolvedMixBoxProductCreateInput = {
  id?: import('../prisma/client').Prisma.MixBoxProductCreateInput['id']
  product?: import('../prisma/client').Prisma.MixBoxProductCreateInput['product']
  compositions?: import('../prisma/client').Prisma.MixBoxProductCreateInput['compositions']
  createdAt?: import('../prisma/client').Prisma.MixBoxProductCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.MixBoxProductCreateInput['updatedAt']
}
type ResolvedMixBoxProductUpdateInput = {
  id?: undefined
  product?: import('../prisma/client').Prisma.MixBoxProductUpdateInput['product']
  compositions?: import('../prisma/client').Prisma.MixBoxProductUpdateInput['compositions']
  createdAt?: import('../prisma/client').Prisma.MixBoxProductUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.MixBoxProductUpdateInput['updatedAt']
}
type ResolvedProductVideoCreateInput = {
  id?: import('../prisma/client').Prisma.ProductVideoCreateInput['id']
  product?: import('../prisma/client').Prisma.ProductVideoCreateInput['product']
  video: {
  filesize?: import('../prisma/client').Prisma.ProductVideoCreateInput['video_filesize']
  filename?: import('../prisma/client').Prisma.ProductVideoCreateInput['video_filename']
  }
  createdAt?: import('../prisma/client').Prisma.ProductVideoCreateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.ProductVideoCreateInput['updatedAt']
}
type ResolvedProductVideoUpdateInput = {
  id?: undefined
  product?: import('../prisma/client').Prisma.ProductVideoUpdateInput['product']
  video: {
  filesize?: import('../prisma/client').Prisma.ProductVideoUpdateInput['video_filesize']
  filename?: import('../prisma/client').Prisma.ProductVideoUpdateInput['video_filename']
  }
  createdAt?: import('../prisma/client').Prisma.ProductVideoUpdateInput['createdAt']
  updatedAt?: import('../prisma/client').Prisma.ProductVideoUpdateInput['updatedAt']
}

export declare namespace Lists {
  export type User<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.User.TypeInfo<Session>>
  namespace User {
    export type Item = import('../prisma/client').User
    export type TypeInfo<Session = any> = {
      key: 'User'
      isSingleton: false
      fields: 'id' | 'name' | 'email' | 'password' | 'phoneNumber' | 'isUserVerified' | 'userVerificationToken' | 'userVerificationTokenIssuedAt' | 'userVerificationTokenRedeemedAt' | 'role' | 'passwordResetToken' | 'passwordResetIssuedAt' | 'passwordResetRedeemedAt' | 'firstOrderDiscountEligible' | 'delivaryAddress' | 'cart' | 'orders' | 'orderBeneficiaries' | 'payments' | 'lastLogin' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: UserWhereInput
        uniqueWhere: UserWhereUniqueInput
        create: UserCreateInput
        update: UserUpdateInput
        orderBy: UserOrderByInput
      }
      prisma: {
        create: ResolvedUserCreateInput
        update: ResolvedUserUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type DelivaryAddress<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.DelivaryAddress.TypeInfo<Session>>
  namespace DelivaryAddress {
    export type Item = import('../prisma/client').DelivaryAddress
    export type TypeInfo<Session = any> = {
      key: 'DelivaryAddress'
      isSingleton: false
      fields: 'id' | 'user' | 'orders' | 'address' | 'apartmentNumber' | 'floor' | 'intercomCode' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: DelivaryAddressWhereInput
        uniqueWhere: DelivaryAddressWhereUniqueInput
        create: DelivaryAddressCreateInput
        update: DelivaryAddressUpdateInput
        orderBy: DelivaryAddressOrderByInput
      }
      prisma: {
        create: ResolvedDelivaryAddressCreateInput
        update: ResolvedDelivaryAddressUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type Product<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.Product.TypeInfo<Session>>
  namespace Product {
    export type Item = import('../prisma/client').Product
    export type TypeInfo<Session = any> = {
      key: 'Product'
      isSingleton: false
      fields: 'id' | 'categories' | 'name' | 'slug' | 'baseDescription' | 'type' | 'variantType' | 'fillings' | 'mixBoxProduct' | 'preparationDays' | 'isAvailable' | 'badge' | 'images' | 'video' | 'customizations' | 'topping' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: ProductWhereInput
        uniqueWhere: ProductWhereUniqueInput
        create: ProductCreateInput
        update: ProductUpdateInput
        orderBy: ProductOrderByInput
      }
      prisma: {
        create: ResolvedProductCreateInput
        update: ResolvedProductUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type ProductFilling<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.ProductFilling.TypeInfo<Session>>
  namespace ProductFilling {
    export type Item = import('../prisma/client').ProductFilling
    export type TypeInfo<Session = any> = {
      key: 'ProductFilling'
      isSingleton: false
      fields: 'id' | 'products' | 'name' | 'slug' | 'hasDetails' | 'description' | 'carbonhydrate' | 'calories' | 'protein' | 'fat' | 'ingredients' | 'image_icon' | 'variants' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: ProductFillingWhereInput
        uniqueWhere: ProductFillingWhereUniqueInput
        create: ProductFillingCreateInput
        update: ProductFillingUpdateInput
        orderBy: ProductFillingOrderByInput
      }
      prisma: {
        create: ResolvedProductFillingCreateInput
        update: ResolvedProductFillingUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type ProductImage<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.ProductImage.TypeInfo<Session>>
  namespace ProductImage {
    export type Item = import('../prisma/client').ProductImage
    export type TypeInfo<Session = any> = {
      key: 'ProductImage'
      isSingleton: false
      fields: 'id' | 'product' | 'image' | 'altText' | 'isMain' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: ProductImageWhereInput
        uniqueWhere: ProductImageWhereUniqueInput
        create: ProductImageCreateInput
        update: ProductImageUpdateInput
        orderBy: ProductImageOrderByInput
      }
      prisma: {
        create: ResolvedProductImageCreateInput
        update: ResolvedProductImageUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type ProductVariant<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.ProductVariant.TypeInfo<Session>>
  namespace ProductVariant {
    export type Item = import('../prisma/client').ProductVariant
    export type TypeInfo<Session = any> = {
      key: 'ProductVariant'
      isSingleton: false
      fields: 'id' | 'filling' | 'weight' | 'pieces' | 'size' | 'price' | 'serving' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: ProductVariantWhereInput
        uniqueWhere: ProductVariantWhereUniqueInput
        create: ProductVariantCreateInput
        update: ProductVariantUpdateInput
        orderBy: ProductVariantOrderByInput
      }
      prisma: {
        create: ResolvedProductVariantCreateInput
        update: ResolvedProductVariantUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type Category<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.Category.TypeInfo<Session>>
  namespace Category {
    export type Item = import('../prisma/client').Category
    export type TypeInfo<Session = any> = {
      key: 'Category'
      isSingleton: false
      fields: 'id' | 'name' | 'slug' | 'parent' | 'isAvailable' | 'products' | 'priority' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: CategoryWhereInput
        uniqueWhere: CategoryWhereUniqueInput
        create: CategoryCreateInput
        update: CategoryUpdateInput
        orderBy: CategoryOrderByInput
      }
      prisma: {
        create: ResolvedCategoryCreateInput
        update: ResolvedCategoryUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type CustomizationOption<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.CustomizationOption.TypeInfo<Session>>
  namespace CustomizationOption {
    export type Item = import('../prisma/client').CustomizationOption
    export type TypeInfo<Session = any> = {
      key: 'CustomizationOption'
      isSingleton: false
      fields: 'id' | 'product' | 'name' | 'slug' | 'customValues' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: CustomizationOptionWhereInput
        uniqueWhere: CustomizationOptionWhereUniqueInput
        create: CustomizationOptionCreateInput
        update: CustomizationOptionUpdateInput
        orderBy: CustomizationOptionOrderByInput
      }
      prisma: {
        create: ResolvedCustomizationOptionCreateInput
        update: ResolvedCustomizationOptionUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type CustomizationOptionValue<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.CustomizationOptionValue.TypeInfo<Session>>
  namespace CustomizationOptionValue {
    export type Item = import('../prisma/client').CustomizationOptionValue
    export type TypeInfo<Session = any> = {
      key: 'CustomizationOptionValue'
      isSingleton: false
      fields: 'id' | 'option' | 'value' | 'extraPrice' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: CustomizationOptionValueWhereInput
        uniqueWhere: CustomizationOptionValueWhereUniqueInput
        create: CustomizationOptionValueCreateInput
        update: CustomizationOptionValueUpdateInput
        orderBy: CustomizationOptionValueOrderByInput
      }
      prisma: {
        create: ResolvedCustomizationOptionValueCreateInput
        update: ResolvedCustomizationOptionValueUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type Topping<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.Topping.TypeInfo<Session>>
  namespace Topping {
    export type Item = import('../prisma/client').Topping
    export type TypeInfo<Session = any> = {
      key: 'Topping'
      isSingleton: false
      fields: 'id' | 'products' | 'name' | 'slug' | 'options' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: ToppingWhereInput
        uniqueWhere: ToppingWhereUniqueInput
        create: ToppingCreateInput
        update: ToppingUpdateInput
        orderBy: ToppingOrderByInput
      }
      prisma: {
        create: ResolvedToppingCreateInput
        update: ResolvedToppingUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type ToppingOption<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.ToppingOption.TypeInfo<Session>>
  namespace ToppingOption {
    export type Item = import('../prisma/client').ToppingOption
    export type TypeInfo<Session = any> = {
      key: 'ToppingOption'
      isSingleton: false
      fields: 'id' | 'topping' | 'weight' | 'pieces' | 'extraPrice' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: ToppingOptionWhereInput
        uniqueWhere: ToppingOptionWhereUniqueInput
        create: ToppingOptionCreateInput
        update: ToppingOptionUpdateInput
        orderBy: ToppingOptionOrderByInput
      }
      prisma: {
        create: ResolvedToppingOptionCreateInput
        update: ResolvedToppingOptionUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type Cart<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.Cart.TypeInfo<Session>>
  namespace Cart {
    export type Item = import('../prisma/client').Cart
    export type TypeInfo<Session = any> = {
      key: 'Cart'
      isSingleton: false
      fields: 'id' | 'sessionId' | 'user' | 'cartItems' | 'subTotal' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: CartWhereInput
        uniqueWhere: CartWhereUniqueInput
        create: CartCreateInput
        update: CartUpdateInput
        orderBy: CartOrderByInput
      }
      prisma: {
        create: ResolvedCartCreateInput
        update: ResolvedCartUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type CartItem<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.CartItem.TypeInfo<Session>>
  namespace CartItem {
    export type Item = import('../prisma/client').CartItem
    export type TypeInfo<Session = any> = {
      key: 'CartItem'
      isSingleton: false
      fields: 'id' | 'cart' | 'product' | 'variant' | 'toppingOption' | 'compositions' | 'customizations' | 'quantity' | 'unitPrice' | 'subTotal' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: CartItemWhereInput
        uniqueWhere: CartItemWhereUniqueInput
        create: CartItemCreateInput
        update: CartItemUpdateInput
        orderBy: CartItemOrderByInput
      }
      prisma: {
        create: ResolvedCartItemCreateInput
        update: ResolvedCartItemUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type Order<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.Order.TypeInfo<Session>>
  namespace Order {
    export type Item = import('../prisma/client').Order
    export type TypeInfo<Session = any> = {
      key: 'Order'
      isSingleton: false
      fields: 'id' | 'orderIntent' | 'user' | 'orderReceiver' | 'orderDetails' | 'orderItems' | 'orderNumber' | 'shippingCost' | 'subTotalAmount' | 'totalAmount' | 'status' | 'payment' | 'deliveryOption' | 'virtualDeliveryDate' | 'deliveryDate' | 'deliveryAddress' | 'note' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: OrderWhereInput
        uniqueWhere: OrderWhereUniqueInput
        create: OrderCreateInput
        update: OrderUpdateInput
        orderBy: OrderOrderByInput
      }
      prisma: {
        create: ResolvedOrderCreateInput
        update: ResolvedOrderUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type OrderReceiver<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.OrderReceiver.TypeInfo<Session>>
  namespace OrderReceiver {
    export type Item = import('../prisma/client').OrderReceiver
    export type TypeInfo<Session = any> = {
      key: 'OrderReceiver'
      isSingleton: false
      fields: 'id' | 'benefactor' | 'order' | 'name' | 'phoneNumber' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: OrderReceiverWhereInput
        uniqueWhere: OrderReceiverWhereUniqueInput
        create: OrderReceiverCreateInput
        update: OrderReceiverUpdateInput
        orderBy: OrderReceiverOrderByInput
      }
      prisma: {
        create: ResolvedOrderReceiverCreateInput
        update: ResolvedOrderReceiverUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type OrderItem<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.OrderItem.TypeInfo<Session>>
  namespace OrderItem {
    export type Item = import('../prisma/client').OrderItem
    export type TypeInfo<Session = any> = {
      key: 'OrderItem'
      isSingleton: false
      fields: 'id' | 'order' | 'product' | 'variant' | 'toppingOption' | 'compositions' | 'customizations' | 'quantity' | 'unitPrice' | 'subTotal' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: OrderItemWhereInput
        uniqueWhere: OrderItemWhereUniqueInput
        create: OrderItemCreateInput
        update: OrderItemUpdateInput
        orderBy: OrderItemOrderByInput
      }
      prisma: {
        create: ResolvedOrderItemCreateInput
        update: ResolvedOrderItemUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type Payment<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.Payment.TypeInfo<Session>>
  namespace Payment {
    export type Item = import('../prisma/client').Payment
    export type TypeInfo<Session = any> = {
      key: 'Payment'
      isSingleton: false
      fields: 'id' | 'user' | 'order' | 'yooMoneyId' | 'redirectUrl' | 'confirmationUrl' | 'amount' | 'method' | 'status' | 'paidAt' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: PaymentWhereInput
        uniqueWhere: PaymentWhereUniqueInput
        create: PaymentCreateInput
        update: PaymentUpdateInput
        orderBy: PaymentOrderByInput
      }
      prisma: {
        create: ResolvedPaymentCreateInput
        update: ResolvedPaymentUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type ProductHomeBanner<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.ProductHomeBanner.TypeInfo<Session>>
  namespace ProductHomeBanner {
    export type Item = import('../prisma/client').ProductHomeBanner
    export type TypeInfo<Session = any> = {
      key: 'ProductHomeBanner'
      isSingleton: false
      fields: 'id' | 'product' | 'bannerText' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: ProductHomeBannerWhereInput
        uniqueWhere: ProductHomeBannerWhereUniqueInput
        create: ProductHomeBannerCreateInput
        update: ProductHomeBannerUpdateInput
        orderBy: ProductHomeBannerOrderByInput
      }
      prisma: {
        create: ResolvedProductHomeBannerCreateInput
        update: ResolvedProductHomeBannerUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type CustomizeImage<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.CustomizeImage.TypeInfo<Session>>
  namespace CustomizeImage {
    export type Item = import('../prisma/client').CustomizeImage
    export type TypeInfo<Session = any> = {
      key: 'CustomizeImage'
      isSingleton: false
      fields: 'id' | 'image' | 'altText' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: CustomizeImageWhereInput
        uniqueWhere: CustomizeImageWhereUniqueInput
        create: CustomizeImageCreateInput
        update: CustomizeImageUpdateInput
        orderBy: CustomizeImageOrderByInput
      }
      prisma: {
        create: ResolvedCustomizeImageCreateInput
        update: ResolvedCustomizeImageUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type FeaturedProduct<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.FeaturedProduct.TypeInfo<Session>>
  namespace FeaturedProduct {
    export type Item = import('../prisma/client').FeaturedProduct
    export type TypeInfo<Session = any> = {
      key: 'FeaturedProduct'
      isSingleton: false
      fields: 'id' | 'products' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: FeaturedProductWhereInput
        uniqueWhere: FeaturedProductWhereUniqueInput
        create: FeaturedProductCreateInput
        update: FeaturedProductUpdateInput
        orderBy: FeaturedProductOrderByInput
      }
      prisma: {
        create: ResolvedFeaturedProductCreateInput
        update: ResolvedFeaturedProductUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type OrderIntent<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.OrderIntent.TypeInfo<Session>>
  namespace OrderIntent {
    export type Item = import('../prisma/client').OrderIntent
    export type TypeInfo<Session = any> = {
      key: 'OrderIntent'
      isSingleton: false
      fields: 'id' | 'intentId' | 'yooMoneyId' | 'paymentId' | 'cart' | 'user' | 'orderReceiver' | 'deliveryAddress' | 'deliveryOption' | 'deliveryDate' | 'note' | 'paymentStatus' | 'shippingCost' | 'totalAmount' | 'order' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: OrderIntentWhereInput
        uniqueWhere: OrderIntentWhereUniqueInput
        create: OrderIntentCreateInput
        update: OrderIntentUpdateInput
        orderBy: OrderIntentOrderByInput
      }
      prisma: {
        create: ResolvedOrderIntentCreateInput
        update: ResolvedOrderIntentUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type MixBoxProduct<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.MixBoxProduct.TypeInfo<Session>>
  namespace MixBoxProduct {
    export type Item = import('../prisma/client').MixBoxProduct
    export type TypeInfo<Session = any> = {
      key: 'MixBoxProduct'
      isSingleton: false
      fields: 'id' | 'product' | 'compositions' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: MixBoxProductWhereInput
        uniqueWhere: MixBoxProductWhereUniqueInput
        create: MixBoxProductCreateInput
        update: MixBoxProductUpdateInput
        orderBy: MixBoxProductOrderByInput
      }
      prisma: {
        create: ResolvedMixBoxProductCreateInput
        update: ResolvedMixBoxProductUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
  export type ProductVideo<Session = any> = import('@keystone-6/core/types').ListConfig<Lists.ProductVideo.TypeInfo<Session>>
  namespace ProductVideo {
    export type Item = import('../prisma/client').ProductVideo
    export type TypeInfo<Session = any> = {
      key: 'ProductVideo'
      isSingleton: false
      fields: 'id' | 'product' | 'video' | 'createdAt' | 'updatedAt'
      actions: never
      item: Item
      inputs: {
        where: ProductVideoWhereInput
        uniqueWhere: ProductVideoWhereUniqueInput
        create: ProductVideoCreateInput
        update: ProductVideoUpdateInput
        orderBy: ProductVideoOrderByInput
      }
      prisma: {
        create: ResolvedProductVideoCreateInput
        update: ResolvedProductVideoUpdateInput
      }
      all: __TypeInfo<Session>
    }
  }
}
export type Context<Session = any> = import('@keystone-6/core/types').KeystoneContext<TypeInfo<Session>>
export type Config<Session = any> = import('@keystone-6/core/types').KeystoneConfig<TypeInfo<Session>>

export type TypeInfo<Session = any> = {
  lists: {
    readonly User: Lists.User.TypeInfo<Session>
    readonly DelivaryAddress: Lists.DelivaryAddress.TypeInfo<Session>
    readonly Product: Lists.Product.TypeInfo<Session>
    readonly ProductFilling: Lists.ProductFilling.TypeInfo<Session>
    readonly ProductImage: Lists.ProductImage.TypeInfo<Session>
    readonly ProductVariant: Lists.ProductVariant.TypeInfo<Session>
    readonly Category: Lists.Category.TypeInfo<Session>
    readonly CustomizationOption: Lists.CustomizationOption.TypeInfo<Session>
    readonly CustomizationOptionValue: Lists.CustomizationOptionValue.TypeInfo<Session>
    readonly Topping: Lists.Topping.TypeInfo<Session>
    readonly ToppingOption: Lists.ToppingOption.TypeInfo<Session>
    readonly Cart: Lists.Cart.TypeInfo<Session>
    readonly CartItem: Lists.CartItem.TypeInfo<Session>
    readonly Order: Lists.Order.TypeInfo<Session>
    readonly OrderReceiver: Lists.OrderReceiver.TypeInfo<Session>
    readonly OrderItem: Lists.OrderItem.TypeInfo<Session>
    readonly Payment: Lists.Payment.TypeInfo<Session>
    readonly ProductHomeBanner: Lists.ProductHomeBanner.TypeInfo<Session>
    readonly CustomizeImage: Lists.CustomizeImage.TypeInfo<Session>
    readonly FeaturedProduct: Lists.FeaturedProduct.TypeInfo<Session>
    readonly OrderIntent: Lists.OrderIntent.TypeInfo<Session>
    readonly MixBoxProduct: Lists.MixBoxProduct.TypeInfo<Session>
    readonly ProductVideo: Lists.ProductVideo.TypeInfo<Session>
  }
  prisma: import('../prisma/client').PrismaClient
  prismaClientOptions: import('../prisma/client').Prisma.PrismaClientOptions
  session: Session
  dbProvider: 'postgresql'
}

type __TypeInfo<Session = any> = TypeInfo<Session>

export type Lists<Session = any> = {
  [Key in keyof TypeInfo['lists']]?: import('@keystone-6/core/types').ListConfig<TypeInfo<Session>['lists'][Key]>
} & Record<string, import('@keystone-6/core/types').ListConfig<any>>

export {}
