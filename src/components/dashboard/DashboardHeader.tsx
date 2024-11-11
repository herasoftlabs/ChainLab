// src/components/dashboard/DashboardHeader.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import { PanelLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';

/* import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { ConnectKitButton } from 'connectkit'; */

const shortenAddress = (address: string, chars = 4): string => {
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

const DashboardHeader = () => {
  /* const { address, isConnected } = useAccount();
  const { data: balanceData, isError, isLoading } = useBalance({address,
  });
  const { disconnect } = useDisconnect(); */

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      
        {/* Search Area */}
        <div className="relative ml-auto mt-3 flex items-center justify-center flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
         
            <Input
            type="search"
            placeholder="Ara..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
           
        </div>   

        {/* User Dropdown */}
      {/*   <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
            >
                {isConnected && address ? (
                  <Image
                    src="/images/profile.png"
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="overflow-hidden rounded-full"
                  />
                ) : (
                  <ConnectKitButton.Custom>
                    {({ isConnected, show, hide, address, ensName, chain }) => (
                      <Button variant="outline" size="icon" onClick={show} className="overflow-hidden rounded-full">
                        <Image
                          src="/images/profile.png"
                          width={36}
                          height={36}
                          alt="Avatar"
                          className="overflow-hidden rounded-full"
                        />
                      </Button>
                    )}
                  </ConnectKitButton.Custom>
                )}
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            {isConnected && address ? (
              <>
                <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                <DropdownMenuItem className="cursor-default">
                  <span className="text-sm">Adres:</span>
                  <span className="font-mono">{shortenAddress(address)}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-default">
                  <span className="text-sm">Bakiye:</span>
                  <span className="font-mono">
                    {isLoading ? 'Yükleniyor...':'${balanceData?.balance}'}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Ayarlar</DropdownMenuItem>
                <DropdownMenuItem>Destek</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => disconnect()}>
                  Çıkış Yap
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem>
                <ConnectKitButton />
              </DropdownMenuItem>
            )}
            </DropdownMenuContent>
        </DropdownMenu> */}
    </header>
  );
};

export default DashboardHeader;
