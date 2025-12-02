import { list, put, get } from "@vercel/blob";

export interface Post {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  content: string;
  source?: string | null;
  createdAt: string;
}

const POSTS_PREFIX = "posts/"; // Blob 안에서 posts/ 폴더에 JSON 저장

export async function getAllPosts(): Promise<Post[]> {
  const blobs = await list({ prefix: POSTS_PREFIX });

  if (!blobs.blobs || blobs.blobs.length === 0) {
    return [];
  }

  // 업로드 시각 기준으로 최신 글이 위로 오도록 정렬
  const sorted = [...blobs.blobs].sort(
    (a, b) =>
      new Date(b.uploadedAt ?? 0).getTime() -
      new Date(a.uploadedAt ?? 0).getTime()
  );

  const posts = await Promise.all(
    sorted.map(async (blob) => {
      const res = await fetch(blob.url);
      if (!res.ok) return undefined;
      const data = (await res.json()) as Post;
      return data;
    })
  );

  return posts.filter((p): p is Post => Boolean(p));
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const pathname = `${POSTS_PREFIX}${slug}.json`;
  const { blob } = await get(pathname);

  if (!blob) {
    return undefined;
  }

  const res = await fetch(blob.url);
  if (!res.ok) return undefined;

  const data = (await res.json()) as Post;
  return data;
}

export async function createPost(input: {
  title: string;
  content: string;
  summary?: string | null;
  slug?: string;
  source?: string | null;
}): Promise<Post> {
  const now = new Date();
  const nowIso = now.toISOString();

  const baseSlug =
    input.slug ||
    input.title
      .toLowerCase()
      .replace(/[^\w가-힣\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  let slug = baseSlug || `post-${now.getTime()}`;
  let suffix = 1;

  // 슬러그 중복 방지: 같은 이름의 Blob이 있는지 목록으로 확인
  // (규모가 크지 않다는 가정 하에 간단하게 처리)
  while (true) {
    const pathname = `${POSTS_PREFIX}${slug}.json`;
    const blobs = await list({ prefix: pathname, limit: 1 });
    if (!blobs.blobs[0]) break;
    slug = `${baseSlug}-${suffix++}`;
  }

  const post: Post = {
    id: `${now.getTime()}-${Math.random().toString(16).slice(2)}`,
    slug,
    title: input.title,
    summary: input.summary ?? null,
    content: input.content,
    source: input.source ?? null,
    createdAt: nowIso
  };

  const pathname = `${POSTS_PREFIX}${slug}.json`;

  await put(pathname, JSON.stringify(post), {
    access: "public",
    contentType: "application/json"
  });

  return post;
}
