'use client'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export function ConnectConvexPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          Connect Convex Project
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div>
          <p>Connect a Convex project</p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
