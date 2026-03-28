#!/bin/bash
# pre-deploy-check.sh - Run all checks before tagging/deploying
# Usage: ./scripts/pre-deploy-check.sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0

print_status() {
    if [ "$1" -eq 0 ]; then
        printf "${GREEN}✓${NC} %s\n" "$2"
        PASSED=$((PASSED + 1))
    else
        printf "${RED}✗${NC} %s\n" "$2"
        FAILED=$((FAILED + 1))
    fi
}

print_header() {
    printf "\n${YELLOW}=== %s ===${NC}\n" "$1"
}

printf "\n"
printf "========================================\n"
printf "    Arkite UI Pre-Deployment Checks\n"
printf "========================================\n"

# 0. Check node_modules
if [ ! -d "node_modules" ]; then
    printf "${RED}Error: node_modules not found${NC}\n"
    printf "Please run: pnpm install\n"
    exit 1
fi

# 1. Lint
print_header "ESLint"
LINT_OUTPUT=$(pnpm run lint 2>&1)
LINT_EXIT=$?
LINT_ERRORS=$(echo "$LINT_OUTPUT" | grep -c " error " || true)
LINT_WARNINGS=$(echo "$LINT_OUTPUT" | grep -c " warning " || true)
if [ "$LINT_ERRORS" -eq 0 ]; then
    print_status 0 "Lint: No errors ($LINT_WARNINGS warnings)"
else
    print_status 1 "Lint: $LINT_ERRORS errors"
    echo "$LINT_OUTPUT" | grep "error" | head -5
fi

# 2. TypeScript
print_header "TypeScript"
TSC_OUTPUT=$(pnpm run typecheck 2>&1)
TSC_EXIT=$?
if [ "$TSC_EXIT" -eq 0 ]; then
    print_status 0 "TypeScript: No type errors"
else
    TSC_ERRORS=$(echo "$TSC_OUTPUT" | grep -c "error TS" || true)
    print_status 1 "TypeScript: $TSC_ERRORS type errors"
    echo "$TSC_OUTPUT" | grep "error TS" | head -5
fi

# 3. Unit Tests
print_header "Unit Tests"
TEST_OUTPUT=$(pnpm run test 2>&1)
TEST_EXIT=$?
CLEAN_TEST=$(echo "$TEST_OUTPUT" | sed 's/\x1b\[[0-9;]*m//g')
TEST_PASS=$(echo "$CLEAN_TEST" | grep -o '[0-9]* passed' | tail -1)
TEST_FAIL=$(echo "$CLEAN_TEST" | grep -o '[0-9]* failed' | tail -1)
if [ "$TEST_EXIT" -eq 0 ]; then
    print_status 0 "Tests: $TEST_PASS"
else
    print_status 1 "Tests: $TEST_FAIL ($TEST_PASS)"
    echo "$TEST_OUTPUT" | grep "FAIL" | head -5
fi

# 4. Build
print_header "Build"
BUILD_OUTPUT=$(pnpm run build 2>&1)
BUILD_EXIT=$?
if [ "$BUILD_EXIT" -eq 0 ]; then
    # Show output sizes
    INDEX_SIZE=$(du -sh dist/index.js 2>/dev/null | cut -f1 || echo "?")
    print_status 0 "Build: OK (index.js: $INDEX_SIZE)"
else
    print_status 1 "Build: Failed"
    echo "$BUILD_OUTPUT" | grep -i "error" | head -5
fi

# 5. Bundle Size
print_header "Bundle Size"
SIZE_OUTPUT=$(pnpm run size 2>&1)
SIZE_EXIT=$?
if [ "$SIZE_EXIT" -eq 0 ]; then
    print_status 0 "Size limit: Within budget"
else
    print_status 1 "Size limit: Exceeded"
    echo "$SIZE_OUTPUT" | tail -5
fi

# 6. Storybook Build
print_header "Storybook"
SB_OUTPUT=$(pnpm run build-storybook 2>&1)
SB_EXIT=$?
if [ "$SB_EXIT" -eq 0 ]; then
    SB_SIZE=$(du -sh storybook-static 2>/dev/null | cut -f1 || echo "?")
    print_status 0 "Storybook build: OK ($SB_SIZE)"
else
    print_status 1 "Storybook build: Failed"
    echo "$SB_OUTPUT" | grep -i "error" | head -5
fi

# 7. Storybook A11y Tests
print_header "Storybook A11y Tests"
A11Y_OUTPUT=$(pnpm vitest run --project storybook 2>&1)
A11Y_EXIT=$?
CLEAN_A11Y=$(echo "$A11Y_OUTPUT" | sed 's/\x1b\[[0-9;]*m//g')
A11Y_PASS=$(echo "$CLEAN_A11Y" | grep -o '[0-9]* passed' | tail -1)
A11Y_FAIL=$(echo "$CLEAN_A11Y" | grep -o '[0-9]* failed' | tail -1)
if [ "$A11Y_EXIT" -eq 0 ]; then
    print_status 0 "A11y: $A11Y_PASS"
else
    print_status 1 "A11y: $A11Y_FAIL ($A11Y_PASS)"
    echo "$A11Y_OUTPUT" | grep "FAIL" | head -5
fi

# 8. Git Status
print_header "Git Status"
DIRTY=$(git status --porcelain 2>/dev/null | grep -v '^\?\?' | wc -l | tr -d ' ')
if [ "$DIRTY" -eq 0 ]; then
    print_status 0 "Working tree: Clean"
else
    print_status 1 "Working tree: $DIRTY uncommitted changes"
    git status --short | grep -v '^??' | head -5
fi

# 9. Version Check
print_header "Version"
PKG_VERSION=$(node -p "require('./package.json').version" 2>/dev/null)
LATEST_TAG=$(git tag --sort=-version:refname | head -1 2>/dev/null)
printf "  package.json: v%s\n" "$PKG_VERSION"
printf "  Latest tag:   %s\n" "$LATEST_TAG"
if [ "v$PKG_VERSION" = "$LATEST_TAG" ]; then
    printf "  ${YELLOW}⚠${NC} Version matches latest tag — bump before tagging\n"
fi

# Summary
printf "\n"
printf "========================================\n"
printf "              Summary\n"
printf "========================================\n"
printf "Passed: ${GREEN}%d${NC}\n" "$PASSED"
printf "Failed: ${RED}%d${NC}\n" "$FAILED"
printf "\n"

if [ "$FAILED" -gt 0 ]; then
    printf "${RED}Pre-deployment checks FAILED${NC}\n"
    printf "Please fix the issues above before deploying.\n"
    exit 1
else
    printf "${GREEN}All pre-deployment checks PASSED${NC}\n"
    printf "Safe to tag and deploy!\n"
    exit 0
fi
