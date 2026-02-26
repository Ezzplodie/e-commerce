import { getProductBySlug } from "@/shared/api/product";
import { ProductDetails } from "@/widgets/product-details/ui/ProductDetails";
import Header from "@/widgets/header";
type Props = {
  params: { slug: string };
};
export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  return (
    <>
      <Header />
      <ProductDetails product={product}></ProductDetails>
    </>
  );
}
