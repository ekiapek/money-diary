import { homedir } from "os";
import { join } from "path";
import pkg from "../../../package.json";

// Contains constants for this project

export const appDirectory = join(homedir(), pkg.name);

export const TRX_TYPE_SPENDING = -1
export const TRX_TYPE_INCOME = 1

export const CAT_TYPE_INCOME = 1
export const CAT_TYPE_SPENDING = -1

export const WALLET_TYPE_REGULAR = "regular"
export const WALLET_TYPE_SAVINGS = "saving"
export const WALLET_TYPE_INVESTMENT = "investment"

export const WALLET_TYPES = ["Regular","Saving","Investment"]