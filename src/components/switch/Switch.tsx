/**
 * Switch — semantic alias for Toggle.
 *
 * The existing Toggle component already implements a switch
 * (role="switch", track/thumb visual). This re-export provides
 * a more intuitive name for form use cases.
 *
 * @example
 * ```tsx
 * <Switch label="Enable notifications" />
 * <Switch size="sm" checked={value} onChange={onChange} />
 * ```
 */
export { Toggle as Switch } from '../toggle/Toggle'
export type { ToggleProps as SwitchProps, ToggleSize as SwitchSize } from '../toggle/Toggle'
