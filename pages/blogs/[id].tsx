import "highlight.js/styles/github.css";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSnitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { pagesPath } from "@/lib/$path";
import { contentfulClient } from "@/lib/contentful";

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
  const res = await contentfulClient.getEntries();
  return {
    paths: res.items.map(
      (item) => pagesPath.blogs._id(item.sys.id).$url().pathname
    ), //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};
export const getStaticProps: GetStaticProps<{}, { id: string }> = async (
  context
) => {
  try {
    const res = await contentfulClient.getEntry(context.params!.id);
    return {
      props: {
        markdown: res.fields["markdown"],
      },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every 10 seconds
      revalidate: 10, // In seconds
    };
  } catch (e: unknown) {
    return { notFound: true, revalidate: 10 };
  }
};
type Props = { markdown: string };
function H1({ children }: { children: ReactNode }) {
  return <h1>{children}</h1>;
}
declare global {
  namespace JSX {
    // this merges with the existing intrinsic elements, adding 'my-custom-tag' and its props
    interface IntrinsicElements {
      unko: {};
    }
  }
}
export default function Blog({ markdown }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeRaw,
        [
          rehypeSnitize,
          {
            ...defaultSchema,
            attributes: {
              ...defaultSchema.attributes,
              code: [
                ...(defaultSchema.attributes?.code || []),
                // List of all allowed languages:
                [
                  "className",
                  "language-js",
                  "language-css",
                  "language-ts",
                  "language-md",
                ],
              ],
            },
          },
        ],
        rehypeHighlight,
      ]}
      components={{
        unko: H1,
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
