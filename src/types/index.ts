export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
  children?: NavLink[];
};

export type AnnouncementMessage = string;

export type WellnessCard = {
  name: string;
  cta: string;
  blurb: string;
  price?: string;
  description?: string;
  href?: string;
};

export type WellnessFeature = {
  title: string;
  description: string;
};

export type FaqItem = { question: string; answer: string };
export type FaqCategory = { category: string; items: FaqItem[] };

/** Generic {title, description} shape reused by steps + course benefit cards. */
export type TitledItem = { title: string; description: string };

export type SubscriptionPlan = {
  name: string;
  badge: string;
  badgeTone: "teal" | "violet";
  price16oz: string;
  price1L: string;
  features: string[];
  ctaLabel: string;
};

export type GiftTier = { name: string; price: string; description: string };
export type PolicySection = { heading: string; body: string };
export type ShippingInfoCard = { title: string; value: string };

export type BookingTier = { label: string; price: string };

export type WellnessSession = {
  heading: string;
  subheading?: string;
  description: string;
  extraParagraph?: string;
};

export type WellnessOffering = {
  heading: string;
  image?: string;
  secondaryImage?: string;
  hasSecondaryImage?: boolean;
  hasPrimaryImage?: boolean;
  heroArt?: "go-within";
  imagePlain?: boolean;
  tagline?: string;
  bodyParagraphs?: string[];
  session?: WellnessSession;
  bookingTiers?: BookingTier[];
  bookingLabel?: string;
  pricingLabel?: string;
  price1yr?: string;
  price2yr?: string;
  membershipOptions?: string[];
  winWinText?: string;
  contactEmail?: string;
  collaboratorPitch?: string;
  collaboratorItems?: string[];
};

export type WellnessSubPage = {
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  description: string;
  video?: string;
  features: WellnessFeature[];
  bookingHeading: string;
  bookingBody: string;
  ctaLabel: string;
  tone: "standard" | "premium";
  showCalendar: boolean;
  pricingLabel?: string;
  price1yr?: string;
  price2yr?: string;
  pricingNote?: string;
  offerings?: WellnessOffering[];
};

export type Bottle = {
  name: string;
  chakra: string;
  color: string; // hex accent (chakra matched)
  blurb: string;
  placeholder?: boolean;
  image?: string;
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

/** Supabase-backed product row (src/app/api/admin/products, products table). */
export type DbProduct = {
  id: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  price: number;
  per_unit: string | null;
  category: string;
  status: ProductStatus;
  slug: string;
  image_url: string | null;
  created_at: string;
};

/** Supabase-backed blog post row (src/app/api/admin/blog-posts, blog_posts table). */
export type DbBlogPost = {
  id: string;
  slug: string;
  title: string;
  teaser: string | null;
  content: string | null;
  topic: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  teaser: string;
  topic?: string;
  openingStatement?: string;
  bodyParagraphs?: string[];
  pullQuote?: string;
  closingReflection?: string;
};

export type ProcessStep = {
  label: string;
  color: string;
  description: string;
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
  links: { label: string; href: string; external?: boolean }[];
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
