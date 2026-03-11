import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const footerColumns: FooterColumn[] = [
  {
    title: "탐색",
    links: [
      { label: "홈", href: "/" },
      { label: "시장 분석", href: "/category/analysis" },
      { label: "종목", href: "/category/stocks" },
      { label: "투자노트", href: "/category/notes" },
      { label: "시장동향", href: "/category/market" },
    ],
  },
  {
    title: "더보기",
    links: [
      { label: "소개", href: "/about" },
      { label: "뉴스레터", href: "/newsletter" },
      { label: "카테고리", href: "/category" },
    ],
  },
  {
    title: "소셜",
    links: [
      { label: "트위터 (X)", href: "https://twitter.com", external: true },
      { label: "유튜브", href: "https://youtube.com", external: true },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white w-full">
      <div className="px-5 md:px-[120px] py-16 md:py-20">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:justify-between gap-10 md:gap-0">
          {/* Brand */}
          <div className="flex flex-col gap-5 max-w-[300px]">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                <span className="text-black font-heading text-base font-semibold">주</span>
              </div>
              <span className="text-white font-heading text-xl font-medium">주식일기</span>
            </Link>
            <p className="text-gray-500 font-body text-sm leading-relaxed">
              더 나은 투자 결정을 위한 시장 분석과 종목 탐구. 개인 투자자를 위한 실전 인사이트.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12 md:gap-16">
            {footerColumns.map((column) => (
              <div key={column.title} className="flex flex-col gap-4">
                <h4 className="text-white font-body text-[11px] font-semibold tracking-[1.5px]">
                  {column.title.toUpperCase()}
                </h4>
                <div className="flex flex-col gap-4">
                  {column.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-gray-500 font-body text-sm hover:text-gray-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mt-12 md:mt-16 pt-6 border-t border-gray-800">
          <p className="text-gray-600 font-body text-xs">
            © {year} 주식일기. 모든 권리 보유.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-gray-600 font-body text-xs hover:text-gray-400 transition-colors"
            >
              개인정보처리방침
            </Link>
            <Link
              href="/terms"
              className="text-gray-600 font-body text-xs hover:text-gray-400 transition-colors"
            >
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
