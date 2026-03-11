import Link from "next/link";
import { getStats, getArticles } from "@/lib/db/articles";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const stats = getStats();
  const recent = getArticles().slice(0, 5);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-medium text-black">대시보드</h1>
        <p className="font-body text-sm text-gray-500 mt-1">주식일기 콘텐츠 관리</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "전체 글", value: stats.total, color: "bg-black" },
          { label: "발행됨", value: stats.published, color: "bg-green-600" },
          { label: "초안", value: stats.draft, color: "bg-gray-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className={`w-2 h-2 rounded-full ${s.color} mb-3`} />
            <p className="font-heading text-3xl font-medium text-black">{s.value}</p>
            <p className="font-body text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 빠른 액션 */}
      <div className="flex gap-3 mb-10">
        <Link
          href="/admin/articles/new"
          className="font-body text-sm bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
        >
          + 새 글 쓰기
        </Link>
        <Link
          href="/admin/articles"
          className="font-body text-sm border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:border-gray-400 transition-colors"
        >
          글 전체 보기
        </Link>
      </div>

      {/* 최근 글 */}
      <div>
        <h2 className="font-heading text-xl font-medium text-black mb-4">최근 글</h2>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {recent.length === 0 ? (
            <p className="font-body text-sm text-gray-400 p-6 text-center">글이 없습니다.</p>
          ) : (
            <table className="w-full">
              <tbody>
                {recent.map((article, i) => (
                  <tr key={article.id} className={i !== 0 ? "border-t border-gray-50" : ""}>
                    <td className="px-5 py-4">
                      <p className="font-body text-sm text-black font-medium line-clamp-1">
                        {article.title}
                      </p>
                      <p className="font-body text-xs text-gray-400 mt-0.5">{article.date}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span
                        className={`font-body text-[11px] px-2.5 py-1 rounded-full ${
                          article.status === "published"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {article.status === "published" ? "발행됨" : "초안"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="font-body text-xs text-gray-400 hover:text-black transition-colors"
                      >
                        수정 →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
