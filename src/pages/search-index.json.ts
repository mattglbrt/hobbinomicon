import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPublishedPosts, groupByTags } from '../utils/collections';
import { getTagDisplay } from '../utils/tags';

export const GET: APIRoute = async () => {
  const allPosts = await getCollection('blog');
  const publishedPosts = getPublishedPosts(allPosts);

  const allProjects = await getCollection('projects');
  const publishedProjects = allProjects.filter((p) => !p.data.draft);

  const games = await getCollection('games', ({ data }) => !data.draft);
  const studios = await getCollection('studios', ({ data }) => !data.draft);
  const people = await getCollection('people', ({ data }) => !data.draft);
  const news = await getCollection('news', ({ data }) => !data.draft);

  // Top tags surfaced as filter chips. Built from blog posts since they have
  // the densest tag usage; games/news tags can still be searched against per-item.
  const tagsMap = groupByTags(publishedPosts);
  const topTags = Array.from(tagsMap.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 8)
    .map(([tag]) => ({ tag, display: getTagDisplay(tag) }));

  const blogIndex = publishedPosts.map((post) => ({
    type: 'post',
    slug: post.id,
    url: `/blog/${post.id}/`,
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    tags: post.data.tags,
    searchText: [
      post.data.title,
      post.data.description,
      post.data.category,
      ...post.data.tags,
    ].join(' ').toLowerCase(),
  }));

  const projectIndex = publishedProjects.map((project) => ({
    type: 'project',
    slug: project.id,
    url: `/projects/${project.id}/`,
    title: project.data.title,
    description: project.data.description,
    category: 'Projects',
    tags: project.data.game ? [project.data.game] : [],
    searchText: [
      project.data.title,
      project.data.description,
      'Projects',
      project.data.game || '',
    ].join(' ').toLowerCase(),
  }));

  const gameIndex = games.map((game) => ({
    type: 'game',
    slug: game.id,
    url: `/games/${game.id}/`,
    title: game.data.title,
    description: game.data.description,
    category: 'Games',
    tags: game.data.tags,
    searchText: [
      game.data.title,
      game.data.description,
      'Games',
      game.data.tier,
      game.data.status,
      game.data.currentEdition || '',
      game.data.verdict || '',
      ...game.data.tags,
    ].join(' ').toLowerCase(),
  }));

  const studioIndex = studios.map((studio) => ({
    type: 'studio',
    slug: studio.id,
    url: `/studios/${studio.id}/`,
    title: studio.data.name,
    description: studio.data.description,
    category: 'Studios',
    tags: [],
    searchText: [
      studio.data.name,
      studio.data.description,
      'Studios',
      studio.data.headquarters || '',
    ].join(' ').toLowerCase(),
  }));

  const personIndex = people.map((person) => ({
    type: 'person',
    slug: person.id,
    url: `/people/${person.id}/`,
    title: person.data.name,
    description: person.data.bio,
    category: 'People',
    tags: person.data.roles,
    searchText: [
      person.data.name,
      person.data.bio,
      'People',
      ...person.data.roles,
    ].join(' ').toLowerCase(),
  }));

  const newsIndex = news.map((item) => ({
    type: 'news',
    slug: item.id,
    url: `/news/${item.id}/`,
    title: item.data.title,
    description: item.data.description,
    category: 'Indie News',
    tags: [item.data.kind],
    searchText: [
      item.data.title,
      item.data.description,
      'Indie News',
      item.data.kind,
      item.data.sourceName || '',
    ].join(' ').toLowerCase(),
  }));

  const searchIndex = [
    ...gameIndex,
    ...newsIndex,
    ...studioIndex,
    ...personIndex,
    ...blogIndex,
    ...projectIndex,
  ];

  // Filter chip labels: directory pillars first, then blog categories.
  // Each one is only included if there's actually content under it.
  const blogCategories = [...new Set(publishedPosts.map((p) => p.data.category))].sort();
  const directoryCategories = [
    games.length ? 'Games' : null,
    news.length ? 'Indie News' : null,
    studios.length ? 'Studios' : null,
    people.length ? 'People' : null,
    publishedProjects.length ? 'Projects' : null,
  ].filter((c): c is string => Boolean(c));
  const categories = [...new Set([...directoryCategories, ...blogCategories])];

  return new Response(JSON.stringify({ searchIndex, categories, topTags }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
