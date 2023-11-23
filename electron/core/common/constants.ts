import path from "node:path";
import pkg from "../../../package.json";
import { app} from 'electron';

// Contains constants for this project

export const appDirectory = app.isPackaged ? path.join(app.getPath("documents"), pkg.name):path.join(app.getPath("documents"), pkg.name,"dev");

export const TRX_TYPE_SPENDING = -1
export const TRX_TYPE_INCOME = 1

export const CAT_TYPE_INCOME = 1
export const CAT_TYPE_SPENDING = -1

export const WALLET_TYPE_REGULAR = "regular"
export const WALLET_TYPE_SAVINGS = "saving"
export const WALLET_TYPE_INVESTMENT = "investment"

export const WALLET_TYPES = ["Regular","Saving","Investment"]