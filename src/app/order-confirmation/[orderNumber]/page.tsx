import OrderConfirmationClient from "./OrderConfirmationClient";

export function generateStaticParams() {
  return [
    { orderNumber: "ORD-0001" },
    { orderNumber: "ORD-0002" },
    { orderNumber: "ORD-0003" },
    { orderNumber: "demo" },
  ];
}

export default function OrderConfirmationPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  return <OrderConfirmationClient orderNumber={params.orderNumber} />;
}
