export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
        <p className="font-body text-sm text-gray-500">불러오는 중...</p>
      </div>
    </div>
  );
}
