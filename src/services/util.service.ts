import * as fs from "fs";
import { IncomingMessage } from "http";
import * as fr from 'follow-redirects'
const { http, https } = fr;

export const utilService = {
  readJsonFile,
  download,
  httpGet,
  makeId,
  getRandomIntIc,
};

function getRandomIntIc(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function readJsonFile(path: string): JSON {
  const str = fs.readFileSync(path, "utf8");
  const json = JSON.parse(str);
  return json;
}

function download(url: string, fileName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(fileName);
    https.get(url, (content: IncomingMessage) => {
      content.pipe(file);
      file.on("error", reject);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    });
  });
}

function httpGet(url: string): Promise<string> {
  const protocol = url.startsWith("https") ? https : http;
  const options = {
    method: "GET",
  };

  return new Promise((resolve, reject) => {
    const req = protocol.request(url, options, (res: IncomingMessage) => {
      let data = "";
      res.on("data", (chunk: Buffer | string) => {
        data += chunk;
      });
      res.on("end", () => resolve(data));
    });
    req.on("error", (err: Error) => {
      reject(err);
    });
    req.end();
  });
}

function makeId(length = 5): string {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
