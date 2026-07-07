import type { MetadataRoute } from "next";
import { BLOG_POSTS, SHOP_PRODUCTS } from "@/data/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theworldsgreatestwater.com";

const STATIC_ROUTES = [
  "",
  "/our-story",
  "/wellness",
  "/wellness/body",
  "/wellness/mind",
  "/wellness/soul",
  "/wellness/unlock-the-lock",
  "/shop",
  "/subscription",
  "/gift-cards",
  "/courses",
  "/blogs",
  "/faq",
  "/contact",
  "/creators",
  "/join",
  "/login",
  "/register",
  "/account",
  "/account/orders",
  "/account/subscriptions",
  "/account/courses",
  "/checkout",
  "/checkout/confirmation",
  "/cart",
  "/shipping",
  "/privacy-policy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blogs/${post.slug}`,
    lastModified: now,
  }));

  const courseEntries: MetadataRoute.Sitemap = BLOG_POSTS.filter((post) => post.topic).map(
    (post) => ({
      url: `${SITE_URL}/courses/${post.slug}`,
      lastModified: now,
    }),
  );

  const shopEntries: MetadataRoute.Sitemap = SHOP_PRODUCTS.map((product) => ({
    url: `${SITE_URL}/shop/${product.slug}`,
    lastModified: now,
  }));

  return [...staticEntries, ...blogEntries, ...courseEntries, ...shopEntries];
}
