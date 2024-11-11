// src/components/ui/ChainIcon.tsx

import Image from 'next/image';
import { CHAIN_ICONS } from '@/utils/constants';
import { findChainByIdAndKey } from '@/utils/constants';

interface ChainIconProps {
  chainId: string;
  chainKey?: string; 
  size?: number;
  className?: string;
}


export const ChainIcon: React.FC<ChainIconProps> = ({ 
  chainId,
  chainKey,
  size = 24,
  className = '' 
}) => {
  const chain = chainKey ? findChainByIdAndKey(chainId, chainKey) : undefined;
  const iconPath = chain?.icon || CHAIN_ICONS.default;

  return (
   

    <span className={`inline-flex ${className}`} style={{ width: size, height: size }}> 
    <Image
      src={iconPath}
      alt={`${chain?.name || chainId} icon`}
      width={size}
      height={size}
      className="rounded-full"
    />
    </span>
  );
};



