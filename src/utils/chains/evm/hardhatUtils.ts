// src/utils/evm/hardhatUtils.ts

export const PACKAGE_JSON = `{
    "name": "hardhat-project",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "hardhat test",
      "compile": "hardhat compile"
    },
    "dependencies": {
      "hardhat": "^2.17.0",
      "@nomicfoundation/hardhat-toolbox": "^3.0.0"
    }
  }`;
  
  export const HARDHAT_CONFIG = `
  require("@nomicfoundation/hardhat-toolbox");
  
  module.exports = {
    solidity: "0.8.19",
    networks: {
      hardhat: {
        chainId: 1337
      }
    }
  };`;
  
  /* export const createHardhatProject = async (projectPath: string) => {
    const instance = getWebContainerInstance();
    if (!instance) throw new Error('WebContainer başlatılmamış!');
  
    try {
      // Temel dizin yapısını oluştur
      await instance.fs.mkdir(projectPath);
      await instance.fs.mkdir(`${projectPath}/contracts`);
      await instance.fs.mkdir(`${projectPath}/scripts`);
      await instance.fs.mkdir(`${projectPath}/test`);
  
      // Temel dosyaları oluştur
      await instance.fs.writeFile(
        `${projectPath}/package.json`,
        PACKAGE_JSON
      );
      await instance.fs.writeFile(
        `${projectPath}/hardhat.config.js`,
        HARDHAT_CONFIG
      );
  
      return true;
    } catch (error) {
      console.error('Hardhat proje oluşturma hatası:', error);
      throw error;
    }
  }; */