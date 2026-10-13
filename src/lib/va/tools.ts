import type OpenAI from "openai";
import { getProducts, getProductBySlug } from "@/lib/products";
import { getCourses, getCourseBySlug } from "@/lib/courses";
import { isStripeEnabled } from "@/lib/payments/config";
import { COURSE_PRICE } from "@/lib/payments/coursePayment";

/** price <= 0 means a product's real price hasn't been set yet (e.g. a
 * just-announced coming-soon category) — the model must never state a
 * price for these, only "TBA". */
function formatProductPrice(price: number): string {
  if (price <= 0) return "TBA";
  return `$${price.toFixed(2)}`;
}

/** Courses are free to enroll in; a paid fast-track option only exists
 * when Stripe is actually configured (isStripeEnabled()) — otherwise
 * quoting COURSE_PRICE would claim a payment option that isn't live. */
function formatCoursePrice(): string {
  return isStripeEnabled() ? `$${COURSE_PRICE.toFixed(2)} (optional paid fast-track)` : "Free";
}

export const VA_TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "list_products",
      description:
        "Get the current live product catalog (name, price, status, category) from the shop. Always call this instead of quoting a product price from retrieved knowledge-base text.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "get_product",
      description: "Get live details for one product by its shop slug.",
      parameters: {
        type: "object",
        properties: { slug: { type: "string", description: "The product's URL slug, e.g. elev8-water-16-9-fl-oz" } },
        required: ["slug"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_courses",
      description:
        "Get the current live list of published courses (title, slug, whether free or has a paid option). Always call this instead of quoting a course price from retrieved knowledge-base text.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "get_course",
      description: "Get live details for one course by its slug.",
      parameters: {
        type: "object",
        properties: { slug: { type: "string", description: "The course's URL slug" } },
        required: ["slug"],
      },
    },
  },
];

export async function runVaTool(name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "list_products": {
      const products = await getProducts();
      return JSON.stringify(
        products.map((p) => ({
          name: p.name,
          slug: p.slug,
          category: p.category,
          status: p.status,
          price: formatProductPrice(p.price),
        })),
      );
    }
    case "get_product": {
      const slug = typeof args.slug === "string" ? args.slug : "";
      const product = slug ? await getProductBySlug(slug) : null;
      if (!product) return JSON.stringify({ found: false });
      return JSON.stringify({
        found: true,
        name: product.name,
        slug: product.slug,
        category: product.category,
        status: product.status,
        price: formatProductPrice(product.price),
        subtitle: product.subtitle,
        description: product.description,
      });
    }
    case "list_courses": {
      const courses = await getCourses(null);
      return JSON.stringify(
        courses.map((c) => ({
          title: c.title,
          slug: c.slug,
          lessonCount: c.lessonCount,
          price: formatCoursePrice(),
        })),
      );
    }
    case "get_course": {
      const slug = typeof args.slug === "string" ? args.slug : "";
      const course = slug ? await getCourseBySlug(slug) : null;
      if (!course) return JSON.stringify({ found: false });
      return JSON.stringify({
        found: true,
        title: course.title,
        slug: course.slug,
        price: formatCoursePrice(),
      });
    }
    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}
