import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPublishedPosts, groupByTags } from '../utils/collections';
import { getTagDisplay } from '../utils/tags';

export const GET: APIRoute = async () => {
  const allPosts = await getCollection('blog');
  const publishedPosts = getPublishedPosts(allPosts);

  const allProjects = await getCollection('projects');
  const publishedProjects = allProjects.filter(p => !p.data.draft);

  const categories = [...new Set(publishedPosts.map(post => post.data.category))].sort();

  const tagsMap = groupByTags(publishedPosts);
  const topTags = Array.from(tagsMap.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 8)
    .map(([tag]) => ({ tag, display: getTagDisplay(tag) }));

  const blogIndex = publishedPosts.map(post => ({
    slug: post.id,
    url: `/blog/${post.id}`,
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    tags: post.data.tags,
    searchText: [
      post.data.title,
      post.data.description,
      post.data.category,
      ...post.data.tags
    ].join(' ').toLowerCase()
  }));

  const projectIndex = publishedProjects.map(project => ({
    slug: project.id,
    url: `/projects/${project.id}`,
    title: project.data.title,
    description: project.data.description,
    category: 'Projects',
    tags: project.data.game ? [project.data.game] : [],
    searchText: [
      project.data.title,
      project.data.description,
      'Projects',
      project.data.game || ''
    ].join(' ').toLowerCase()
  }));

  const searchIndex = [...blogIndex, ...projectIndex];

  return new Response(JSON.stringify({ searchIndex, categories, topTags }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
