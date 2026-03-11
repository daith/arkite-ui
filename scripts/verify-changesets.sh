#!/bin/bash
# verify-changesets.sh - Verify Changesets setup is ready for release
# Usage: ./scripts/verify-changesets.sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0
WARNED=0

pass() { printf "${GREEN}✓${NC} %s\n" "$1"; PASSED=$((PASSED + 1)); }
fail() { printf "${RED}✗${NC} %s\n" "$1"; FAILED=$((FAILED + 1)); }
warn() { printf "${YELLOW}⚠${NC} %s\n" "$1"; WARNED=$((WARNED + 1)); }

printf "\n"
printf "========================================\n"
printf "    Arkite UI — Changesets Verify\n"
printf "========================================\n\n"

# 1. changeset CLI 是否存在
printf "=== CLI ===\n"
if command -v changeset &>/dev/null || npx changeset --version &>/dev/null 2>&1; then
    VERSION=$(npx changeset --version 2>/dev/null || echo "unknown")
    pass "changeset CLI 可用 ($VERSION)"
else
    fail "changeset CLI 找不到 — 請執行 npm install"
fi

# 2. .changeset/config.json 存在且格式正確
printf "\n=== Config ===\n"
CONFIG=".changeset/config.json"
if [ -f "$CONFIG" ]; then
    pass "$CONFIG 存在"

    ACCESS=$(node -e "const c=require('./$CONFIG'); console.log(c.access)" 2>/dev/null)
    BASE=$(node -e "const c=require('./$CONFIG'); console.log(c.baseBranch)" 2>/dev/null)

    if [ "$ACCESS" = "public" ]; then
        pass "access: public"
    else
        warn "access 為 '$ACCESS'，若要發布公開套件請改為 public"
    fi

    if [ "$BASE" = "main" ]; then
        pass "baseBranch: main"
    else
        warn "baseBranch 為 '$BASE'，確認是否正確"
    fi
else
    fail "$CONFIG 不存在 — 請執行 npx changeset init"
fi

# 3. package.json publishConfig
printf "\n=== publishConfig ===\n"
PUB_ACCESS=$(node -e "const p=require('./package.json'); console.log(p.publishConfig?.access || '')" 2>/dev/null)
if [ "$PUB_ACCESS" = "public" ]; then
    pass "publishConfig.access: public"
else
    warn "publishConfig.access 未設定或非 public (值: '$PUB_ACCESS')"
fi

# 4. .npmrc 設定
printf "\n=== .npmrc ===\n"
if [ -f ".npmrc" ]; then
    pass ".npmrc 存在"
    if grep -q "registry" .npmrc 2>/dev/null; then
        REGISTRY=$(grep "registry" .npmrc | head -1)
        pass "registry 設定：$REGISTRY"
    else
        warn ".npmrc 裡沒有 registry 設定，會使用預設 registry.npmjs.org"
    fi
else
    warn ".npmrc 不存在 — 若要發布到 GitLab Package Registry 需要設定"
fi

# 5. 待發布的 changeset 檔案
printf "\n=== Pending Changesets ===\n"
PENDING=$(ls .changeset/*.md 2>/dev/null | grep -v README | wc -l | tr -d ' ')
if [ "$PENDING" -gt 0 ]; then
    warn "$PENDING 個待處理 changeset，執行 changeset version 後會 bump 版本"
    ls .changeset/*.md 2>/dev/null | grep -v README | while read f; do
        printf "  - %s\n" "$(basename $f)"
    done
else
    pass "沒有待處理的 changeset"
fi

# 6. 版本一致性
printf "\n=== Version ===\n"
PKG_VERSION=$(node -p "require('./package.json').version" 2>/dev/null)
LATEST_TAG=$(git tag --sort=-version:refname | head -1 2>/dev/null)
printf "  package.json: v%s\n" "$PKG_VERSION"
printf "  Latest tag:   %s\n" "${LATEST_TAG:-（無 tag）}"

if [ -z "$LATEST_TAG" ]; then
    warn "尚未有任何 git tag，首次發布前請確認版本號"
elif [ "v$PKG_VERSION" = "$LATEST_TAG" ]; then
    warn "版本與最新 tag 相同 — 發布前需先執行 changeset version 或手動 bump"
elif [ "v$PKG_VERSION" \> "$LATEST_TAG" ]; then
    pass "版本 v$PKG_VERSION 高於最新 tag $LATEST_TAG，可以發布"
else
    fail "package.json 版本 v$PKG_VERSION 低於最新 tag $LATEST_TAG，請確認"
fi

# 7. dist/ 是否為最新 build
printf "\n=== Build Artifacts ===\n"
if [ -f "dist/index.js" ]; then
    BUILD_TIME=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M" dist/index.js 2>/dev/null || stat -c "%y" dist/index.js 2>/dev/null | cut -d. -f1)
    pass "dist/index.js 存在 (最後 build: $BUILD_TIME)"
else
    fail "dist/index.js 不存在 — 請先執行 npm run build"
fi

# Summary
printf "\n"
printf "========================================\n"
printf "              Summary\n"
printf "========================================\n"
printf "Passed:  ${GREEN}%d${NC}\n" "$PASSED"
printf "Warned:  ${YELLOW}%d${NC}\n" "$WARNED"
printf "Failed:  ${RED}%d${NC}\n" "$FAILED"
printf "\n"

if [ "$FAILED" -gt 0 ]; then
    printf "${RED}驗證失敗，請修正上述問題再發布。${NC}\n"
    exit 1
elif [ "$WARNED" -gt 0 ]; then
    printf "${YELLOW}驗證通過，但有 $WARNED 個警告需確認。${NC}\n"
    exit 0
else
    printf "${GREEN}全部通過，可以執行 changeset publish。${NC}\n"
    exit 0
fi
