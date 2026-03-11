import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="bg-white min-h-[60vh] flex items-center justify-center">
      <div className="container-desktop flex flex-col items-center text-center gap-6 py-20">
        <span className="font-heading text-8xl font-medium text-gray-100 select-none">404</span>
        <h1 className="font-heading text-3xl md:text-4xl font-medium text-black -mt-4">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="font-body text-[15px] text-gray-600 leading-relaxed max-w-sm">
          요청하신 페이지가 삭제되었거나 주소가 변경되었습니다.
        </p>
        <div className="flex items-center gap-3 mt-2">
          <Link href="/" className="btn-primary font-body text-sm px-6 py-3 rounded-md">
            홈으로 돌아가기
          </Link>
          <Link href="/search" className="btn-secondary font-body text-sm px-6 py-3 rounded-md">
            검색하기
          </Link>
        </div>
      </div>
    </section>
  );
}
