import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderMarkdownDoc, textResponse } from '../../utils/markdownExport';
import { postDoc, type Post } from '../../utils/geoContent';

/**
 * Markdown rendering of a vlog: /vlog/some-post.md
 *
 * Vlog bodies carry their `## Transcript` section as plain markdown, so it
 * comes through untouched — that transcript is the substance an LLM would cite.
 */
export async function getStaticPaths() {
  const posts = await getCollection('vlog', ({ data }) => !data.draft);
  return posts
    .filter((p) => !p.data.series && p.data.kind !== 'article')
    .map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export const GET: APIRoute = ({ props }) =>
  textResponse(renderMarkdownDoc(postDoc((props as { post: Post }).post)));
