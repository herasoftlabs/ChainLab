// components/contracts/steps/edit-contract/chain/evm/EditorBoard/ZoomControls.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlusCircle, MinusCircle, ZoomIn } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoom,
  onZoomChange,
}) => {
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 2;
  const ZOOM_STEP = 0.1;

  const handleZoomIn = () => {
    const newZoom = Math.min(MAX_ZOOM, zoom + ZOOM_STEP);
    onZoomChange(Number(newZoom.toFixed(1)));
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(MIN_ZOOM, zoom - ZOOM_STEP);
    onZoomChange(Number(newZoom.toFixed(1)));
  };

  const handleZoomReset = () => {
    onZoomChange(1);
  };

  const handleSliderChange = (value: number[]) => {
    onZoomChange(Number(value[0].toFixed(1)));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <ZoomIn className="h-4 w-4" />
          <span>{Math.round(zoom * 100)}%</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 p-2" 
        align="start"
        sideOffset={0}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= MIN_ZOOM}
            className="h-8 w-8 p-0"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 flex items-center gap-2">
            <Slider
              value={[zoom]}
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={ZOOM_STEP}
              onValueChange={handleSliderChange}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomReset}
              className="h-6 px-2 text-xs"
            >
              {Math.round(zoom * 100)}%
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= MAX_ZOOM}
            className="h-8 w-8 p-0"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};