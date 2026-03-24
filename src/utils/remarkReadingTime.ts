import { toString } from 'mdast-util-to-string';

export function remarkReadingTime() {
  return function (tree: any, { data }: any) {
    const textOnPage = toString(tree);
    const words = textOnPage.split(/\s+/).filter((word: string) => word.length > 0);
    const readingTime = Math.max(1, Math.ceil(words.length / 200));
    data.astro.frontmatter.readingTime = readingTime;
  };
}
