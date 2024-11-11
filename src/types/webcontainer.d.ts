/* // src/types/webcontainer.d.ts
import { FileSystemAPI } from '@webcontainer/api';

declare module '@webcontainer/api' {
  interface FileSystemAPI {
    stat: (path: string) => Promise<{
      isFile: () => boolean;
      isDirectory: () => boolean;
    }>;
  }
} */