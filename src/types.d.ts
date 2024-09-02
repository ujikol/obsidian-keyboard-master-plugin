import { Command, Plugin } from "obsidian";


interface CommandCreatorInterface {
  (plugin: MyPluginInterface): Command;
}

interface MyPluginInterface extends Plugin {
  // loadSettings(): Promise<void>;
  // saveSettings(): Promise<void>;
}
