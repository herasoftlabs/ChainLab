// src/stores/useWebContainerStore.ts

import { create } from 'zustand';  
import { WebContainer, FileSystemTree } from '@webcontainer/api';  
import { PACKAGE_JSON, HARDHAT_CONFIG } from '@/utils/chains/evm/hardhatUtils'; 

// Uygulama durumlarını tanımlayan sabitler
const STATUS = {
  IDLE: 'idle',                                    // Başlangıç durumu
  INITIALIZING: 'WebContainer başlatılıyor...',    // Başlatma durumu
  READY: 'WebContainer hazır',                     // Hazır durumu
  ERROR: 'Hata oluştu',                           // Hata durumu
  CREATING_PROJECT: 'Proje oluşturuluyor...',      // Proje oluşturma durumu
  COMPILING: 'Contract derleniyor...',             // Contract derleme durumu
  DEPLOYING: 'Contract deploy ediliyor...'         // Contract deploy durumu
} as const;  // TypeScript literal type olarak tanımlama

// STATUS object'inden type oluşturma
type Status = typeof STATUS[keyof typeof STATUS];

// Başarısız işlemleri tekrar deneme için yardımcı fonksiyon
const withRetry = async <T>(
  operation: () => Promise<T>,     // Çalıştırılacak asenkron işlem
  retries = 3,                     // Maksimum deneme sayısı
  delay = 1000                     // Denemeler arası bekleme süresi (ms)
): Promise<T> => {
  try {
    return await operation();      // İşlemi çalıştır
  } catch (error) {
    if (retries > 0) {            // Deneme hakkı varsa
      await new Promise(resolve => setTimeout(resolve, delay));  // Bekle
      return withRetry(operation, retries - 1, delay);          // Tekrar dene
    }
    throw error;                   // Deneme hakkı bittiyse hatayı fırlat
  }
};

// Store'un state ve metodlarını tanımlayan interface
interface WebContainerState {
  instance: WebContainer | null;   // WebContainer instance'ı
  isReady: boolean;               // Hazır olma durumu
  status: Status;                 // Mevcut durum
  error: string | null;           // Hata mesajı

  // Instance yönetim metodları
  initWebContainer: () => Promise<void>;        
  destroyWebContainer: () => Promise<void>;     
  
  // Proje yönetim metodları
  initializeProject: (projectId: string, projectName: string) => Promise<string>;
  ensureProjectStructure: (projectId: string) => Promise<boolean>;
  listAllProjects: () => Promise<{ id: string; name: string }[]>;
  projectExists: (projectId: string) => Promise<boolean>;
  
  // Dosya sistemi operasyonları
  createDirectory: (path: string) => Promise<void>;
  writeFile: (path: string, content: string) => Promise<void>;
  readFile: (path: string) => Promise<string>;
  readDirectory: (
    path: string,
    options?: { withFileTypes: true } | { withFileTypes?: false | undefined }
  ) => Promise<string[] | { name: string; isDirectory: () => boolean }[]>;
  deleteFile: (path: string) => Promise<void>;
  mountFiles: (path: string, files: FileSystemTree) => Promise<void>;
  
  // Smart Contract operasyonları
  compileContract: (projectId: string, contractContent: string, contractName: string) => Promise<any>;
  deployContract: (projectId: string, contractName: string) => Promise<boolean>;
  
  // Yardımcı metodlar
  setStatus: (status: Status) => void;
  setError: (error: string | null) => void;
  printProjectStructure: (projectId: string) => Promise<string>;
  getProjectPath: (projectId: string) => string;
}

export const useWebContainerStore = create<WebContainerState>((set, get) => {

  const handleError = (error: unknown, message: string) => {
    const errorMessage = error instanceof Error ? error.message : message;  
    set({ error: errorMessage, status: STATUS.ERROR });  
    throw new Error(errorMessage); 
  };

  const getInstance = () => {
    const instance = get().instance;  
    if (!instance) throw new Error('WebContainer başlatılmamış!');  
    return instance;  
  };

  return {
    // Başlangıç state değerleri
    instance: null,
    isReady: false,
    status: STATUS.IDLE,
    error: null,

    // Durum yönetimi metodları
    setStatus: (status) => set({ status }),  // Status güncelleme
    setError: (error) => set({ error }),     // Hata güncelleme

    // WebContainer başlatma
    initWebContainer: async () => {
      try {
        // Eğer instance varsa veya başlatma işlemi devam ediyorsa, işlemi iptal et
        if (get().instance || get().status === 'WebContainer başlatılıyor...') {
          return;
        }
    
        console.log('🚀 Starting WebContainer...');
        set({ status: STATUS.INITIALIZING });
        
        const { WebContainer } = await import('@webcontainer/api');
        const instance = await WebContainer.boot();
        
        // Root dizin yapısını oluştur
        await instance.fs.mkdir('/projects', { recursive: true });
        
        console.log('✅ WebContainer started successfully');
        console.log('📁 Root directory structure created: /projects');
        
        set({ 
          instance, 
          isReady: true, 
          error: null,
          status: STATUS.READY 
        });
      } catch (error) {
        console.error('❌ WebContainer initialization error:', error);
        const errorMessage = error instanceof Error ? error.message : 'WebContainer başlatılamadı';
        set({ 
          error: errorMessage, 
          status: STATUS.ERROR,
          isReady: false,
          instance: null
        });
      }
    },

    destroyWebContainer: async () => {
      const instance = get().instance;
      if (instance) {
        try {
  
          await instance.fs.rm('/projects', { recursive: true });
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      }

      set({ instance: null, isReady: false, status: STATUS.IDLE, error: null });
    },


    initializeProject: async (projectId, projectName) => {
      const instance = getInstance();

      if (!projectId || !projectName) {
        throw new Error('Geçersiz proje ID veya isim');
      }
    
      console.log(`🔨 Creating a new project: ${projectName} (${projectId})`);
    
      const exists = await get().projectExists(projectId);
      if (exists) {
        throw new Error('Bu ID ile bir proje zaten mevcut');
      }
    
      try {
        set({ status: STATUS.CREATING_PROJECT });
        const projectPath = `/projects/${projectId}`;
        
        console.log(`📁 Creating project directory: ${projectPath}`);
        await instance.fs.mkdir(projectPath, { recursive: true });
    
        const files: FileSystemTree = {
          'package.json': {
            file: { contents: PACKAGE_JSON },
          },
          'hardhat.config.js': {
            file: { contents: HARDHAT_CONFIG },
          },
          'contracts': { directory: {} },
          'scripts': { directory: {} },
          'test': { directory: {} },
          'README.md': {
            file: {
              contents: `# ${projectName}\nCreated at: ${new Date().toISOString()}\n`,
            },
          },
        };
    
        console.log('📦 Project files are being loaded...');
        await instance.mount(files, { mountPoint: projectPath });
    
        console.log('📥 Loading dependencies...');
        const installProcess = await instance.spawn('npm', ['install'], {
          cwd: projectPath
        });
    
        const exitCode = await installProcess.exit;
        if (exitCode !== 0) throw new Error('Paket kurulumu başarısız oldu');
    
        console.log('✅ Project created successfully!');
        set({ status: STATUS.READY });
        return projectPath;
      } catch (error) {
        console.error('❌ Project creation error:', error);
        handleError(error, 'Project could not be created');
        return '';
      }
    },

       ensureProjectStructure: async (projectId) => {
        const instance = getInstance();
  
        try {
          const projectPath = `/projects/${projectId}`;

          await withRetry(() => instance.fs.mkdir('/projects', { recursive: true }));
          await withRetry(() => instance.fs.mkdir(projectPath, { recursive: true }));
          await withRetry(() => instance.fs.mkdir(`${projectPath}/contracts`, { recursive: true }));
          return true;
        } catch (error) {
          handleError(error, 'Proje yapısı oluşturma hatası');
          return false;
        }
      },

      listAllProjects: async () => {
        const instance = getInstance();
        
        try {

          const projects = await get().readDirectory('/projects', { withFileTypes: true });
          const projectPromises = (projects as { name: string; isDirectory: () => boolean }[])
            .filter(p => p.isDirectory())  
            .map(async (project) => {
              try {
                const readmePath = `/projects/${project.name}/README.md`;
                const readme = await instance.fs.readFile(readmePath, 'utf-8');
                const nameMatch = readme.match(/# (.*)/); 
                return { 
                  id: project.name, 
                  name: nameMatch ? nameMatch[1] : project.name 
                };
              } catch {
                return { id: project.name, name: project.name };
              }
            });
  
          return await Promise.all(projectPromises);  
        } catch (error) {
          console.error('Projeleri listelerken hata:', error);
          return [];
        }
      },
  
      projectExists: async (projectId) => {
        try {
          const instance = getInstance();
          await instance.fs.readdir(get().getProjectPath(projectId));
          return true;
        } catch {
          return false;
        }
      },
 
      createDirectory: async (path) => {
        const instance = getInstance();
        await withRetry(() => instance.fs.mkdir(path, { recursive: true }));
      },

      writeFile: async (path, content) => {
        const instance = getInstance();
        await withRetry(() => instance.fs.writeFile(path, content));
      },

      readFile: async (path) => {
        const instance = getInstance();
        return await withRetry(() => instance.fs.readFile(path, 'utf-8'));
      },

      readDirectory: async (path, options?: { withFileTypes?: boolean }) => {
        const instance = getInstance();
      
        try {

          if (options?.withFileTypes === true) {
            return await instance.fs.readdir(path, { withFileTypes: true });
          } else {
            return await instance.fs.readdir(path, { withFileTypes: false });
          }
        } catch (error) {
          handleError(error, `Dizin okuma hatası (${path})`);
          return [];
        }
      },

      deleteFile: async (path: string) => {
        const instance = getInstance();
        
        try {

          await withRetry(() => instance.fs.rm(path, { recursive: true }));
        } catch (error) {
          // ENOENT hatası (dosya/dizin bulunamadı) durumunda sessizce çık
          if (error instanceof Error && error.message.includes('ENOENT')) {
            console.warn(`Dosya zaten mevcut değil: ${path}`);
            return;
          }
 
          throw new Error(`Dosya silinemedi: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
        }
      },

      mountFiles: async (path, files) => {
        const instance = getInstance();
        await withRetry(() => instance.mount(files, { mountPoint: path }));
      },

      compileContract: async (projectId, contractContent, contractName) => {
        const instance = getInstance();
  
        if (!contractContent?.trim()) {
          throw new Error('Contract içeriği boş olamaz');
        }
  
        if (!contractName?.match(/^[a-zA-Z][a-zA-Z0-9]*$/)) {
          throw new Error('Geçersiz contract ismi');
        }
  
        const projectPath = get().getProjectPath(projectId);
  
        try {
          set({ status: STATUS.COMPILING });

          await withRetry(() => 
            instance.fs.writeFile(
              `${projectPath}/contracts/${contractName}.sol`,
              contractContent
            )
          );
  
          const compileProcess = await instance.spawn('npx', ['hardhat', 'compile'], {
            cwd: projectPath
          });
          
          const exitCode = await compileProcess.exit;
          if (exitCode !== 0) throw new Error('Derleme başarısız oldu');
  
          const artifactsPath = `${projectPath}/artifacts/contracts/${contractName}.sol/${contractName}.json`;
          const artifact = await withRetry(() => 
            instance.fs.readFile(artifactsPath, 'utf-8')
          );
  
          set({ status: STATUS.READY });
          return JSON.parse(artifact);
        } catch (error) {
          handleError(error, 'Contract derleme hatası');
          return null;
        }
      },

      deployContract: async (projectId, contractName) => {
        const instance = getInstance();
        const projectPath = get().getProjectPath(projectId);
  
        try {
          set({ status: STATUS.DEPLOYING });

          const deployScript = `
            async function main() {
              const Contract = await ethers.getContractFactory("${contractName}");
              const contract = await Contract.deploy();
              await contract.deployed();
              console.log("Contract deployed to:", contract.address);
            }
            main().catch((error) => {
              console.error(error);
              process.exit(1);
            });
          `;

          await withRetry(() => 
            instance.fs.writeFile(
              `${projectPath}/scripts/deploy.js`,
              deployScript
            )
          );

          const deployProcess = await instance.spawn('npx', ['hardhat', 'run', 'scripts/deploy.js'], {
            cwd: projectPath
          });
          
          const exitCode = await deployProcess.exit;
          if (exitCode !== 0) throw new Error('Deploy başarısız oldu');
  
          set({ status: STATUS.READY });
          return true;
        } catch (error) {
          handleError(error, 'Contract deploy hatası');
          return false;
        }
      },

      printProjectStructure: async (projectId) => {
        const instance = getInstance();
        const projectPath = `/projects/${projectId}`;
        
        const listContents = async (path: string, indent = ''): Promise<string> => {
          const files = await instance.fs.readdir(path, { withFileTypes: true });
          let result = '';

          const directories = files
            .filter(f => f.isDirectory())
            .sort((a, b) => a.name.localeCompare(b.name));

          const regularFiles = files
            .filter(f => !f.isDirectory())
            .sort((a, b) => a.name.localeCompare(b.name));
      
          for (const dir of directories) {
            result += `${indent}[D] ${dir.name}\n`;
            result += await listContents(`${path}/${dir.name}`, indent + '  ');
          }
      
          for (const file of regularFiles) {
            result += `${indent}[F] ${file.name}\n`;
          }
      
          return result;
        };
      
        try {
          return await listContents(projectPath);
        } catch (error) {
          console.error('Dosya yapısı okunamadı:', error);
          return '';
        }
      },
  
      getProjectPath: (projectId) => `/projects/${projectId}`,
    };
  });