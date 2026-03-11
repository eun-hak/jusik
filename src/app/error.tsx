'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="bg-white min-h-[60vh] flex items-center justify-center">
      <div className="container-desktop flex flex-col items-center text-center gap-6 py-20">
        <h1 className="font-heading text-3xl md:text-4xl font-medium text-black">
          오류가 발생했습니다
        </h1>
        <p className="font-body text-[15px] text-gray-600 leading-relaxed max-w-sm">
          일시적인 오류입니다. 다시 시도하거나 문제가 지속되면 홈으로 돌아가세요.
        </p>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={reset}
            className="btn-primary font-body text-sm px-6 py-3 rounded-md"
          >
            다시 시도
          </button>
          <Link href="/" className="btn-secondary font-body text-sm px-6 py-3 rounded-md">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </section>
  );
}
