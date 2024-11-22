// data/contractLibraries.ts
import { ContractLibrary } from "@/types/evm/libraryTypes";
import { openZeppelinContracts } from "./openzeppelin/contracts";

export const contractLibraries: ContractLibrary[] = [
  {
    id: "openzeppelin",
    name: "OpenZeppelin",
    description: "The standard for secure blockchain applications",
    version: "4.9.0",
    type: "openzeppelin",
    website: "https://openzeppelin.com/contracts",
    github: "https://github.com/OpenZeppelin/openzeppelin-contracts",
    contracts: openZeppelinContracts,
  },
  // other libraries
];
