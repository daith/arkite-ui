import { describe, it, expect } from 'vitest'
import ts from 'typescript'
import { resolve } from 'node:path'

/**
 * Public API surface snapshot.
 *
 * Walks every export of src/index.ts and emits a sorted, stable report:
 * values with their type signatures, interfaces/type aliases with their
 * members expanded one level. Renaming, removing, or retyping anything
 * public — including a single prop on a Props interface — fails this
 * test until the snapshot is deliberately regenerated:
 *
 *     pnpm vitest run src/api-surface.test.ts -u
 *
 * The snapshot diff then documents the API change in the merge request.
 */

const ENTRY = resolve(__dirname, 'index.ts')

const TYPE_FORMAT =
  ts.TypeFormatFlags.NoTruncation |
  ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
  ts.TypeFormatFlags.WriteArrowStyleSignature

function buildReport(): string {
  const configPath = ts.findConfigFile(__dirname, ts.sys.fileExists, 'tsconfig.json')
  const config = configPath
    ? ts.parseJsonConfigFileContent(
        ts.readConfigFile(configPath, ts.sys.readFile).config,
        ts.sys,
        resolve(configPath, '..')
      ).options
    : {}
  const program = ts.createProgram([ENTRY], { ...config, noEmit: true })
  const checker = program.getTypeChecker()
  const source = program.getSourceFile(ENTRY)
  if (!source) throw new Error('entry not found')

  const moduleSymbol = checker.getSymbolAtLocation(source)
  if (!moduleSymbol) throw new Error('no module symbol')

  const lines: string[] = []

  for (const symbol of checker.getExportsOfModule(moduleSymbol)) {
    const name = symbol.getName()
    const resolved = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
    const flags = resolved.flags

    if (flags & (ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias)) {
      const decl = resolved.declarations?.[0]
      if (!decl) continue
      const type = checker.getDeclaredTypeOfSymbol(resolved)
      // Only members declared in our own source enter the report —
      // inherited React DOM/aria props are noise (and would churn the
      // snapshot on every @types/react upgrade).
      const props = type
        .getProperties()
        .filter((p) =>
          p.declarations?.some((d) => {
            const f = d.getSourceFile().fileName
            return f.includes('/src/') && !f.includes('node_modules')
          })
        )
      if (props.length > 0) {
        const members = props
          .map((p) => {
            const optional = p.flags & ts.SymbolFlags.Optional ? '?' : ''
            const pDecl = p.declarations?.[0] ?? decl
            const pType = checker.typeToString(
              checker.getTypeOfSymbolAtLocation(p, pDecl),
              pDecl,
              TYPE_FORMAT
            )
            return `  ${p.getName()}${optional}: ${pType}`
          })
          .sort()
        lines.push(`type ${name} {\n${members.join('\n')}\n}`)
      } else {
        // Unions, primitives, and other member-less aliases
        const text = checker.typeToString(type, decl, TYPE_FORMAT)
        lines.push(`type ${name} = ${text}`)
      }
    } else {
      const decl = resolved.declarations?.[0] ?? symbol.declarations?.[0]
      if (!decl) continue
      const type = checker.getTypeOfSymbolAtLocation(resolved, decl)
      const text = checker.typeToString(type, decl, TYPE_FORMAT)
      lines.push(`value ${name}: ${text}`)
    }
  }

  return lines.sort().join('\n\n') + '\n'
}

describe('public API surface', () => {
  it('matches the committed snapshot (run vitest -u after intentional API changes)', async () => {
    await expect(buildReport()).toMatchFileSnapshot('../api-report.txt')
  }, 120_000)
})
