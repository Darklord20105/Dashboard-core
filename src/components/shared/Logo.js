// Config Imports
import themeConfig from '@/src/configs/themeConfig'

// SVG Imports
import LogoSvg from '@/src/assets/svg/logo'

// Util Imports
import { cn } from '@/src/lib/utils'

const Logo = ({ className }) => {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoSvg className='size-8.5' />
      <span className='text-xl font-bold'>{themeConfig.templateName}</span>
    </div>
  )
}

export default Logo
