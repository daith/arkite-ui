import type { Meta, StoryFn } from '@storybook/react-vite'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  CommandDialog,
  useCommandPalette,
} from '../../components/command-palette'
import { Button } from '../../components/button'

const meta: Meta = {
  title: 'Overlay/CommandPalette',
}

export default meta

export const Inline: StoryFn = () => (
  <Command className="w-96 rounded-lg border shadow-md">
    <CommandInput placeholder="Type a command or search..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem>Calendar</CommandItem>
        <CommandItem>Search Emoji</CommandItem>
        <CommandItem>Calculator</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem>
          Profile
          <CommandShortcut>Cmd+P</CommandShortcut>
        </CommandItem>
        <CommandItem>
          Billing
          <CommandShortcut>Cmd+B</CommandShortcut>
        </CommandItem>
        <CommandItem>
          Settings
          <CommandShortcut>Cmd+S</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
)

const DialogDemo = () => {
  const { open, setOpen } = useCommandPalette()
  return (
    <>
      <div className="space-y-2 text-center">
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <p className="text-xs text-muted-foreground">
          or press <kbd className="rounded border bg-muted px-1.5 py-0.5 text-xs font-mono">Cmd+K</kbd>
        </p>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => setOpen(false)}>
              New Project
              <CommandShortcut>Cmd+N</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              Search Users
              <CommandShortcut>Cmd+U</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              Toggle Theme
              <CommandShortcut>Cmd+T</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => setOpen(false)}>Dashboard</CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>Projects</CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

export const Dialog: StoryFn = () => <DialogDemo />
