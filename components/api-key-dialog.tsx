'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiKeyAtom } from '@/lib/atoms/api-key'
import { useAtom } from 'jotai'
import { AlertCircleIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'

type ApiKeyDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApiKeyDialog({ open, onOpenChange }: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useAtom(apiKeyAtom)
  const [localKey, setLocalKey] = useState(apiKey)

  useEffect(() => {
    setLocalKey(apiKey)
  }, [apiKey])

  const isSaveDisabled = useMemo(() => localKey.trim().length === 0 || localKey === apiKey, [localKey, apiKey])

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure API Key</DialogTitle>
          <DialogDescription>Enter your Anthropic API key.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium" htmlFor="anthropic-key">
              Anthropic API Key
            </Label>
            <Input
              autoComplete="off"
              id="anthropic-key"
              onChange={(e) => setLocalKey(e.target.value)}
              placeholder="sk-ant-..."
              type="password"
              value={localKey}
            />
            <p className="text-muted-foreground text-xs">
              Get your API key from the{' '}
              <a
                className="text-blue-500 hover:underline"
                href="https://console.anthropic.com/settings/keys"
                rel="noreferrer"
                target="_blank"
              >
                Anthropic Console
              </a>
              .
            </p>
          </div>
        </div>

        <DialogFooter className="flex w-full items-center">
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <AlertCircleIcon className="size-4" /> This key is stored locally in your browser.
          </p>
          <Button
            className="ml-auto"
            disabled={isSaveDisabled}
            onClick={() => {
              if (!localKey.startsWith('sk-ant-')) {
                toast.error('Please use a valid Anthropic API key')
                return
              }
              setApiKey(localKey)
              toast.success('API key saved successfully')
              onOpenChange(false)
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
