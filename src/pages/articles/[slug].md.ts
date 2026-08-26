import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderMarkdownDoc, textResponse } from '../../utils/markdownExport';
import { postDoc, type Post } from '../../utils/geoContent';

/** Markdown rendering of an article: /articles/some-list.md */
export async function getStaticPaths() {
  const posts = await getCollection('vlog', ({ data }) => !data.draft && data.kind === 'article');
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export const GET: APIRoute = ({ props }) =>
  textResponse(renderMarkdownDoc(postDoc((props as { post: Post }).post)));
