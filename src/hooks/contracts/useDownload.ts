// src/hooks/contracts/deploy/useDownload.ts

import { useState } from 'react';
import { toast } from 'react-toastify';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useWebContainerStore } from '@/stores/useWebContainerStore';

export const useDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { readDirectory, readFile } = useWebContainerStore();

  const handleDownload = async (projectId: string, projectName: string) => {
    if (!projectId) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const zip = new JSZip();
      const projectPath = `/projects/${projectId}`;
      setDownloadProgress(10);

      const processDirectory = async (path: string, zipFolder: JSZip) => {
        const entries = await readDirectory(path, { withFileTypes: true }) as { 
          name: string; 
          isDirectory: () => boolean 
        }[];

        for (const entry of entries) {
          if (entry.name === 'node_modules') continue;

          const fullPath = `${path}/${entry.name}`;
          const relativePath = fullPath.replace(projectPath + '/', '');
          setDownloadProgress(20);

          if (entry.isDirectory()) {
            /* await processDirectory(fullPath, zipFolder.folder(relativePath)!); */
            await processDirectory(fullPath, zipFolder);
          } else {
            const content = await readFile(fullPath);
            zipFolder.file(relativePath, content);
          }
          setDownloadProgress(prev => Math.min(prev + 5, 90));
        }
      };

      await processDirectory(projectPath, zip);
      setDownloadProgress(95);

      const zipContent = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      }, (metadata) => {
        const progress = Math.floor(metadata.percent);
        setDownloadProgress(90 + (progress * 0.1));
      });

      const fileName = `${projectName.toLowerCase().replace(/\s+/g, '-')}-project.zip`;
      saveAs(zipContent, fileName);
      setDownloadProgress(100);
      
      toast.success('Project files downloaded successfully!');
    } catch (error) {
      console.error('File download error:', error);
      toast.error('An error occurred while downloading files');
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1000);
    }
  };

  return {
    isDownloading,
    downloadProgress,
    handleDownload,
  };
};