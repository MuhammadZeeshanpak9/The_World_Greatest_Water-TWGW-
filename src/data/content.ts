import type {
  NavLink,
  AnnouncementMessage,
  WellnessCard,
  WellnessSubPage,
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
  FaqItem,
  FaqCategory,
  TitledItem,
  SubscriptionPlan,
  GiftTier,
  PolicySection,
  ShippingInfoCard,
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
  { label: "Hi YOU", href: "/" },
  { label: "Our Story", href: "/our-story" },
  {
    label: "Wellness",
    href: "/wellness",
    children: [
      { label: "With You In Mind", href: "/wellness" },
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
      { label: "Your Personal Water", href: "/shop" },
      { label: "Subscription", href: "/subscription" },
      { label: "Love Gift", href: "/shop/love-gift" },
      { label: "Gift Cards", href: "/gift-cards" },
      { label: "Courses", href: "/courses" },
      { label: "Clothing", href: "https://www.ielev8my.com", external: true },
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
    href: "/wellness/body",
  },
  {
    name: "Thank You Mind",
    cta: "Book Session",
    blurb: "Mental clarity & preservation",
    price: "$2,500+",
    description:
      "Mental clarity, consciousness elevation. Unlock the power of your mind.",
    href: "/wellness/mind",
  },
  {
    name: "Thank You Soul",
    cta: "Book Session",
    blurb: "Inner peace & alignment",
    price: "$5,000+",
    description: "Deep spiritual wellness. Reconnect with your highest self.",
    href: "/wellness/soul",
  },
  {
    name: "Unlock The Lock",
    cta: "Enquire",
    blurb: "The ultimate transformation",
    price: "$1,000,000+",
    description: "The ultimate transformation experience.",
    href: "/wellness/unlock-the-lock",
  },
];

/* ------------------------------------------------------------------
   WELLNESS SUB-PAGES — dedicated /wellness/{body,mind,soul,unlock-the-lock}
------------------------------------------------------------------ */
export const WELLNESS_SUBPAGES: WellnessSubPage[] = [
  {
    slug: "body",
    title: "THANK YOU BODY",
    subtitle: "PHYSICAL WELLNESS EXPERIENCE",
    price: "$5,000+",
    description:
      "A complete physical and mental wellness experience. Your body is your temple — we help you treat it as one. A premium, consciousness-driven transformation designed to elevate your physical experience from the inside out.",
    video: "/videos/wellness-body.mp4",
    features: [
      { title: "BODY TRANSFORMATION", description: "Complete physical wellness overhaul" },
      { title: "MENTAL ALIGNMENT", description: "Mind-body connection techniques" },
      { title: "NUTRITIONAL GUIDANCE", description: "Ultra-purified water nutrition integration" },
      { title: "ONGOING SUPPORT", description: "Continued wellness journey support" },
    ],
    bookingHeading: "READY TO TRANSFORM?",
    bookingBody: "Book your THANK YOU BODY session today. Limited availability.",
    ctaLabel: "ENQUIRE NOW",
    tone: "standard",
    showCalendar: true,
  },
  {
    slug: "mind",
    title: "THANK YOU MIND",
    subtitle: "MENTAL CLARITY EXPERIENCE",
    price: "$2,500+",
    description:
      "Mental clarity, consciousness elevation, and unlocking the true power of your mind. THE WORLD'S GREATEST WATER believes that the mind creates reality — this session gives you the tools to direct that creation intentionally.",
    video: "/videos/wellness-mind.mp4",
    features: [
      { title: "CONSCIOUSNESS EXPANSION", description: "Elevate your awareness to new levels" },
      { title: "THOUGHT MASTERY", description: "Control and direct your thoughts intentionally" },
      { title: "MENTAL CLARITY", description: "Remove blocks and achieve crystal clear focus" },
      { title: "MINDSET REPROGRAMMING", description: "Replace limiting beliefs with empowering ones" },
    ],
    bookingHeading: "READY TO ELEVATE YOUR MIND?",
    bookingBody: "Book your THANK YOU MIND session today. Limited availability.",
    ctaLabel: "ENQUIRE NOW",
    tone: "standard",
    showCalendar: true,
  },
  {
    slug: "soul",
    title: "THANK YOU SOUL",
    subtitle: "SPIRITUAL WELLNESS EXPERIENCE",
    price: "$5,000+",
    description:
      "Deep spiritual wellness. Reconnect with your highest self and experience the profound connection between your soul and the universe. This is the most sacred offering in the ELEV8 WATER wellness ecosystem.",
    video: "/videos/wellness-soul.mp4",
    features: [
      { title: "SOUL RECONNECTION", description: "Rediscover your true spiritual essence" },
      { title: "ENERGY ALIGNMENT", description: "Align your chakras and energy centers" },
      { title: "528HZ IMMERSION", description: "Deep frequency healing experience" },
      { title: "SPIRITUAL GUIDANCE", description: "Personal spiritual mentorship journey" },
    ],
    bookingHeading: "READY TO RECONNECT WITH YOUR SOUL?",
    bookingBody: "Book your THANK YOU SOUL session today. Limited availability.",
    ctaLabel: "ENQUIRE NOW",
    tone: "standard",
    showCalendar: true,
  },
  {
    slug: "unlock-the-lock",
    title: "UNLOCK THE LOCK",
    subtitle: "THE ULTIMATE TRANSFORMATION",
    price: "$1,000,000+",
    description:
      "The ultimate transformation experience. This is not a service — this is a complete life reinvention. Reserved for those who are truly ready to unlock every limitation and step into their greatest version. The most premium wellness experience in the YOUNIVERSE.",
    video: "/videos/wellness-unlock.mp4",
    features: [
      { title: "COMPLETE LIFE REINVENTION", description: "Every area of life elevated simultaneously" },
      { title: "PRIVATE MENTORSHIP", description: "Exclusive 1-on-1 access to the creators" },
      { title: "UNLIMITED ACCESS", description: "Full ELEV8 ecosystem access for life" },
      { title: "LEGACY BUILDING", description: "Create your greatest version for future generations" },
    ],
    bookingHeading: "ARE YOU READY?",
    bookingBody:
      "This experience is by invitation and application only. If you feel called to this level of transformation — reach out.",
    ctaLabel: "APPLY NOW",
    tone: "premium",
    showCalendar: false,
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
      { label: "Know More", href: "/faq" },
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
      { label: "Terms of Service", href: "/terms" },
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

/* ------------------------------------------------------------------
   SUBSCRIPTION
------------------------------------------------------------------ */
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    name: "WEEKLY",
    badge: "MOST FLEXIBLE",
    badgeTone: "teal",
    price16oz: "$47.77/week",
    price1L: "$77.77/week",
    features: [
      "Fresh delivery every week",
      "Pause or cancel anytime",
      "Priority shipping",
      "Exclusive subscriber discounts",
    ],
    ctaLabel: "SUBSCRIBE WEEKLY",
  },
  {
    name: "MONTHLY",
    badge: "BEST VALUE",
    badgeTone: "violet",
    price16oz: "$47.77/month",
    price1L: "$77.77/month",
    features: [
      "Monthly delivery to your door",
      "Save 15% vs single orders",
      "Pause or cancel anytime",
      "Free shipping on all orders",
    ],
    ctaLabel: "SUBSCRIBE MONTHLY",
  },
];

export const SUBSCRIPTION_STEPS: TitledItem[] = [
  { title: "CHOOSE YOUR PLAN", description: "Select weekly or monthly delivery" },
  { title: "RECEIVE YOUR WATER", description: "Fresh ELEV8 WATER delivered to your door" },
  { title: "ELEV8 YOUR LIFE", description: "Set your intention. Drink consciously. Transform." },
];

export const SUBSCRIPTION_FAQ: FaqItem[] = [
  { question: "Can I pause my subscription?", answer: "Yes, pause anytime from your account dashboard with no penalty." },
  { question: "Can I cancel anytime?", answer: "Yes, cancel anytime before your next billing date." },
  { question: "What if I'm not home for delivery?", answer: "Your order will be left safely or returned to depot." },
  { question: "Can I change my plan?", answer: "Yes, switch between weekly and monthly anytime." },
];

/* ------------------------------------------------------------------
   GIFT CARDS
------------------------------------------------------------------ */
export const GIFT_TIERS: GiftTier[] = [
  { name: "STARTER GIFT", price: "$44.99", description: "Perfect introduction to ELEV8 WATER" },
  { name: "PREMIUM GIFT", price: "$77.77", description: "The most popular gift choice" },
  { name: "ULTIMATE GIFT", price: "$147.77", description: "The complete ELEV8 experience" },
];

export const GIFT_STEPS: TitledItem[] = [
  { title: "PURCHASE", description: "Choose your gift card value" },
  { title: "SEND", description: "Delivered instantly to their email" },
  { title: "ELEV8", description: "They choose their ELEV8 WATER products" },
];

/* ------------------------------------------------------------------
   COURSES
------------------------------------------------------------------ */
export const COURSE_BENEFITS: TitledItem[] = [
  { title: "AI-GENERATED CONTENT", description: "Cutting-edge course content created with the most advanced AI" },
  { title: "EVERGREEN ACCESS", description: "Purchase once, access forever — content that never expires" },
  { title: "SELF-DEVELOPMENT", description: "The 12 most important understandings of SELF, delivered digitally" },
];

/* ------------------------------------------------------------------
   FAQ (real content from live site)
------------------------------------------------------------------ */
export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    category: "THE PRODUCT",
    items: [
      { question: "What other brand or product in the world can be compared to THE WORLD'S GREATEST WATER. ELEV8 WATER?", answer: "NONE and NONE will. THE WORLD'S GREATEST WATER. ELEV8 WATER is in its own special lane of GREATNESS!" },
      { question: "What is the simple overview for the brand?", answer: "THE WORLD'S GREATEST WATER. ELEV8 WATER is a proof! The expansion of consciousness birth THE GREATEST BRAND WITH THE GREATEST PRODUCT IN THE WORLD." },
      { question: "Who created THE WORLD'S GREATEST WATER?", answer: "THE GRAND DESIGNER." },
      { question: "What is ELEV8 WATER ultimately?", answer: "The definition of ultra-pure bottled water with a TDS level of 0.00 perfect extraction of chemical additives. Our 7-stage purification process meticulously filters every drop of water over the course of 24 hours." },
      { question: "Is ELEV8 WATER free from harmful chemicals?", answer: "Yes. ELEV8 WATER is arsenic-free, chlorine-free, chromium 6-free, fluoride-free, MTBE-free, pharmaceutical-free, sodium bicarbonate-free, and BPA/BPS-free." },
    ],
  },
  {
    category: "THE ORDERS",
    items: [
      { question: "How do I track my order?", answer: "Order tracking information will be sent to your email once your order ships." },
      { question: "What payment methods do you accept?", answer: "We accept all major credit cards, PayPal, Apple Pay, Google Pay, and cryptocurrency." },
      { question: "Do you ship worldwide?", answer: "Yes, we ship worldwide. Shipping rates are calculated at checkout based on location and weight." },
    ],
  },
  {
    category: "THE SUBSCRIPTION",
    items: [
      { question: "Can I pause my subscription?", answer: "Yes, pause anytime from your account dashboard." },
      { question: "Can I cancel anytime?", answer: "Yes, cancel before your next billing date with no penalty." },
    ],
  },
];

/* ------------------------------------------------------------------
   SHIPPING
------------------------------------------------------------------ */
export const SHIPPING_INFO: ShippingInfoCard[] = [
  { title: "Processing Time", value: "2-3 business days" },
  { title: "Domestic Shipping", value: "5-7 business days" },
  { title: "International Shipping", value: "10-21 business days" },
];

/* ------------------------------------------------------------------
   LEGAL (placeholder professional copy, not legally reviewed)
------------------------------------------------------------------ */
export const PRIVACY_POLICY_SECTIONS: PolicySection[] = [
  { heading: "Information We Collect", body: "We collect information you provide directly to us, such as your name, email address, shipping address, and payment details when you place an order, subscribe to our newsletter, or contact us. We also automatically collect certain technical information, including your IP address, browser type, and browsing behavior on our site." },
  { heading: "How We Use Your Information", body: "We use the information we collect to process orders, deliver products, communicate with you about your account or purchases, improve our products and services, and send marketing communications where you have opted in. We never sell your personal information to third parties." },
  { heading: "Cookies", body: "Our site uses cookies and similar tracking technologies to remember your preferences, understand how you use our site, and personalize your experience. You can control cookie settings through your browser at any time." },
  { heading: "Third Party Services", body: "We work with trusted third-party providers for payment processing, shipping, analytics, and email communications. These providers only receive the information necessary to perform their services and are contractually obligated to protect your data." },
  { heading: "Your Rights", body: "Depending on your location, you may have the right to access, correct, delete, or export your personal information, and to opt out of marketing communications at any time. To exercise any of these rights, please contact us using the details below." },
  { heading: "Contact Us", body: "If you have any questions about this Privacy Policy or how we handle your personal information, please reach out to us through our Say Hello page and our team will respond as soon as possible." },
];

export const TERMS_SECTIONS: PolicySection[] = [
  { heading: "Acceptance", body: "By accessing or using this website, purchasing our products, or creating an account, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our site or services." },
  { heading: "Products", body: "All product descriptions, images, and details are provided for informational purposes and are updated periodically. We reserve the right to modify, discontinue, or limit the availability of any product at any time without prior notice." },
  { heading: "Pricing", body: "All prices are listed in U.S. dollars and are subject to change without notice. We make every effort to display accurate pricing, but in the event of an error, we reserve the right to cancel any order placed at an incorrect price." },
  { heading: "Returns", body: "If you are not fully satisfied with your order, please contact us within 30 days of delivery to arrange a return or exchange. Products must be unopened and in their original condition unless otherwise stated." },
  { heading: "Limitation of Liability", body: "To the fullest extent permitted by law, THE WORLD'S GREATEST WATER shall not be liable for any indirect, incidental, or consequential damages arising from your use of our products or website." },
];
