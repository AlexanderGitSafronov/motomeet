import { Button } from './Button'
import { useAppStore } from '@/store/useAppStore'
import { useT } from '@/i18n'

interface FollowButtonProps {
  riderId: string
  riderName: string
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
}

export function FollowButton({ riderId, riderName, size = 'sm', block }: FollowButtonProps) {
  const following = useAppStore((s) => !!s.following[riderId])
  const toggleFollow = useAppStore((s) => s.toggleFollow)
  const pushToast = useAppStore((s) => s.pushToast)
  const t = useT()

  const onClick = () => {
    const next = toggleFollow(riderId)
    pushToast({
      title: next ? `Ви стежите за ${riderName}` : `Ви відписались від ${riderName}`,
      icon: next ? 'success' : 'info',
    })
  }

  return (
    <Button
      size={size}
      block={block}
      variant={following ? 'primary' : 'soft'}
      onClick={onClick}
      aria-pressed={following}
    >
      {following ? t('Ви стежите') : t('Стежити')}
    </Button>
  )
}
