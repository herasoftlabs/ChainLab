// components/contracts/steps/publish-dapp/TemplateCard.tsx

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Rocket, Crown } from "lucide-react";
import Image from "next/image";
import { Template } from "@/types/frontendTemplate";
import { motion } from "framer-motion";

interface TemplateCardProps {
  template: Template;
  onPreview: () => void;
  onSetup: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onPreview,
  onSetup,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={template.thumbnail}
            alt={template.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform hover:scale-105"
            priority={false}
          />
          {template.isNew && (
            <Badge className="absolute top-2 left-2 bg-green-500">
              New
            </Badge>
          )}
          {template.isPremium && (
            <Badge className="absolute top-2 right-2 bg-yellow-500">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
          <p className="text-muted-foreground text-sm mb-4">
            {template.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {template.features.map((feature, index) => (
              <Badge key={index} variant="secondary">
                <small>{feature}</small>
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onPreview}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            className="flex-1"
            onClick={onSetup}
          >
            <Rocket className="w-4 h-4 mr-2" />
            Setup
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};