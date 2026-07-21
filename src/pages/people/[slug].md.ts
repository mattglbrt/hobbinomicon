import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderMarkdownDoc, textResponse } from '../../utils/markdownExport';
import { personDoc, type Person } from '../../utils/geoContent';

/** Markdown rendering of a directory person page: /people/tanner-simpson.md */
export async function getStaticPaths() {
  const people = await getCollection('people', ({ data }) => !data.draft);
  return people.map((person) => ({ params: { slug: person.id }, props: { person } }));
}

export const GET: APIRoute = async ({ props }) =>
  textResponse(renderMarkdownDoc(await personDoc((props as { person: Person }).person)));
