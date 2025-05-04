import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    pubDate: z.date(),
    category: z.enum([
      "News",
      "Guides",
      "Reviews",
      "Hobby Log",
      "Tournament Lists",
      "Events",
      "Podcasts",
      "Videos",
    ]),
    tags: z.array(z.string()),
    featuredImage: z.string(),
  }),
});

export const collections = {
  blog: blogCollection,
};
