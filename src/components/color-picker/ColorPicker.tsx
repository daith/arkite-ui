import {
  forwardRef,
  useCallback,
  useRef,
  type ChangeEvent,
  type MouseEvent,
} from 'react'
import { cn } from '../../utils/cn'

export type ColorPickerSize = 'sm' | 'md' | 'lg'

export interface ColorPickerProps {
  /** Current hex color value (e.g. "#ff0000") */
  value: string
  /** Callback fired when the color changes */
  onChange: (color: string) => void
  /** Whether the picker is disabled */
  disabled?: boolean
  /** Size variant */
  size?: ColorPickerSize
  /** Error state */
  error?: boolean
  /** Error message */
  errorMessage?: string
  /** Additional class name for the root element */
  className?: string
  /** Optional preset color swatches */
  presets?: string[]
}

const sizeConfig: Record<
  ColorPickerSize,
  { swatch: string; input: string; text: string; preset: string }
> = {
  sm: {
    swatch: 'h-8 w-8',
    input: 'h-8 px-3 text-xs',
    text: 'text-xs',
    preset: 'h-5 w-5',
  },
  md: {
    swatch: 'h-10 w-10',
    input: 'h-10 px-3 text-sm',
    text: 'text-sm',
    preset: 'h-6 w-6',
  },
  lg: {
    swatch: 'h-12 w-12',
    input: 'h-12 px-4 text-base',
    text: 'text-base',
    preset: 'h-7 w-7',
  },
}

/** Normalize a hex string: ensure # prefix and lowercase. */
function normalizeHex(raw: string): string {
  let hex = raw.trim().toLowerCase()
  if (!hex.startsWith('#')) hex = `#${hex}`
  return hex
}

/** Validate a hex color string (# + 3 or 6 hex chars). */
function isValidHex(hex: string): boolean {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)
}

/** Expand shorthand hex (#abc -> #aabbcc) for the native color input. */
function expandHex(hex: string): string {
  if (/^#[0-9a-f]{3}$/i.test(hex)) {
    const [, r, g, b] = hex
    return `#${r}${r}${g}${g}${b}${b}`
  }
  return hex
}

/**
 * Color picker with a clickable swatch, native color input, hex text input,
 * and optional preset color swatches.
 */
export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      value,
      onChange,
      disabled = false,
      size = 'md',
      error = false,
      errorMessage,
      className,
      presets,
    },
    ref
  ) => {
    const nativeInputRef = useRef<HTMLInputElement>(null)
    const cfg = sizeConfig[size]

    const openNativePicker = useCallback(
      (e: MouseEvent) => {
        e.preventDefault()
        if (disabled) return
        nativeInputRef.current?.click()
      },
      [disabled]
    )

    const handleNativeChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value.toLowerCase())
      },
      [onChange]
    )

    const handleHexInput = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value
        const normalized = normalizeHex(raw)

        // Always reflect what the user typed (normalized)
        if (isValidHex(normalized)) {
          onChange(normalized)
        }
      },
      [onChange]
    )

    const handleHexBlur = useCallback(() => {
      // On blur, ensure we have a valid value; if current text is invalid, reset
      const normalized = normalizeHex(value)
      if (isValidHex(normalized) && normalized !== value) {
        onChange(normalized)
      }
    }, [value, onChange])

    const handlePresetClick = useCallback(
      (color: string) => {
        if (disabled) return
        onChange(normalizeHex(color))
      },
      [disabled, onChange]
    )

    // Display value without # in the text input
    const displayHex = value.startsWith('#') ? value.slice(1) : value

    return (
      <div ref={ref} className={cn('inline-flex flex-col gap-2', className)}>
        <div className="inline-flex items-center gap-2">
          {/* Color swatch — opens native picker on click */}
          <button
            type="button"
            disabled={disabled}
            onClick={openNativePicker}
            className={cn(
              'shrink-0 rounded-md border transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 focus-visible:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error ? 'border-destructive' : 'border-input',
              cfg.swatch
            )}
            style={{ backgroundColor: isValidHex(value) ? expandHex(value) : undefined }}
            aria-label="Pick a color"
          />

          {/* Hidden native color input */}
          <input
            ref={nativeInputRef}
            type="color"
            value={isValidHex(value) ? expandHex(value) : '#000000'}
            onChange={handleNativeChange}
            disabled={disabled}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />

          {/* Hex text input */}
          <div
            className={cn(
              'inline-flex items-center rounded-md border bg-background',
              'transition-colors duration-200',
              'focus-within:ring-1 focus-within:ring-ring/40 focus-within:ring-offset-0',
              error
                ? 'border-destructive focus-within:ring-destructive'
                : 'border-input',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <span
              className={cn(
                'select-none pl-3 font-mono text-muted-foreground',
                cfg.text
              )}
            >
              #
            </span>
            <input
              type="text"
              value={displayHex}
              onChange={handleHexInput}
              onBlur={handleHexBlur}
              disabled={disabled}
              maxLength={6}
              spellCheck={false}
              autoComplete="off"
              className={cn(
                'w-[6.5ch] border-0 bg-transparent font-mono uppercase',
                'placeholder:text-muted-foreground',
                'focus:outline-none',
                'disabled:cursor-not-allowed',
                cfg.input,
                'pl-0'
              )}
              aria-label="Hex color value"
            />
          </div>
        </div>

        {/* Preset swatches */}
        {presets && presets.length > 0 && (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Preset colors">
            {presets.map((color) => {
              const normalized = normalizeHex(color)
              const isActive =
                normalizeHex(value) === normalized ||
                expandHex(normalizeHex(value)) === expandHex(normalized)

              return (
                <button
                  key={color}
                  type="button"
                  disabled={disabled}
                  onClick={() => handlePresetClick(color)}
                  className={cn(
                    'rounded-full border transition-all duration-150',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 focus-visible:ring-offset-0',
                    'hover:ring-2 hover:ring-ring hover:ring-offset-1',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    isActive
                      ? 'ring-2 ring-ring ring-offset-1 border-ring'
                      : 'border-input',
                    cfg.preset
                  )}
                  style={{
                    backgroundColor: isValidHex(normalized)
                      ? expandHex(normalized)
                      : undefined,
                  }}
                  aria-label={`Select color ${normalized}`}
                />
              )
            })}
          </div>
        )}

        {errorMessage && (
          <p className="text-xs text-destructive">{errorMessage}</p>
        )}
      </div>
    )
  }
)

ColorPicker.displayName = 'ColorPicker'
