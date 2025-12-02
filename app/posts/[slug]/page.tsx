import { notFound } from "next/navigation";
import { getPostBySlug } from "../../../lib/posts";
import { MarkdownViewer } from "../../../components/MarkdownViewer";

// Blob에 새 글이 추가된 뒤 곧바로 상세 페이지에서 보이도록 동적 렌더링
export const dynamic = "force-dynamic";

interface PostPageProps {
  params: { slug: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="content-shell post-detail">
      <header className="post-detail-header">
        <div className="post-detail-meta">
          <span className="post-date">
            {new Date(post.createdAt).toLocaleString("ko-KR", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </span>
          {post.source && (
            <span className="post-source">출처: {post.source}</span>
          )}
        </div>
        <h1>{post.title}</h1>
        {post.summary && (
          <p className="post-detail-summary">{post.summary}</p>
        )}
      </header>

      <MarkdownViewer content={post.content} />
    </article>
  );
}



