import configProd from "./prod.js";
import configDev from "./dev.js";

export interface ConfigModal {
  dbURL: string;
  dbName: string;
  isGuestMode?:boolean

}

export let config:ConfigModal;

if (process.env.NODE_ENV === "production") {
  config = configProd;
} else {
  config = configDev;
}
config.isGuestMode = true;
