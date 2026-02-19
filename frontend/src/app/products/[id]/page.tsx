import { getProductById } from "@/shared/api/product";
import { ProductDetails } from "@/widgets/product-details/ui/ProductDetails";
import Header from "@/widgets/header";
type Props = {
  params: { id: string };
};
export default async function ProductPage({ params }: Props) {
  const product = await getProductById(Number(params.id));
  return (
    <>
      <Header />
      <ProductDetails product={product}></ProductDetails>
    </>
  );
}
