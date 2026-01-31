-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL DEFAULT '',
    "isPhoneNumberVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneNumberToken" TEXT,
    "phoneNumberVerificationIssuedAt" TIMESTAMP(3),
    "phoneNumberVerificationRedeemedAt" TIMESTAMP(3),
    "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "passwordResetToken" TEXT,
    "passwordResetIssuedAt" TIMESTAMP(3),
    "passwordResetRedeemedAt" TIMESTAMP(3),
    "firstOrderDiscountEligible" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DelivaryAddress" (
    "id" UUID NOT NULL,
    "user" UUID,
    "address" TEXT NOT NULL DEFAULT '',
    "apartmentNumber" TEXT NOT NULL DEFAULT '',
    "floor" TEXT NOT NULL DEFAULT '',
    "intercomCode" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "DelivaryAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "baseDescription" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL,
    "variantType" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "badge" TEXT,
    "video" UUID,
    "topping" UUID,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductFilling" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "hasDetails" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL DEFAULT '',
    "carbonhydrate" DECIMAL(5,2),
    "calories" DECIMAL(5,2),
    "protein" DECIMAL(5,2),
    "fat" DECIMAL(5,2),
    "ingredients" TEXT NOT NULL DEFAULT '',
    "image_icon_id" TEXT,
    "image_icon_filesize" INTEGER,
    "image_icon_width" INTEGER,
    "image_icon_height" INTEGER,
    "image_icon_extension" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ProductFilling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" UUID NOT NULL,
    "product" UUID,
    "image_id" TEXT,
    "image_filesize" INTEGER,
    "image_width" INTEGER,
    "image_height" INTEGER,
    "image_extension" TEXT,
    "altText" TEXT NOT NULL DEFAULT '',
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" UUID NOT NULL,
    "filling" UUID,
    "weight" DECIMAL(4,1),
    "pieces" INTEGER,
    "size" INTEGER,
    "price" INTEGER NOT NULL,
    "serving" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "parent" UUID,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomizationOption" (
    "id" UUID NOT NULL,
    "product" UUID,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "CustomizationOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomizationOptionValue" (
    "id" UUID NOT NULL,
    "option" UUID,
    "value" TEXT NOT NULL DEFAULT '',
    "extraPrice" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "CustomizationOptionValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topping" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Topping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToppingOption" (
    "id" UUID NOT NULL,
    "topping" UUID,
    "weight" DECIMAL(5,3),
    "pieces" INTEGER,
    "extraPrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ToppingOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" UUID NOT NULL,
    "sessionId" TEXT,
    "user" UUID,
    "subTotal" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" UUID NOT NULL,
    "cart" UUID,
    "product" UUID,
    "variant" UUID,
    "toppingOption" UUID,
    "compositions" JSONB,
    "customizations" JSONB,
    "quantity" INTEGER DEFAULT 1,
    "unitPrice" INTEGER,
    "subTotal" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" UUID NOT NULL,
    "orderIntent" UUID,
    "user" UUID,
    "orderNumber" TEXT NOT NULL DEFAULT '',
    "shippingCost" INTEGER,
    "subTotalAmount" INTEGER,
    "totalAmount" INTEGER,
    "status" TEXT DEFAULT 'PROCESSING',
    "payment" UUID,
    "deliveryAddress" UUID,
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" UUID NOT NULL,
    "order" UUID,
    "product" UUID,
    "variant" UUID,
    "toppingOption" UUID,
    "compositions" JSONB,
    "customizations" JSONB,
    "quantity" INTEGER,
    "unitPrice" INTEGER,
    "subTotal" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" UUID NOT NULL,
    "user" UUID,
    "yooMoneyId" TEXT NOT NULL DEFAULT '',
    "redirectUrl" TEXT NOT NULL DEFAULT '',
    "confirmationUrl" TEXT NOT NULL DEFAULT '',
    "amount" TEXT NOT NULL DEFAULT '',
    "method" TEXT NOT NULL DEFAULT '',
    "status" TEXT DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductHomeBanner" (
    "id" UUID NOT NULL,
    "product" UUID,
    "bannerText" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ProductHomeBanner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomizeImage" (
    "id" UUID NOT NULL,
    "image_id" TEXT,
    "image_filesize" INTEGER,
    "image_width" INTEGER,
    "image_height" INTEGER,
    "image_extension" TEXT,
    "altText" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "CustomizeImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedProduct" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "FeaturedProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderIntent" (
    "id" UUID NOT NULL,
    "intentId" TEXT NOT NULL DEFAULT '',
    "yooMoneyId" TEXT NOT NULL DEFAULT '',
    "paymentId" TEXT NOT NULL DEFAULT '',
    "cart" UUID,
    "user" UUID,
    "deliveryAddress" UUID,
    "note" TEXT NOT NULL DEFAULT '',
    "paymentStatus" TEXT DEFAULT 'PENDING',
    "shippingCost" INTEGER,
    "totalAmount" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "OrderIntent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MixBoxProduct" (
    "id" UUID NOT NULL,
    "product" UUID,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MixBoxProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVideo" (
    "id" UUID NOT NULL,
    "video_filesize" INTEGER,
    "video_filename" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ProductVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Product_fillings" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_Category_products" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_FeaturedProduct_products" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_MixBoxProduct_compositions" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DelivaryAddress_user_key" ON "DelivaryAddress"("user");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_video_key" ON "Product"("video");

-- CreateIndex
CREATE INDEX "Product_topping_idx" ON "Product"("topping");

-- CreateIndex
CREATE UNIQUE INDEX "ProductFilling_slug_key" ON "ProductFilling"("slug");

-- CreateIndex
CREATE INDEX "ProductImage_product_idx" ON "ProductImage"("product");

-- CreateIndex
CREATE INDEX "ProductVariant_filling_idx" ON "ProductVariant"("filling");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_parent_idx" ON "Category"("parent");

-- CreateIndex
CREATE INDEX "CustomizationOption_product_idx" ON "CustomizationOption"("product");

-- CreateIndex
CREATE INDEX "CustomizationOptionValue_option_idx" ON "CustomizationOptionValue"("option");

-- CreateIndex
CREATE UNIQUE INDEX "Topping_name_key" ON "Topping"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Topping_slug_key" ON "Topping"("slug");

-- CreateIndex
CREATE INDEX "ToppingOption_topping_idx" ON "ToppingOption"("topping");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_sessionId_key" ON "Cart"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_user_key" ON "Cart"("user");

-- CreateIndex
CREATE INDEX "CartItem_cart_idx" ON "CartItem"("cart");

-- CreateIndex
CREATE INDEX "CartItem_product_idx" ON "CartItem"("product");

-- CreateIndex
CREATE INDEX "CartItem_variant_idx" ON "CartItem"("variant");

-- CreateIndex
CREATE INDEX "CartItem_toppingOption_idx" ON "CartItem"("toppingOption");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderIntent_key" ON "Order"("orderIntent");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Order_payment_key" ON "Order"("payment");

-- CreateIndex
CREATE INDEX "Order_user_idx" ON "Order"("user");

-- CreateIndex
CREATE INDEX "Order_deliveryAddress_idx" ON "Order"("deliveryAddress");

-- CreateIndex
CREATE INDEX "OrderItem_order_idx" ON "OrderItem"("order");

-- CreateIndex
CREATE INDEX "OrderItem_product_idx" ON "OrderItem"("product");

-- CreateIndex
CREATE INDEX "OrderItem_variant_idx" ON "OrderItem"("variant");

-- CreateIndex
CREATE INDEX "OrderItem_toppingOption_idx" ON "OrderItem"("toppingOption");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_yooMoneyId_key" ON "Payment"("yooMoneyId");

-- CreateIndex
CREATE INDEX "Payment_user_idx" ON "Payment"("user");

-- CreateIndex
CREATE INDEX "ProductHomeBanner_product_idx" ON "ProductHomeBanner"("product");

-- CreateIndex
CREATE UNIQUE INDEX "OrderIntent_intentId_key" ON "OrderIntent"("intentId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderIntent_yooMoneyId_key" ON "OrderIntent"("yooMoneyId");

-- CreateIndex
CREATE INDEX "OrderIntent_cart_idx" ON "OrderIntent"("cart");

-- CreateIndex
CREATE INDEX "OrderIntent_user_idx" ON "OrderIntent"("user");

-- CreateIndex
CREATE INDEX "OrderIntent_deliveryAddress_idx" ON "OrderIntent"("deliveryAddress");

-- CreateIndex
CREATE UNIQUE INDEX "MixBoxProduct_product_key" ON "MixBoxProduct"("product");

-- CreateIndex
CREATE UNIQUE INDEX "_Product_fillings_AB_unique" ON "_Product_fillings"("A", "B");

-- CreateIndex
CREATE INDEX "_Product_fillings_B_index" ON "_Product_fillings"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Category_products_AB_unique" ON "_Category_products"("A", "B");

-- CreateIndex
CREATE INDEX "_Category_products_B_index" ON "_Category_products"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FeaturedProduct_products_AB_unique" ON "_FeaturedProduct_products"("A", "B");

-- CreateIndex
CREATE INDEX "_FeaturedProduct_products_B_index" ON "_FeaturedProduct_products"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MixBoxProduct_compositions_AB_unique" ON "_MixBoxProduct_compositions"("A", "B");

-- CreateIndex
CREATE INDEX "_MixBoxProduct_compositions_B_index" ON "_MixBoxProduct_compositions"("B");

-- AddForeignKey
ALTER TABLE "DelivaryAddress" ADD CONSTRAINT "DelivaryAddress_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_video_fkey" FOREIGN KEY ("video") REFERENCES "ProductVideo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_topping_fkey" FOREIGN KEY ("topping") REFERENCES "Topping"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_product_fkey" FOREIGN KEY ("product") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_filling_fkey" FOREIGN KEY ("filling") REFERENCES "ProductFilling"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parent_fkey" FOREIGN KEY ("parent") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomizationOption" ADD CONSTRAINT "CustomizationOption_product_fkey" FOREIGN KEY ("product") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomizationOptionValue" ADD CONSTRAINT "CustomizationOptionValue_option_fkey" FOREIGN KEY ("option") REFERENCES "CustomizationOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToppingOption" ADD CONSTRAINT "ToppingOption_topping_fkey" FOREIGN KEY ("topping") REFERENCES "Topping"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cart_fkey" FOREIGN KEY ("cart") REFERENCES "Cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_product_fkey" FOREIGN KEY ("product") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_variant_fkey" FOREIGN KEY ("variant") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_toppingOption_fkey" FOREIGN KEY ("toppingOption") REFERENCES "ToppingOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderIntent_fkey" FOREIGN KEY ("orderIntent") REFERENCES "OrderIntent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_payment_fkey" FOREIGN KEY ("payment") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryAddress_fkey" FOREIGN KEY ("deliveryAddress") REFERENCES "DelivaryAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_fkey" FOREIGN KEY ("order") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_product_fkey" FOREIGN KEY ("product") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variant_fkey" FOREIGN KEY ("variant") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_toppingOption_fkey" FOREIGN KEY ("toppingOption") REFERENCES "ToppingOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductHomeBanner" ADD CONSTRAINT "ProductHomeBanner_product_fkey" FOREIGN KEY ("product") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderIntent" ADD CONSTRAINT "OrderIntent_cart_fkey" FOREIGN KEY ("cart") REFERENCES "Cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderIntent" ADD CONSTRAINT "OrderIntent_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderIntent" ADD CONSTRAINT "OrderIntent_deliveryAddress_fkey" FOREIGN KEY ("deliveryAddress") REFERENCES "DelivaryAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MixBoxProduct" ADD CONSTRAINT "MixBoxProduct_product_fkey" FOREIGN KEY ("product") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Product_fillings" ADD CONSTRAINT "_Product_fillings_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Product_fillings" ADD CONSTRAINT "_Product_fillings_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductFilling"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Category_products" ADD CONSTRAINT "_Category_products_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Category_products" ADD CONSTRAINT "_Category_products_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeaturedProduct_products" ADD CONSTRAINT "_FeaturedProduct_products_A_fkey" FOREIGN KEY ("A") REFERENCES "FeaturedProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeaturedProduct_products" ADD CONSTRAINT "_FeaturedProduct_products_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MixBoxProduct_compositions" ADD CONSTRAINT "_MixBoxProduct_compositions_A_fkey" FOREIGN KEY ("A") REFERENCES "MixBoxProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MixBoxProduct_compositions" ADD CONSTRAINT "_MixBoxProduct_compositions_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

