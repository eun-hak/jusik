# images/ → public/img/*.webp (한 방에)
#   make webp        — WebP만 (yarn webp 와 동일)
#   make webp_small  — WebP + 워터마크 가장자리 크롭 (yarn webp_small 와 동일)
#   make webp-plain  — webp 와 동일 (호환용)
#
# 그 외 (같은 폴더에 .webp):
#   make webp-one FILE=public/img/hero.png
#   make webp-dir DIR=public/img

.PHONY: webp webp_small webp-strip webp-plain webp-one webp-dir webp-dir-rec help

help:
	@echo "make webp              — images/ → public/img/ (WebP만, yarn webp)"
	@echo "make webp_small        — WebP + 워터마크 가장자리 크롭 (yarn webp_small)"
	@echo "make webp-strip        — webp_small 과 동일 (호환용)"
	@echo "make webp-plain        — webp 와 동일 (호환용)"
	@echo "make webp-one FILE=... — 파일 하나"
	@echo "make webp-dir DIR=...  — 폴더 일괄"

webp webp-plain:
	node scripts/images-to-img-webp.mjs

webp_small webp-strip:
	node scripts/images-to-img-webp.mjs --strip-watermark

webp-one:
	@test -n "$(FILE)" || (echo "사용: make webp-one FILE=public/img/hero.png" && exit 1)
	node scripts/convert-to-webp.mjs "$(FILE)"

webp-dir:
	@test -n "$(DIR)" || (echo "사용: make webp-dir DIR=public/img" && exit 1)
	node scripts/convert-to-webp.mjs --dir "$(DIR)"

webp-dir-rec:
	@test -n "$(DIR)" || (echo "사용: make webp-dir-rec DIR=public" && exit 1)
	node scripts/convert-to-webp.mjs --dir "$(DIR)" --recursive
