import React, { useState } from 'react'
import { Download, File, FileText, Video, Image, Search, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { Id } from '../../../convex/_generated/dataModel'

type ResourceType = 'pdf' | 'video' | 'image' | 'other';

type Resource = {
  _id: Id <"attachments">;
  name: string;
  type: ResourceType;
  size ?: string;
  url: string;
  description?: string | "Guide complet du cours avec tous les concepts clés et exercices pratiques"
  addedAt?: Date | null;
  downloadProgress?: number | null;
};


const getResourceIcon = (type: ResourceType) => {
  switch (type) {
    case 'pdf':
      return <FileText className="w-5 h-5 text-[#D6620F]" />;
    case 'video':
      return <Video className="w-5 h-5 text-[#0097A7]" />;
    case 'image':
      return <Image className="w-5 h-5 text-[#0097A7]" aria-label="Image resource" />;
    default:
      return <File className="w-5 h-5 text-gray-400" />;
  }
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export const ResourcesPanel = ({ resources }: { resources: Resource[] }) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');
  const [downloading, setDownloading] = useState<Record<string, number>>({});
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');

  const filteredResources = resources
    .filter(resource => {
      const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || resource.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return (b?.addedAt?.getTime() || 0) - (a?.addedAt?.getTime() || 0);
        case 'name':
          return a?.name?.localeCompare(b?.name) || 0;
        case 'size':
          return parseFloat(a?.size || '0') - parseFloat(b?.size || '0');
        default:
          return 0;
      }
    });

  const handleDownload = async (resource: Resource) => {
    setDownloading(prev => ({ ...prev, [resource._id]: 0 }));
    
    // Simuler un téléchargement progressif
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setDownloading(prev => ({ ...prev, [resource._id]: i }));
    }
    
    window.open(resource.url, '_blank');
    setDownloading(prev => {
      const newState = { ...prev };
      delete newState[resource._id];
      return newState;
    });
  };

  return (
    <div className="h-full flex flex-col">
      <motion.div className={cn(
        "border-b border-white/10 space-y-4 backdrop-blur-sm",
        isMobile ? "p-2" : "p-4"
      )}>
        <div className={cn(
          "flex gap-2",
          isMobile ? "flex-col" : "flex-row"
        )}>
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 
              group-focus-within:text-[#0097A7] transition-colors" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une ressource..."
              className="pl-9 bg-white/5 text-gray-50 border-white/10 focus:border-[#0097A7] 
                transition-all duration-300 focus:bg-white/10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="shrink-0 hover:bg-[#0097A7] hover:border-[#0097A7] transition-colors"
              >
                <Filter className="w-4 h-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              className="bg-white/95 backdrop-blur-md border-white/10"
            >
              <DropdownMenuItem 
                onClick={() => setSortBy('date')}
                className="hover:bg-[#0097A7] transition-colors"
              >
                Trier par date
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy('name')}
                className="hover:bg-[#0097A7] transition-colors"
              >
                Trier par nom
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy('size')}
                className="hover:bg-[#0097A7] transition-colors"
              >
                Trier par taille
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <motion.div 
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {['all', 'pdf', 'video', 'image'].map((type) => (
            <Button 
              key={type}
              variant={selectedType === type ? "default" : "transparent"} 
              size="sm" 
              className={`text-xs transition-all duration-300 ${
                selectedType === type 
                  ? type === 'pdf' 
                    ? 'bg-[#D6620F] hover:bg-[#c55a0e]' 
                    : 'bg-[#0097A7] hover:bg-[#008697]'
                  : 'hover:bg-white/10'
              }`}
              onClick={() => setSelectedType(type as ResourceType | 'all')}
            >
              {type === 'all' ? 'Tous' : type.toUpperCase()}
            </Button>
          ))}
        </motion.div>
      </motion.div>

      <div className={cn(
        "flex-1 overflow-y-auto space-y-3",
        isMobile ? "p-2" : "p-4"
      )}>
        <AnimatePresence mode="popLayout">
          {filteredResources.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center text-gray-400 py-8"
            >
              Aucune ressource trouvée
            </motion.div>
          ) : (
            filteredResources.map((resource, index) => (
              <motion.div 
                key={resource._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  group bg-white/5 backdrop-blur-sm rounded-lg 
                  hover:bg-white/10 transition-all duration-300
                  hover:shadow-lg border border-transparent
                  ${resource.type === 'pdf' 
                    ? 'hover:shadow-[#D6620F]/10 hover:border-[#D6620F]/20' 
                    : 'hover:shadow-[#0097A7]/10 hover:border-[#0097A7]/20'}
                `}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-white/5 rounded-lg"
                    >
                      {getResourceIcon(resource.type)}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium text-white truncate">
                          {resource.name}
                        </h4>
                        <span className="text-xs text-gray-400 shrink-0">
                          {formatDate(resource.addedAt as Date)}
                        </span>
                      </div>
                      {resource.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {resource.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="px-4 pb-4">
                  {downloading[resource._id] !== undefined ? (
                    <div className="space-y-2">
                      <Progress 
                        value={downloading[resource._id]} 
                        className={`h-1 bg-white/5 ${
                          resource.type === 'pdf'
                            ? '[&>div]:bg-[#D6620F]'
                            : '[&>div]:bg-[#0097A7]'
                        }`}
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">
                          Téléchargement en cours...
                        </span>
                        <span className={`text-xs ${
                          resource.type === 'pdf' ? 'text-[#D6620F]' : 'text-[#0097A7]'
                        }`}>
                          {downloading[resource._id]}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {resource.size}
                      </span>
                      <Button
                        size="sm"
                        variant="orange"
                        className={`
                          opacity-20 group-hover:opacity-100 transition-all duration-300
                          ${resource.type === 'pdf'
                            ? 'hover:bg-[#D6620F] hover:text-white'
                            : 'hover:bg-[#0097A7] hover:text-white'}
                        `}
                        onClick={() => handleDownload(resource)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 
