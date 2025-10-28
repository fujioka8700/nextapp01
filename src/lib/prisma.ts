import { PrismaClient } from '@prisma/client';

// 開発環境でのホットリロード時に新しいインスタンスが作成されるのを防ぐため、
// グローバルオブジェクトにPrismaClientの型を定義します。
// TypeScriptのグローバルオブジェクトにカスタムプロパティを追加する標準的な方法です。
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// 既存のグローバルインスタンスがあればそれを使い、なければ新しいインスタンスを作成します。
const prisma =
  global.prisma ||
  new PrismaClient({
    // 必要に応じてロギング設定などを追加できます
    // log: ['query'],
  });

// 開発環境（本番環境ではない場合）でのみ、グローバルオブジェクトにPrismaClientをキャッシュします。
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;