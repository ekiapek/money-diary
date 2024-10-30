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

export const BUDGET_RESET_FREQUENCY_MONTHLY = "monthly"
export const BUDGET_RESET_FREQUENCY_WEEKLY = "weekly"
export const BUDGET_RESET_FREQUENCY_DAILY = "daily"

export const BUDGET_RESET_UNIT_DAY_WEEK = "dow"
export const BUDGET_RESET_UNIT_DAY_MONTH = "dom"