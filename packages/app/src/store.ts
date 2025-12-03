import { Store } from "@calpoly/mustang";
import { Msg } from "./messages";
import update from "./update";
import { Model, init } from "./model";

export class AppStore extends Store.Provider<Model, Msg> {
  constructor() {
    super(update, init, "splitroom:auth");
  }
}

export type { Model };
