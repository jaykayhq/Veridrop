import Datastore from "nedb-promises";
import path from "path";

const dbDir = path.join(process.cwd(), "data");

function createDb(name: string) {
  return Datastore.create({ filename: path.join(dbDir, `${name}.db`), autoload: true });
}

export const db = {
  users: createDb("users"),
  products: createDb("products"),
  orders: createDb("orders"),
  escrows: createDb("escrows"),
  inspections: createDb("inspections"),
  qrSeals: createDb("qrSeals"),
  dispatchCompanies: createDb("dispatchCompanies"),
  riders: createDb("riders"),
  disputes: createDb("disputes"),
  notifications: createDb("notifications"),
  transactions: createDb("transactions"),
};
