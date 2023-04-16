import Link from "next/link";
import { pagesPath } from "@/lib/$path";

export default function Home() {
  return (
    <main>
      <header>
        <nav>
          <ul>
            <li>
              <Link href={pagesPath.$url()}>ホーム</Link>
            </li>
            <li>
              <Link href={pagesPath.blogs.$url()}>ブログ</Link>
            </li>
          </ul>
        </nav>
      </header>
    </main>
  );
}
