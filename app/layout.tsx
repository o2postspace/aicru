import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 큐레이터 칼럼",
  description: "AI가 생성한 칼럼을 모아 보여주는 큐레이션 사이트"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="page">
          <header className="site-header">
            <div className="site-header-inner">
              <div className="site-logo">AI 큐레이터</div>
              <div className="site-subtitle">신뢰 기반 AI 칼럼 아카이브</div>
            </div>
          </header>
          <main className="site-main">{children}</main>
          <footer className="site-footer">
            <div className="site-footer-inner">
              <span>© {new Date().getFullYear()} AI 큐레이터</span>
              <span className="site-footer-meta">
                자동 생성된 콘텐츠는 검토 절차를 거쳐 제공됩니다.
              </span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}


