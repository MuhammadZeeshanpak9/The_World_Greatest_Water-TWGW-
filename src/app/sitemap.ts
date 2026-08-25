import type { MetadataRoute } from "next";
import { getPublishedBlogPosts } from "@/lib/blogs";
import { getCourses } from "@/lib/courses";
import { getProducts } from "@/lib/products";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theworldsgreatestwater.com";

// Without this, Next treats sitemap.ts as static (no dynamic APIs used) and generates it once at
// build time — new blog posts/courses/products wouldn't appear until the next deploy.
export const revalidate = 3600;

const WELLNESS_PATHS = [
  "/wellness",
  "/wellness/body",
  "/wellness/mind",
  "/wellness/soul",
  "/wellness/unlock-the-lock",
];

// Static public pages not already covered by the wellness/shop/courses/blogs buckets above.
const OTHER_PUBLIC_PATHS = [
  "/our-story",
  "/subscription",
  "/gift-cards",
  "/faq",
  "/contact",
  "/creators",
  "/join",
  "/login",
  "/register",
  "/shipping",
  "/privacy-policy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Dynamic slugs come straight from Supabase, per your build-order requirement — a failed
  // fetch degrades to an empty array rather than breaking the whole sitemap.
  const [blogPosts, courses, products] = await Promise.all([
    getPublishedBlogPosts().catch(() => []),
    getCourses(null).catch(() => []),
    getProducts().catch(() => []),
  ]);

  const homepage: MetadataRoute.Sitemap = [{ url: SITE_URL, lastModified: now, priority: 1.0 }];

  const shopAndCourseHubs: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/shop`, lastModified: now, priority: 0.9 },
    { url: `${SITE_URL}/courses`, lastModified: now, priority: 0.9 },
  ];

  const blogsHub: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/blogs`, lastModified: now, priority: 0.8 },
  ];

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blogs/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : now,
    priority: 0.8,
  }));

  const courseEntries: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${SITE_URL}/courses/${course.slug}`,
    lastModified: course.updated_at ? new Date(course.updated_at) : now,
    priority: 0.8,
  }));

  const wellnessEntries: MetadataRoute.Sitemap = WELLNESS_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    priority: 0.8,
  }));

  const otherPublicEntries: MetadataRoute.Sitemap = OTHER_PUBLIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    priority: 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/shop/${product.slug}`,
    lastModified: now,
    priority: 0.7,
  }));

  const unsubscribeEntry: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/unsubscribe`, lastModified: now, priority: 0.1 },
  ];

  return [
    ...homepage,
    ...shopAndCourseHubs,
    ...blogsHub,
    ...blogEntries,
    ...courseEntries,
    ...wellnessEntries,
    ...otherPublicEntries,
    ...productEntries,
    ...unsubscribeEntry,
  ];
}
