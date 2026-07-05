import type {
  NavLink,
  AnnouncementMessage,
  WellnessCard,
  Feature,
  Bottle,
  Product,
  BlogPost,
  ProcessStep,
  ComingSoonProduct,
  Testimonial,
  FooterColumn,
  Social,
  TrendingCircle,
  VideoCard,
} from "@/types";

/* ------------------------------------------------------------------
   BRAND
------------------------------------------------------------------ */
export const BRAND = {
  name: "THE WORLD'S GREATEST WATER",
  short: "ELEV8 WATER",
  tagline: "ELEV8 YOUR LIFE",
} as const;

/* ------------------------------------------------------------------
   The 12 "How to ELEV8 ..." blog topics (real site content)
------------------------------------------------------------------ */
export const BLOG_TOPICS = [
  "ALL",
  "YOU",
  "LOVE",
  "DESIRE",
  "ENERGY",
  "BELIEVE",
  "VIBRATION",
  "MINDSET",
  "GRATITUDE",
  "FREQUENCY",
  "THOUGHTS",
  "CONSCIOUSNESS",
] as const;

/* ------------------------------------------------------------------
   BLOG POSTS — 12 real "How to ELEV8 X" topics + 1 bonus post.
   Live-site body text confirmed empty for all 12 topic posts (banner
   image + date only) — /blogs/[slug] renders these as clearly-marked
   placeholder body copy. The bonus post has real crawled content.
------------------------------------------------------------------ */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-elev8-all",
    topic: "ALL",
    title: "How to ELEV8 ALL",
    teaser: "Everyone without Exception. The GRAND DESIGN.",
  },
  {
    slug: "how-to-elev8-you",
    topic: "YOU",
    title: "How to ELEV8 YOU",
    teaser: "The power within YOU. Discover your highest self.",
  },
  {
    slug: "how-to-elev8-love",
    topic: "LOVE",
    title: "How to ELEV8 LOVE",
    teaser: "Love is the highest vibration. Learn to embody it.",
  },
  {
    slug: "how-to-elev8-desire",
    topic: "DESIRE",
    title: "How to ELEV8 DESIRE",
    teaser: "Desire is the beginning of all creation.",
  },
  {
    slug: "how-to-elev8-energy",
    topic: "ENERGY",
    title: "How to ELEV8 ENERGY",
    teaser: "Energy flows where attention goes.",
  },
  {
    slug: "how-to-elev8-believe",
    topic: "BELIEVE",
    title: "How to ELEV8 BELIEVE",
    teaser: "Belief is the foundation of all achievement.",
  },
  {
    slug: "how-to-elev8-vibration",
    topic: "VIBRATION",
    title: "How to ELEV8 VIBRATION",
    teaser: "Raise your vibration. Raise your reality.",
  },
  {
    slug: "how-to-elev8-mindset",
    topic: "MINDSET",
    title: "How to ELEV8 MINDSET",
    teaser: "Your mindset creates your world.",
  },
  {
    slug: "how-to-elev8-gratitude",
    topic: "GRATITUDE",
    title: "How to ELEV8 GRATITUDE",
    teaser: "Gratitude transforms what you have into enough.",
  },
  {
    slug: "how-to-elev8-frequency",
    topic: "FREQUENCY",
    title: "How to ELEV8 FREQUENCY",
    teaser: "528Hz — the frequency of love and healing.",
  },
  {
    slug: "how-to-elev8-thoughts",
    topic: "THOUGHTS",
    title: "How to ELEV8 THOUGHTS",
    teaser: "Your thoughts are the driving force of your reality.",
  },
  {
    slug: "how-to-elev8-consciousness",
    topic: "CONSCIOUSNESS",
    title: "How to ELEV8 CONSCIOUSNESS",
    teaser: "Expand your awareness. Expand your life.",
  },
  {
    slug: "how-our-thoughts-can-affect-water",
    title: "How Our Thoughts Can Affect Water",
    teaser: "The science behind Dr. Masaru Emoto's research.",
  },
];

/* ------------------------------------------------------------------
   NAVIGATION (real site structure)
------------------------------------------------------------------ */
export const NAV_LINKS: NavLink[] = [
  { label: "Hi YOU", href: "/hi-you" },
  { label: "Our Story", href: "/our-story" },
  {
    label: "Wellness",
    href: "/wellness",
    children: [
      { label: "With You In Mind", href: "/wellness/with-you-in-mind" },
      { label: "Body", href: "/wellness/body" },
      { label: "Mind", href: "/wellness/mind" },
      { label: "Soul", href: "/wellness/soul" },
      { label: "Unlock The Lock", href: "/wellness/unlock-the-lock" },
    ],
  },
  {
    label: "Shop To ELEV8",
    href: "/shop",
    children: [
      { label: "Your Personal Water", href: "/shop/personal-water" },
      { label: "Subscription", href: "/shop/subscription" },
      { label: "Love Gift", href: "/shop/love-gift" },
      { label: "Clothing", href: "/shop/clothing" },
    ],
  },
  { label: "Trending", href: "/trending" },
  {
    label: "Blogs",
    href: "/blogs",
    children: BLOG_TOPICS.map((t) => ({
      label: `How to ELEV8 ${t}`,
      href: `/blogs/how-to-elev8-${t.toLowerCase()}`,
    })),
  },
  { label: "Creators", href: "/creators" },
  { label: "Join To ELEV8", href: "/join" },
  { label: "Say Hello", href: "/contact" },
];

/* ------------------------------------------------------------------
   ANNOUNCEMENT BAR (rotating)
------------------------------------------------------------------ */
export const ANNOUNCEMENTS: AnnouncementMessage[] = [
  "ULTRA-PURIFIED · 528HZ FREQUENCY INFUSED",
  "1 WATER. 12 UNDERSTANDING.",
  "FREE FROM ADDITIVES · THE WORLD'S GREATEST WATER",
];

/* ------------------------------------------------------------------
   WELLNESS CARDS (real names — homepage teaser hides price,
   dedicated /wellness page shows price + description)
------------------------------------------------------------------ */
export const WELLNESS_CARDS: WellnessCard[] = [
  {
    name: "Thank You Body",
    cta: "Book Session",
    blurb: "Physical wellness & vitality",
    price: "$5,000+",
    description:
      "Physical and mental wellness experience. Complete body transformation.",
  },
  {
    name: "Thank You Mind",
    cta: "Book Session",
    blurb: "Mental clarity & preservation",
    price: "$2,500+",
    description:
      "Mental clarity, consciousness elevation. Unlock the power of your mind.",
  },
  {
    name: "Thank You Soul",
    cta: "Book Session",
    blurb: "Inner peace & alignment",
    price: "$5,000+",
    description: "Deep spiritual wellness. Reconnect with your highest self.",
  },
  {
    name: "Unlock The Lock",
    cta: "Enquire",
    blurb: "The ultimate transformation",
    price: "$1,000,000+",
    description: "The ultimate transformation experience.",
  },
];

/* ------------------------------------------------------------------
   PRODUCT BANNER — what's NOT in your water
------------------------------------------------------------------ */
export const NOT_IN_WATER: Feature[] = [
  "No artificial additives",
  "No added sugars or sweeteners",
  "No synthetic minerals",
  "No microplastics",
  "Nothing between you and your highest self",
];

/* ------------------------------------------------------------------
   12 INSPIRATIONAL BOTTLES — the 12 Understanding
   (real names; chakra colours; blurbs marked placeholder)
------------------------------------------------------------------ */
export const BOTTLES: Bottle[] = [
  { name: "ALL", chakra: "Crown", color: "#6b2fa0", blurb: "The whole of you, elevated.", placeholder: true },
  { name: "YOU", chakra: "Third Eye", color: "#4b3fa0", blurb: "See yourself clearly.", placeholder: true },
  { name: "LOVE", chakra: "Heart", color: "#3fa06b", blurb: "Lead with the heart.", placeholder: true },
  { name: "DESIRE", chakra: "Sacral", color: "#e08a3c", blurb: "Fuel your wanting.", placeholder: true },
  { name: "ENERGY", chakra: "Solar Plexus", color: "#e0c23c", blurb: "Rise with intention.", placeholder: true },
  { name: "BELIEVE", chakra: "Throat", color: "#3c8ae0", blurb: "Speak it into being.", placeholder: true },
  { name: "VIBRATION", chakra: "Sacral", color: "#d13c8a", blurb: "Tune to a higher note.", placeholder: true },
  { name: "MINDSET", chakra: "Third Eye", color: "#3c5fe0", blurb: "Reframe everything.", placeholder: true },
  { name: "GRATITUDE", chakra: "Heart", color: "#e03c9f", blurb: "Give thanks, always.", placeholder: true },
  { name: "FREQUENCY", chakra: "Crown", color: "#3cd6e0", blurb: "528hz in every drop.", placeholder: true },
  { name: "THOUGHTS", chakra: "Crown", color: "#c9a84c", blurb: "You are what you think.", placeholder: true },
  { name: "CONSCIOUSNESS", chakra: "Crown", color: "#3d1a5e", blurb: "Wake up to yourself.", placeholder: true },
];

/* ------------------------------------------------------------------
   SHOP — full 6-product catalog (prices updated per client)
------------------------------------------------------------------ */
export const SHOP_PRODUCTS: Product[] = [
  {
    name: "ELEV8 WATER 16.9 FL OZ",
    subtitle: "Case of 12",
    price: "$47.77",
    perUnit: "$3.98/bottle",
    category: "Water Bottles",
    status: "sold-out",
    slug: "elev8-water-16-9-fl-oz",
    cta: "Notify Me",
    description:
      "Enjoy the smooth taste of ELEV8 WATER your personal water created for your everyday life, free from all Additives, Chlorine, Fluoride, and Sodium Bicarbonate.",
  },
  {
    name: "ELEV8 WATER 1 LITER",
    subtitle: "Case of 12",
    price: "$77.77",
    perUnit: "$6.48/bottle",
    category: "Water Bottles",
    status: "sold-out",
    slug: "elev8-water-1-liter",
    cta: "Notify Me",
    description:
      "Ultra-purified 1 Liter ELEV8 WATER. Your personal water for everyday life.",
  },
  {
    name: "LOVE GIFT",
    subtitle: "Gift Set",
    price: "from $44.99",
    category: "Gift Cards",
    status: "available",
    slug: "love-gift",
    cta: "Add To Cart",
    description: "Gift the experience of ELEV8 WATER to someone you love.",
  },
  {
    name: "ELEV8 ESSENCE PODS",
    subtitle: "12 Premium Flavors",
    price: "$47.77",
    category: "Essence Pods",
    status: "coming-soon",
    slug: "elev8-essence-pods",
    cta: "Notify Me",
    description:
      "Premium flavor enhancement pods. Citrus Lift, Alpine Mint, Botanical Bloom.",
  },
  {
    name: "ELEV8 SMART BOTTLE",
    subtitle: "Smart Hydration Tracking",
    price: "$77.77",
    category: "Smart Bottles",
    status: "coming-soon",
    slug: "elev8-smart-bottle",
    cta: "Notify Me",
    description:
      "Smart Hydration Tracking, pH Balance Monitoring, Temperature Sensor.",
  },
  {
    name: "ELEV8 FLAVOR CAPS",
    subtitle: "Twistable Caps",
    price: "$47.77",
    category: "Essence Pods",
    status: "coming-soon",
    slug: "elev8-flavor-caps",
    cta: "Notify Me",
    description:
      "12 fruit-inspired twistable flavor caps for your ELEV8 water.",
  },
];

/* ------------------------------------------------------------------
   SCIENTIFIC PROCESS — real ELEV8 chakra system (7 steps)
------------------------------------------------------------------ */
export const PROCESS_STEPS: ProcessStep[] = [
  { chakra: "Crown", label: "To Know", color: "#6b2fa0" },
  { chakra: "Third Eye", label: "To See", color: "#4b3fa0" },
  { chakra: "Throat", label: "To Speak", color: "#3c8ae0" },
  { chakra: "Heart", label: "To Love", color: "#3fa06b" },
  { chakra: "Solar Plexus", label: "To Act", color: "#e0c23c" },
  { chakra: "Sacral", label: "To Feel", color: "#e08a3c" },
  { chakra: "Root", label: "To Be Here", color: "#d13c3c" },
];

/* ------------------------------------------------------------------
   COMING SOON (placeholder, marked)
------------------------------------------------------------------ */
export const COMING_SOON: ComingSoonProduct[] = [
  {
    type: "Subscription",
    description: "Your personal water, delivered on your frequency.",
  },
  {
    type: "ELEV8 Clothing",
    description: "Wear your understanding. Premium apparel line.",
  },
  {
    type: "Love Gift Sets",
    description: "Curated gifting to elevate the ones you love.",
  },
];

/* ------------------------------------------------------------------
   TESTIMONIALS (verbatim from live site)
------------------------------------------------------------------ */
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Anita Green",
    quote:
      "It's Simply WOW! Mental Preservation is key! I always believed in self-healing, did not know 'HOW' until now with ELEV8 WATER.",
  },
  {
    name: "Larry Ola",
    quote: "Great Concept! I see why its THE WORLD'S GREATEST WATER.",
  },
  {
    name: "Jenn",
    quote:
      "I love love this brand! What water brand helps you develop yourself and also gives you very smooth ultra-purified water? Like Seriously",
  },
];

/* ------------------------------------------------------------------
   TRENDING (placeholder, marked)
------------------------------------------------------------------ */
export const TRENDING_CIRCLES: TrendingCircle[] = [
  { badge: "Get 10% Off" },
  { label: "ELEV8 YOU" },
  { label: "528HZ" },
  { label: "LOVE GIFT" },
  { label: "BEHIND THE BRAND" },
];

export const VIDEO_CARDS: VideoCard[] = [
  { title: "How Our Thoughts Can Affect Water" },
  { title: "Inside The World's Greatest Water" },
];

/* ------------------------------------------------------------------
   FOOTER (real links)
------------------------------------------------------------------ */
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Explore",
    links: [
      { label: "Know More", href: "/know-more" },
      { label: "Our Story", href: "/our-story" },
      { label: "Trending", href: "/trending" },
      { label: "Creators", href: "/creators" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Shipping & Friendly Assist?", href: "/shipping" },
      { label: "Say Hello", href: "/contact" },
      { label: "Join To ELEV8", href: "/join" },
      { label: "Collaborators", href: "/collaborators" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
];

export const SOCIALS: Social[] = [
  { name: "Twitter", href: "#", glow: "rgba(29,161,242,0.6)" },
  { name: "Facebook", href: "#", glow: "rgba(59,89,152,0.6)" },
  { name: "Youtube", href: "#", glow: "rgba(255,0,0,0.6)" },
  { name: "Instagram", href: "#", glow: "rgba(107,47,160,0.6)" },
  { name: "Pinterest", href: "#", glow: "rgba(230,0,35,0.6)" },
  { name: "Tiktok", href: "#", glow: "rgba(255,255,255,0.6)" },
];

export const PAYMENTS = [
  "American Express",
  "Apple Pay",
  "Google Pay",
  "Mastercard",
  "PayPal",
  "Shop Pay",
  "Visa",
] as const;
