import { Input } from '@/shared/shadcn/ui/input'
import cx from 'classnames'

export function ServerPubkeyInput({ value, onChange, error }: {
  value: string
  onChange: (value: string) => void
  error: boolean
}) {
  return (
    <div className='flex flex-col'>
      <Input
        placeholder="Paste link to server or its pubkey"
        className={cx('rounded-xl', {
          'border-red-500': error
        })}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <span className='text-xs text-neutral-500 px-3 mt-2 break-all'>
        Drop link like this: https://sogs.hloth.dev/bunsogs?public_key=8948f2d9046a40e7dbc0a4fd7c29d8a4fe97df1fa69e64f0ab6fc317afb9c945
      </span>
    </div>
  )
}