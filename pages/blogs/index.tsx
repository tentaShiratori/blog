import { GetStaticProps } from "next";
import Link from "next/link";
import { pagesPath } from "@/lib/$path";
import { contentfulClient } from "@/lib/contentful";

interface Props {
  items: { id: string; title: string }[];
}

export const getStaticProps: GetStaticProps<{
  items: { id: string; title: string }[];
}> = async (context) => {
  try {
    const res = await contentfulClient.getEntries({
      order: "sys.createdAt" as "sys.createdAt",
    });
    return {
      props: {
        items: res.items.map((item) => {
          return {
            id: item.sys.id,
            title: item.fields["title"],
          };
        }),
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
export default function Blogs({ items }: Props) {
  return (
    <main>
      <ul>
        {items.map((item) => {
          return (
            <li key={item.id}>
              <Link href={pagesPath.blogs._id(item.id).$url()}>
                {item.title || "Untitled"}
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
