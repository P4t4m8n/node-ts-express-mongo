import * as fs from "fs";

export const loggerService = {
  debug(...args: any[]) {
    doLog("DEBUG", ...args);
  },
  info(...args: any[]) {
    doLog("INFO", ...args);
  },
  warn(...args: any[]) {
    doLog("WARN", ...args);
  },
  error(...args: any[]) {
    doLog("ERROR", ...args);
  },
};

const logsDir = "./logs";
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

function getTime(): string {
  let now = new Date();
  return now.toLocaleString("he");
}

function isError(ev: Error) {
  return ev && ev.stack && ev.message;
}

function doLog(level: string, ...args: any[]) {
  const strs = args.map((arg) =>
    typeof arg === "string" || isError(arg) ? arg : JSON.stringify(arg)
  );
  var line = strs.join(" | ");
  line = `${getTime()} - ${level} - ${line}\n`;
  console.log(line);
  fs.appendFile(
    "./logs/backend.log",
    line,
    (err: NodeJS.ErrnoException | null) => {
      if (err) console.log("FATAL: cannot write to log file");
    }
  );
}
