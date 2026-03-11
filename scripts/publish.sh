#!/bin/bash
# publish.sh - Verify and publish @arkite/ui to GitLab Package Registry
# Usage: ./scripts/publish.sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

printf "\n"
printf "========================================\n"
printf "    Arkite UI — Publish\n"
printf "========================================\n"

# Step 1: verify-changesets
printf "\n${YELLOW}[1/4] 驗證 Changesets 設定...${NC}\n"
./scripts/verify-changesets.sh
VERIFY_EXIT=$?

if [ "$VERIFY_EXIT" -ne 0 ]; then
    printf "\n${RED}驗證失敗，中止發布。${NC}\n"
    exit 1
fi

# Step 2: build
printf "\n${YELLOW}[2/4] Build...${NC}\n"
npm run build
BUILD_EXIT=$?

if [ "$BUILD_EXIT" -ne 0 ]; then
    printf "\n${RED}Build 失敗，中止發布。${NC}\n"
    exit 1
fi
printf "${GREEN}✓ Build 完成${NC}\n"

# Step 3: 確認版本
PKG_VERSION=$(node -p "require('./package.json').version" 2>/dev/null)
printf "\n${YELLOW}[3/4] 確認版本${NC}\n"
printf "即將發布：${GREEN}v%s${NC}\n" "$PKG_VERSION"
printf "確定要發布嗎？(y/N) "
read -r CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    printf "${YELLOW}已取消。${NC}\n"
    exit 0
fi

# Step 4: publish
printf "\n${YELLOW}[4/4] 發布到 GitLab Package Registry...${NC}\n"
npm run release
RELEASE_EXIT=$?

if [ "$RELEASE_EXIT" -ne 0 ]; then
    printf "\n${RED}發布失敗。${NC}\n"
    exit 1
fi

printf "\n${GREEN}========================================${NC}\n"
printf "${GREEN}  @arkite/ui@%s 發布成功！${NC}\n" "$PKG_VERSION"
printf "${GREEN}========================================${NC}\n"
printf "GitLab Package Registry: https://gitlab.com/foson.co/arkite-ui/-/packages\n\n"
