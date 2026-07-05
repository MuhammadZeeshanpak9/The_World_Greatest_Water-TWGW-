export type NavLink = {
  label: string;
  href: string;
  children?: NavLink[];
};

export type AnnouncementMessage = string;

export type WellnessCard = {
  name: string;
  cta: string;
  blurb: string;
  price?: string;
  description?: string;
};

export type Feature = string;

export type Bottle = {
  name: string;
  chakra: string;
  color: string; // hex accent (chakra matched)
  blurb: string;
  placeholder?: boolean;
};

export type ProductStatus = "sold-out" | "available" | "coming-soon";

export type ProductCategory =
  | "Water Bottles"
  | "Essence Pods"
  | "Smart Bottles"
  | "Gift Cards";

export type Product = {
  name: string;
  subtitle?: string;
  price: string;
  perUnit?: string;
  category: ProductCategory;
  status: ProductStatus;
  cta: string;
  slug: string;
  description?: string;
  image?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  teaser: string;
  topic?: string;
};

export type ProcessStep = {
  chakra: string;
  label: string; // TO KNOW, TO SEE ...
  color: string;
};

export type ComingSoonProduct = {
  type: string;
  description: string;
};

export type Testimonial = {
  name: string;
  quote: string;
};

export type FooterColumn = {
  heading: string;
  links: { label: string; href: string }[];
};

export type Social = {
  name: string;
  href: string;
  glow: string; // rgba glow color on hover
};

export type TrendingCircle = {
  label?: string;
  badge?: string;
};

export type VideoCard = {
  title: string;
};
