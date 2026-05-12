import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsPath = path.join(__dirname, "../app/blog/posts.ts");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const currentPosts = fs.readFileSync(postsPath, "utf8");

// Extract existing slugs and titles so we don't repeat topics
const slugMatches = [...currentPosts.matchAll(/slug:\s*["'`]([^"'`]+)["'`]/g)];
const titleMatches = [...currentPosts.matchAll(/title:\s*["'`]([^"'`]+)["'`]/g)];
const existingSlugs = slugMatches.map((m) => m[1]).join(", ");
const existingTitles = titleMatches.map((m) => m[1]).join("\n- ");

console.log(`Generating blog post for ${today}...`);
console.log(`Existing posts: ${slugMatches.length}`);

const prompt = `You are writing a daily blog post for poweryourhouse.io — a website for a Shopify app called "Image Colour Remake" that lets furniture merchants show their products in every fabric colour using AI, without photoshoots.

Today's date: ${today}

## Existing posts (DO NOT repeat these topics):
- ${existingTitles}

## Task
Write ONE new blog post on a topic not already covered. Choose from:
- Shopify Tips for furniture merchants
- Ecommerce Strategy for home goods stores
- Colour visualisation and its impact on conversion
- Reducing furniture returns
- How to photograph furniture products
- Shopify theme recommendations for furniture stores
- How to write product descriptions for furniture
- Using customer reviews to sell furniture online
- Furniture store marketing tips
- How AI is changing furniture ecommerce
- Case studies / merchant success stories (realistic and specific)
- Seasonal strategies (e.g. summer outdoor furniture, winter bedroom refresh)

## Output format
Return ONLY a valid JSON object (no markdown, no code fences, just raw JSON):
{
  "slug": "url-friendly-lowercase-hyphens",
  "title": "Full Post Title Here",
  "description": "One or two sentence description used as meta description.",
  "category": "Shopify Tips",
  "readTime": 6,
  "content": "<p>HTML content here...</p><h2>Section</h2><p>More content...</p>"
}

## Rules
- category must be exactly one of: "Shopify Tips", "Ecommerce Strategy", "Product Updates", "Case Studies"
- content must be valid HTML: use <h2>, <p>, <ul>, <ol>, <li>, <strong> — NO <h1>
- Aim for 500-800 words in the content
- Australian/British English spelling (colour, visualise, optimise)
- Practical and direct — guides for busy store owners
- Mention "Image Colour Remake" naturally only where genuinely relevant
- Do NOT include backtick characters in the content field
- Do NOT wrap output in markdown code fences`;

const message = await client.messages.create({
  model: "claude-opus-4-5",
  max_tokens: 4096,
  messages: [{ role: "user", content: prompt }],
});

const raw = message.content[0].type === "text" ? message.content[0].text.trim() : "";

// Strip any accidental markdown fences
const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();

let post;
try {
  post = JSON.parse(cleaned);
} catch (e) {
  console.error("Failed to parse Claude response as JSON:");
  console.error(cleaned);
  process.exit(1);
}

// Validate required fields
const required = ["slug", "title", "description", "category", "readTime", "content"];
for (const field of required) {
  if (!post[field]) {
    console.error(`Missing field: ${field}`);
    process.exit(1);
  }
}

// Build the new post TypeScript object
const newPostTs = `  {
    slug: "${post.slug}",
    title: "${post.title.replace(/"/g, '\\"')}",
    description: "${post.description.replace(/"/g, '\\"')}",
    date: "${today}",
    category: "${post.category}",
    readTime: ${post.readTime},
    content: \`
      ${post.content.trim()}
    \`,
  },`;

// Insert at the top of the posts array
const insertMarker = "export const posts: BlogPost[] = [";
if (!currentPosts.includes(insertMarker)) {
  console.error("Could not find posts array in posts.ts");
  process.exit(1);
}

const updated = currentPosts.replace(
  insertMarker,
  `${insertMarker}\n${newPostTs}`,
);

fs.writeFileSync(postsPath, updated, "utf8");

console.log(`✅ Blog post written: "${post.title}"`);
console.log(`   Slug: ${post.slug}`);
console.log(`   Category: ${post.category}`);
