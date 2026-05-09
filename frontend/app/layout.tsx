import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '轻体 - 温暖的体重健康伙伴',
  description: '基于多源行为数据的可解释 AI 健康管理。健康，不是一场战斗，是一段被理解的旅程。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
