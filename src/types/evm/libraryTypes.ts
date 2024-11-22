// types/evm/libraryTypes.ts

import { OpenZeppelinContract } from "./contractTypes";

export type ContractLibraryType =
  | "openzeppelin"
  | "solmate"
  | "oz-upgradeable"
  | "custom";

export interface ContractLibrary {
  id: string;
  name: string;
  description: string;
  version: string;
  type: ContractLibraryType;
  website?: string;
  github?: string;
  contracts: OpenZeppelinContract[];
}
