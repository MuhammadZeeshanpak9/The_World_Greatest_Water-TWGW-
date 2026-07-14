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
    openingStatement:
      "ALL is not a number. ALL is a state of being. When you understand ALL, you understand that nothing and no one is excluded from the grand design of life.",
    bodyParagraphs: [
      "ELEV8 ALL begins with the radical understanding that every soul on this planet — without exception — carries the same divine spark within them. The person next to you on the street, the stranger across the world, the one who challenges you most — ALL are expressions of the same universal consciousness experiencing itself in different forms.",
      "When we choose to see ALL as ONE, competition dissolves into collaboration. Judgment transforms into curiosity. Fear becomes love. This is not a spiritual concept reserved for monks and mystics — this is the practical understanding that the most successful, fulfilled human beings on earth have always known.",
      "Every bottle of ELEV8 WATER labeled ALL is a daily reminder. Before you drink, set the intention: I add value to ALL. I see myself in ALL. I elevate ALL. Watch how this single shift in awareness begins to change every relationship, every opportunity, and every experience in your life.",
    ],
    pullQuote:
      "The greatest gift you can give the world is your own elevation. When you rise, ALL rises with you.",
    closingReflection: "Today, choose to see ALL — not as a concept, but as your lived reality.",
  },
  {
    slug: "how-to-elev8-you",
    topic: "YOU",
    title: "How to ELEV8 YOU",
    teaser: "The power within YOU. Discover my highest self.",
    openingStatement:
      "YOU are the most important project you will ever work on. Not your career. Not your relationships. Not your goals. YOU.",
    bodyParagraphs: [
      "ELEV8 YOU starts with a simple but profound question: Who am I beyond the labels the world has given me? Beyond your name, your job, your nationality, your history — there is a version of YOU that has never been touched by limitation, never been diminished by circumstance, never forgotten its own greatness.",
      "The journey to ELEV8 YOU is not about becoming someone new. It is about remembering who you have always been. Every experience you have had — the victories and the wounds — has been preparing you for the version of YOU that you are becoming right now in this moment.",
      "ELEV8 WATER was created with YOU in mind. Not a general you. Not a demographic. YOU specifically — the individual reading these words right now. Before you drink, look in the mirror and say: I AM ELEVATING. I AM GROWING. I AM BECOMING. Feel what happens in your body when you speak those words into existence.",
    ],
    pullQuote: "You are not a work in progress. You are a masterpiece in motion.",
    closingReflection: "The world needs the elevated version of YOU — not tomorrow, but now.",
  },
  {
    slug: "how-to-elev8-love",
    topic: "LOVE",
    title: "How to ELEV8 LOVE",
    teaser: "Love is the highest vibration. Learn to embody it.",
    openingStatement:
      "Love is not something you find. Love is something you remember. It was always there — underneath everything.",
    bodyParagraphs: [
      "ELEV8 LOVE begins with understanding that love is not an emotion that comes and goes like weather. It is the fundamental frequency of the universe itself. Scientists have identified 528hz — the frequency at which ELEV8 WATER is infused — as the Love Frequency. The frequency of healing, of connection, of creation. Love is literally a vibration that science can measure.",
      "The most powerful thing you can do to ELEV8 LOVE in your life is to start with yourself. Not in an arrogant, self-absorbed way — but in the deep, nourishing way that a parent loves a child. Give yourself the same grace, the same patience, the same unconditional acceptance that you freely offer to those you love most.",
      "When you drink ELEV8 WATER with the intention of love — you are infusing your body, which is 60-75% water, with that very frequency. Dr. Masaru Emoto's research showed that water exposed to the word LOVE forms the most beautiful crystalline structures imaginable. You are what you drink. You are what you intend.",
    ],
    pullQuote: "Love is not the reward at the end of the journey. Love is the path itself.",
    closingReflection:
      "Choose love — not as a feeling to wait for, but as a decision to make right now.",
  },
  {
    slug: "how-to-elev8-desire",
    topic: "DESIRE",
    title: "How to ELEV8 DESIRE",
    teaser: "Desire is the beginning of all creation.",
    openingStatement:
      "Desire is not weakness. Desire is the universe speaking through you, telling you who you are meant to become.",
    bodyParagraphs: [
      "ELEV8 DESIRE is about understanding the sacred nature of your deepest wants. Every genuine desire you carry was placed in you for a reason. The desire to create, to connect, to contribute, to experience beauty, to know yourself deeply — these are not accidents of personality. They are the blueprint of your purpose.",
      "The problem most people have with desire is that they have been taught to suppress it, to feel guilty about it, to see it as selfish. But a desire that comes from your highest self — not from ego, not from fear, but from genuine creative impulse — is one of the most powerful forces in the universe.",
      "Set your desire as an intention before drinking your ELEV8 WATER. State it clearly, feel it fully, and release it completely. This is the ancient formula for manifestation that the greatest minds in human history have always known. Imagination plus emotion plus action equals reality. Your desire is the seed. Water is the catalyst.",
    ],
    pullQuote: "A desire aligned with your highest self is not a want. It is a calling.",
    closingReflection: "Honor your desires — they are the universe's way of directing you home.",
  },
  {
    slug: "how-to-elev8-energy",
    topic: "ENERGY",
    title: "How to ELEV8 ENERGY",
    teaser: "Energy flows where attention goes.",
    openingStatement:
      "You are not a human being with energy. You ARE energy, temporarily experiencing a human form.",
    bodyParagraphs: [
      "ELEV8 ENERGY starts with recognizing that everything in your life — your relationships, your finances, your health, your creativity — is a direct reflection of the energy you are operating at. High energy attracts high-quality experiences. Low energy attracts more of what drains you. This is not metaphor — this is the physics of how reality works.",
      "Your physical energy is the foundation. Sleep, nutrition, movement, hydration — these are not luxuries. They are the biological basis of everything you want to create. When your body is running on ultra-purified water, clean fuel, and intentional rest, your capacity to think, create, love and contribute expands exponentially.",
      "ELEV8 WATER was designed to support your energy at the cellular level. When you remove the chemical additives that burden your body's filtration systems, when you hydrate with water your cells can actually use efficiently, when you add the 528hz frequency that resonates with your body's natural healing state — you are not just drinking water. You are investing in your energetic potential.",
    ],
    pullQuote: "Protect your energy like your life depends on it. Because it does.",
    closingReflection:
      "Choose today to guard, cultivate, and direct your energy with full intention.",
  },
  {
    slug: "how-to-elev8-believe",
    topic: "BELIEVE",
    title: "How to ELEV8 BELIEVE",
    teaser: "Belief is the foundation of all achievement.",
    openingStatement:
      "What you believe about yourself is the ceiling of your life. And ceilings, unlike roofs, can always be raised.",
    bodyParagraphs: [
      "ELEV8 BELIEVE is about confronting the most powerful force shaping your reality: your beliefs. Not your circumstances, not your past, not the opinions of others — but the stories you have accepted as true about who you are and what is possible for you. These beliefs were largely formed before you were seven years old. And you have been living inside them ever since.",
      "The science of neuroplasticity has confirmed what spiritual teachers have always known — the brain can be rewired at any age. Every time you choose a new thought, reinforce a new belief, or act in alignment with the person you are becoming rather than the person you have been — you are literally building new neural pathways. You are architecturally redesigning yourself.",
      "Before you drink your ELEV8 WATER today, choose one belief you are ready to release and one belief you are ready to install. Say them aloud. Feel the old one dissolve. Feel the new one take root. Then drink with the intention that every cell in your body is receiving and accepting this new truth. Because Dr. Emoto showed us — water listens.",
    ],
    pullQuote: "Believe in the version of yourself that has already become who you are working to be.",
    closingReflection: "Your beliefs are not facts — they are choices. Choose again.",
  },
  {
    slug: "how-to-elev8-vibration",
    topic: "VIBRATION",
    title: "How to ELEV8 VIBRATION",
    teaser: "Raise my vibration. Raise my reality.",
    openingStatement:
      "Everything in the universe is vibrating. The question is never whether you are vibrating — it is always at what frequency.",
    bodyParagraphs: [
      "ELEV8 VIBRATION begins with understanding that your emotional state is a frequency. Joy, gratitude, love and peace vibrate at high frequencies that attract more of the same. Fear, resentment, shame and anxiety vibrate at low frequencies that contract your world and limit what is possible for you. This is not woo — this is measurable electromagnetic reality.",
      "The fastest way to shift your vibration is not to think your way up — it is to feel your way up. Gratitude is the most reliable elevator to high vibration that exists. When you find genuine appreciation for what you already have — your breath, your body, the water in your hand — your frequency shifts immediately, without conditions, without waiting.",
      "ELEV8 WATER at 528hz is the Love Frequency. When you drink it consciously, with awareness of what you are doing, you are introducing a high-frequency input directly into a body that is mostly water. You are tuning yourself like an instrument. Stay active, connect with nature, listen to music that moves you, speak kind words to yourself and others — and watch your vibration rise.",
    ],
    pullQuote: "You cannot attract a high-vibration life from a low-vibration state. Elevate first.",
    closingReflection:
      "Today commit to one thought, one action, one intention that raises your frequency.",
  },
  {
    slug: "how-to-elev8-mindset",
    topic: "MINDSET",
    title: "How to ELEV8 MINDSET",
    teaser: "My mindset creates my world.",
    openingStatement:
      "Your mindset is not your personality. It is a lens. And lenses can be changed, cleaned, and upgraded.",
    bodyParagraphs: [
      "ELEV8 MINDSET is about making the shift from a fixed perspective to a growth perspective — from 'this is who I am' to 'this is who I am becoming.' This single mental shift is the difference between people who transform their lives and people who repeat the same year over and over with increasing frustration.",
      "A growth mindset does not mean toxic positivity or denying reality. It means that when you face a challenge, your first question is not 'why is this happening to me' but 'what is this teaching me.' It means that failure is not a verdict on your worth — it is data for your next attempt. It means that other people's success is not a threat but a proof of what is possible.",
      "Start each morning with your ELEV8 WATER and a single mindset intention. Not a long list of affirmations you race through while checking your phone — one clear, felt statement of who you are choosing to be today. Drink slowly. Breathe. Let the intention settle into your body, not just your mind. The body is where mindset becomes behavior.",
    ],
    pullQuote: "The mind is the most powerful creation tool in the universe — and it is yours.",
    closingReflection: "Choose your thoughts today as deliberately as you choose your water.",
  },
  {
    slug: "how-to-elev8-gratitude",
    topic: "GRATITUDE",
    title: "How to ELEV8 GRATITUDE",
    teaser: "Gratitude transforms what I have into enough.",
    openingStatement:
      "Gratitude is not a feeling you wait for. It is a practice you choose — and it changes everything it touches.",
    bodyParagraphs: [
      "ELEV8 GRATITUDE is about discovering that appreciation is not a passive response to good things happening — it is an active force that creates good things. Neuroscience confirms that a consistent gratitude practice rewires the brain toward optimism, reduces cortisol, strengthens the immune system, and improves sleep. Gratitude is one of the most evidence-backed wellness practices that exists.",
      "The deepest level of gratitude is not for the things going right — it is for the things that challenged you most. The relationship that broke you open. The failure that redirected you. The loss that taught you what truly matters. When you can find genuine appreciation for your most difficult experiences, you have reached a level of consciousness that very few people ever access.",
      "ELEV8 WATER gives you a daily gratitude ritual built into something you already do. Before each sip, pause. Feel one genuine moment of appreciation — for the water, for your body that receives it, for the life you are living. This is not performance. This is practice. And practice, done consistently, becomes who you are.",
    ],
    pullQuote: "What you appreciate, appreciates. This is the law of gratitude in action.",
    closingReflection: "Find one thing today — just one — that you are genuinely grateful for. Start there.",
  },
  {
    slug: "how-to-elev8-frequency",
    topic: "FREQUENCY",
    title: "How to ELEV8 FREQUENCY",
    teaser: "528Hz — the frequency of love and healing.",
    openingStatement:
      "528hz is not just a number. It is the mathematical signature of transformation — the frequency at which the universe repairs, creates, and loves.",
    bodyParagraphs: [
      "ELEV8 FREQUENCY begins with the understanding that you are a vibrational being living in a vibrational universe. Every thought you think, every emotion you feel, every word you speak carries a measurable frequency. And the world around you — including the people, opportunities, and experiences that find you — responds to that frequency like a tuning fork responds to its matching note.",
      "The 528hz frequency — known as the Love Frequency and the Miracle Tone — has been used by healers, musicians, scientists and spiritual traditions across thousands of years. It is the frequency of DNA repair, of cellular regeneration, of emotional healing. When ELEV8 WATER is infused with 528hz binaural frequency, it carries that signature into every cell of your body with every sip.",
      "You can actively work with frequency in your daily life. Listen to 528hz music while you work, meditate or rest. Speak words of love and encouragement — to others and to yourself. Choose environments that feel high-frequency: nature, creativity, meaningful connection. And drink your ELEV8 WATER with the conscious intention that you are aligning yourself with the frequency of healing and love.",
    ],
    pullQuote: "Tune your frequency deliberately. The universe will match it exactly.",
    closingReflection:
      "Today, choose to vibrate at the frequency of the life you want — not the life you have had.",
  },
  {
    slug: "how-to-elev8-thoughts",
    topic: "THOUGHTS",
    title: "How to ELEV8 THOUGHTS",
    teaser: "My thoughts are the driving force of my reality.",
    openingStatement:
      "You have approximately 60,000 thoughts today. Most of them are the same ones you had yesterday. This is either the greatest problem or the greatest opportunity of your life.",
    bodyParagraphs: [
      "ELEV8 THOUGHTS begins with becoming the observer of your own mind — not the victim of it. Most people experience their thoughts as reality, as fact, as themselves. But you are not your thoughts. You are the awareness that notices them. And once you truly know that, you are no longer at the mercy of every passing mental event.",
      "The thoughts you give consistent attention to become beliefs. The beliefs you act on become habits. The habits you maintain become your character. And your character becomes your destiny. This is why the single most important thing you can do to change your life is to change what you habitually think about — not occasionally, but moment by moment, day by day.",
      "Dr. Masaru Emoto's water research demonstrated that human thoughts and intentions physically alter the molecular structure of water. When subjects directed thoughts of love toward water, its crystals formed breathtaking symmetrical patterns. When thoughts of hatred were directed at water, the crystals were chaotic and broken. You are 60-75% water. Think about what your habitual thoughts are doing to your internal environment — and choose differently.",
    ],
    pullQuote: "Your thoughts are not who you are. But they are building who you will become.",
    closingReflection:
      "Watch your thoughts today — not to judge them, but to choose which ones deserve your energy.",
  },
  {
    slug: "how-to-elev8-consciousness",
    topic: "CONSCIOUSNESS",
    title: "How to ELEV8 CONSCIOUSNESS",
    teaser: "Expand my awareness. Expand my life.",
    openingStatement:
      "Consciousness is not something you have. It is what you are. Everything else — your body, your thoughts, your story — is arising within it.",
    bodyParagraphs: [
      "ELEV8 CONSCIOUSNESS is the deepest and most expansive of the 12 understandings — because it contains all the others. When you expand your consciousness, you expand your capacity for love, your ability to perceive opportunity, your tolerance for complexity, your creativity, your peace. Consciousness is the field in which everything else in your life grows.",
      "Expanding consciousness does not require a monastery or a decade of meditation — though both can help. It requires consistent, intentional practice of presence. Being fully here, fully now, fully awake to this moment rather than lost in the mental commentary about this moment. The gap between stimulus and response is where consciousness lives. Your work is to make that gap wider.",
      "ELEV8 WATER was born from a vision of elevated consciousness — a world in which every individual awakens to the power within them, to their connection to all of life, to their capacity to create reality through intention and awareness. Every bottle is a small act of that vision made physical. Every sip, taken consciously, is a practice of the very thing we are all here to cultivate: the awareness of awareness itself.",
    ],
    pullQuote: "You do not need to seek consciousness. You need to stop hiding from it.",
    closingReflection: "Be here. Be aware. Be the consciousness that you already are.",
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
  { label: "TRENDING", href: "https://www.youtube.com", external: true },
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
    blurb: "Mental clarity & awareness",
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
    blurb: "THE GRAND DESIGNER.",
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
    pricingLabel: "Membership:",
    price1yr: "1 Year Membership — $5,000",
    price2yr: "2 Year Membership — $10,000",
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
    pricingLabel: "Membership:",
    price1yr: "1 Year Membership — $2,500",
    price2yr: "2 Year Membership — $5,000",
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
    pricingLabel: "Membership:",
    price1yr: "1 Year Membership — $5,000",
    price2yr: "2 Year Membership — $10,000",
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
    pricingLabel: "Investment:",
    price1yr: "By Arrangement — $1,000,000+",
    pricingNote: "Private application required",
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
  {
    name: "ALL",
    chakra: "Crown",
    color: "#6B2FA0",
    placeholder: false,
    blurb: "Everyone without Exception. The GRAND DESIGN. I will ELEV8 my awareness to see ALL as ONE. In times like this, self development and mental awareness will enhance the quality of life for ALL and promote the spread of love and happiness with all consciousness, bringing joy to homes and families worldwide.",
  },
  {
    name: "YOU",
    chakra: "Third Eye",
    color: "#4B0082",
    placeholder: false,
    blurb: "I will ELEV8 myself by only speaking and thinking of the experience I want to have by being aware of what I say and tell myself about MYSELF. I AM the only person responsible for the outcome of my life experiences either good or bad. I AM always deserving of everything and anything my mind can create. I will be the greatest version of MYSELF.",
  },
  {
    name: "LOVE",
    chakra: "Heart",
    color: "#00A550",
    placeholder: false,
    blurb: "I will ELEV8 LOVE by understanding that love begins within MYSELF. When I love myself unconditionally I naturally radiate love to everything and everyone around me. LOVE is the highest frequency. 528Hz is the frequency of LOVE and it is infused in every drop of MY personal water.",
  },
  {
    name: "DESIRE",
    chakra: "Sacral",
    color: "#FF6B00",
    placeholder: false,
    blurb: "I will ELEV8 my DESIRE by understanding that every desire I have was placed in me for a reason. My desires are the universe speaking to me about my purpose. I will honor my desires and take inspired action toward them every single day.",
  },
  {
    name: "ENERGY",
    chakra: "Solar Plexus",
    color: "#FFD700",
    placeholder: false,
    blurb: "I will ELEV8 my ENERGY by understanding that everything is energy including MYSELF. I will protect and direct my energy intentionally. I will choose thoughts, environments and people that raise my vibration and give energy to my highest self.",
  },
  {
    name: "BELIEVE",
    chakra: "Throat",
    color: "#00BFFF",
    placeholder: false,
    blurb: "I will ELEV8 my BELIEVE by understanding that my beliefs create my reality. I will choose to believe in my unlimited potential. I will replace every limiting belief with a belief that serves my greatest self. I BELIEVE in MYSELF without a doubt.",
  },
  {
    name: "VIBRATION",
    chakra: "Sacral",
    color: "#FF69B4",
    placeholder: false,
    blurb: "To ELEV8 my VIBRATION I will have to be aware of what emotions I allow to run in my body. I will focus on gratitude and appreciation to creation for allowing me to experience this beautiful grand design called life. I will commit to giving myself the mindset to always put out good vibes ONLY to myself and the world around me.",
  },
  {
    name: "MINDSET",
    chakra: "Third Eye",
    color: "#4169E1",
    placeholder: false,
    blurb: "I will ELEV8 my MINDSET by understanding that my mind is the most powerful tool I possess. I will feed my mind with positive empowering thoughts and information. What I consistently think about I bring about. My MINDSET creates my reality.",
  },
  {
    name: "GRATITUDE",
    chakra: "Heart",
    color: "#FF1493",
    placeholder: false,
    blurb: "I will ELEV8 my GRATITUDE by developing the practice of being thankful for everything in my life. Gratitude is the gateway to abundance. When I am grateful for what I have I attract more to be grateful for. I am grateful for this water, for this moment, for this life.",
  },
  {
    name: "FREQUENCY",
    chakra: "Crown",
    color: "#8B008B",
    placeholder: false,
    blurb: "I will ELEV8 my FREQUENCY by understanding that I am a vibrational being. The 528Hz frequency infused in every bottle of MY personal water ELEV8 WATER is the frequency of transformation and love. I will tune myself to the highest frequency possible and watch my life transform.",
  },
  {
    name: "THOUGHTS",
    chakra: "Crown",
    color: "#DAA520",
    placeholder: false,
    blurb: "I will ELEV8 my THOUGHTS by understanding that my thoughts are the seeds of my reality. Every thought I think is either moving me closer to or further from the life I desire. I will be the guardian of my mind and only allow thoughts that serve my highest good.",
  },
  {
    name: "CONSCIOUSNESS",
    chakra: "Crown",
    color: "#2E1065",
    placeholder: false,
    blurb: "I will ELEV8 my CONSCIOUSNESS by expanding my awareness beyond my physical reality. I am more than my body, more than my thoughts, more than my circumstances. I AM CONSCIOUSNESS experiencing itself. I will wake up to the infinite power within me.",
  },
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
   SCIENTIFIC PROCESS — ELEV8 filtration sequence (7 steps)
------------------------------------------------------------------ */
export const PROCESS_STEPS: ProcessStep[] = [
  {
    label: "LOVE",
    color: "#6B2FA0",
    description:
      "Our Water is Inspired By Love. Infused With 528 Hz Love Frequency. To ELEV8 Your Life.",
  },
  {
    label: "MICRON FILTRATION",
    color: "#4B0082",
    description:
      "Pharmaceutical Grade to Remove Volatile Organic Compounds and Other Contaminants.",
  },
  {
    label: "REVERSE OSMOSIS",
    color: "#0000FF",
    description:
      "High-Pressure Filtration to Remove Salt, Minerals, and Additional Impurities.",
  },
  {
    label: "DEIONIZATION",
    color: "#008000",
    description: "Ion Exchange to Filter Out Remaining Minerals.",
  },
  {
    label: "ULTRAVIOLET LIGHT",
    color: "#FFFF00",
    description: "To Remove 99.99% of Microorganisms.",
  },
  {
    label: "OZONATION",
    color: "#FFA500",
    description:
      "Infused With Ozone, a Tasteless Molecule Made From Atmospheric Oxygen, to Naturally Sterilize.",
  },
  {
    label: "GRATITUDE",
    color: "#FF0000",
    description: "Thankful Thoughts for YOU Choosing To ELEV8 Your Life.",
  },
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
      { label: "Trending", href: "https://www.youtube.com", external: true },
      { label: "Creators", href: "/creators" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Shipping & Friendly Assist?", href: "/shipping" },
      { label: "Say Hello", href: "/contact" },
      { label: "Join To ELEV8", href: "/join" },
      { label: "Collaborators", href: "/contact" },
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
