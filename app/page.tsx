import Link from "next/link";
import { getAllPosts } from "../lib/posts";

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <section className="content-shell">
      <div className="content-header">
        <h1>AI 생성 칼럼</h1>
        <p>
          이 페이지는 n8n 워크플로우에서 전달된 글을 자동으로 수집하고,
          차분한 톤으로 정리해 보여주는 아카이브입니다.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          아직 등록된 칼럼이 없습니다.
          <span className="empty-state-sub">
            n8n에서 HTTP API로 글을 전송하면 여기에 자동으로 쌓입니다.
          </span>
        </div>
      ) : (
        <div className="post-list">
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              <div className="post-meta">
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
              <h2 className="post-title">
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h2>
              {post.summary && (
                <p className="post-summary">{post.summary}</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}



