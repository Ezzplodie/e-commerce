import { getProductBySlug } from "@/shared/api/product";
import { ProductDetails } from "@/widgets/product-details/ui/ProductDetails";
import Header from "@/widgets/header";
type Props = {
  params: Promise<{ slug: string }>;
};
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return (
    <>
      <Header />
      <ProductDetails product={product}></ProductDetails>
    </>
  );
}
