import { getProductBySlug } from "@/shared/api/product";
import { ProductDetails } from "@/widgets/product-details";
import Header from "@/widgets/header";
import Footer from "@/widgets/footer";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return (
    <>
      <Header />
      <main>
        <ProductDetails product={product} />
      </main>
      <Footer />
    </>
  );
}
