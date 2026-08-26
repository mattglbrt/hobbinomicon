import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderMarkdownDoc, textResponse } from '../../../utils/markdownExport';
import { postDoc, type Post } from '../../../utils/geoContent';

/** Markdown rendering of a series episode: /series/kal-arath/episode-2.md */
export async function getStaticPaths() {
  const eps = await getCollection('vlog', ({ data }) => !data.draft && Boolean(data.series));
  return eps.map((ep) => ({
    params: { series: ep.data.series!.id, episode: ep.id },
    props: { post: ep },
  }));
}

export const GET: APIRoute = ({ props }) =>
  textResponse(renderMarkdownDoc(postDoc((props as { post: Post }).post)));
