export function mapProduct(row: {
  id: string;
  image_url: string;
  alt?: string;
  name: string;
  price: number;
  category?: string;
}) {
  return {
    id: row.id,
    src: row.image_url,
    alt: row.alt ?? row.name,
    name: row.name,
    price: `₦${Number(row.price).toLocaleString()}`,
    category: row.category,
  };
}
