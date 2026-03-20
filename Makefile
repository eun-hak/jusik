# images/ → public/img/*.webp (한 방에)
#   make webp   (= WebP + AI 워터마크 가장자리 크롭, yarn webp 와 동일)
#   make webp-plain — 크롭 없이 WebP만
#
# 그 외 (같은 폴더에 .webp):
#   make webp-one FILE=public/img/hero.png
#   make webp-dir DIR=public/img

.PHONY: webp webp-strip webp-plain webp-one webp-dir webp-dir-rec help

help:
	@echo "make webp              — images/ → public/img/ (WebP + 워터마크 크롭, yarn webp)"
	@echo "make webp-strip        — webp 와 동일 (호환용)"
	@echo "make webp-plain        — WebP만 (가장자리 크롭 없음)"
	@echo "make webp-one FILE=... — 파일 하나"
	@echo "make webp-dir DIR=...  — 폴더 일괄"

webp webp-strip:
	STRIP_AI_WATERMARK=1 node scripts/images-to-img-webp.mjs

webp-plain:
	node scripts/images-to-img-webp.mjs

webp-one:
	@test -n "$(FILE)" || (echo "사용: make webp-one FILE=public/img/hero.png" && exit 1)
	node scripts/convert-to-webp.mjs "$(FILE)"

webp-dir:
	@test -n "$(DIR)" || (echo "사용: make webp-dir DIR=public/img" && exit 1)
	node scripts/convert-to-webp.mjs --dir "$(DIR)"

webp-dir-rec:
	@test -n "$(DIR)" || (echo "사용: make webp-dir-rec DIR=public" && exit 1)
	node scripts/convert-to-webp.mjs --dir "$(DIR)" --recursive
