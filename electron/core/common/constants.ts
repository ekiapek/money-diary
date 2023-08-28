import { homedir } from "os";
import { join } from "path";
import pkg from "../../../package.json";

// Contains constants for this project

export const appDirectory = join(homedir(), pkg.name);

export const TRX_TYPE_DEBIT = -1
export const TRX_TYPE_CREDIT = 1