import "obsidian";

declare module "obsidian" {
  // export interface App {
  //   foldManager: FoldManager;
  // }

  // export interface TemplaterNewNoteEvent {
  //   file: TFile;
  //   contents: string;
  // }

  // export interface TemplaterOverwriteEvent {
  //   file: TFile;
  //   contents: string;
  // }

  // export interface TemplaterAppendedEvent {
  //   oldSelections: EditorSelection[];
  //   newSelections: EditorSelection[];
  //   view: MarkdownView;
  //   content: string;
  // }

  // interface MarkdownView {
  //   onMarkdownFold(): void;
  // }

  interface MarkdownSubView {
    applyFoldInfo(foldInfo: FoldInfo): void;
    getFoldInfo(): FoldInfo | null;
  }

  interface Editor {
    cm: CodeMirror.Editor;
  }

  // interface EditorSuggestManager {
  //   suggests: EditorSuggest<any>[];
  // }

  // export interface Workspace extends Events {
  //   on(name: "status-bar-updated", callback: () => any, ctx?: any): EventRef;
  //   on(name: "ribbon-bar-updated", callback: () => any, ctx?: any): EventRef;
  //   on(
  //     name: "templates:template-appended",
  //     callback: (event: TemplaterAppendedEvent) => any,
  //     ctx?: any
  //   ): EventRef;
  //   on(
  //     name: "templater:new-note-from-template",
  //     callback: (event: TemplaterNewNoteEvent) => any,
  //     ctx?: any
  //   ): EventRef;
  //   on(
  //     name: "templater:template-appended",
  //     callback: (event: TemplaterAppendedEvent) => any,
  //     ctx?: any
  //   ): EventRef;
  //   on(
  //     name: "templater:overwrite-file",
  //     callback: (event: TemplaterOverwriteEvent) => any,
  //     ctx?: any
  //   ): EventRef;

  //   editorSuggest: EditorSuggestOwner;
  // }
  // interface VaultSettings {
  //   legacyEditor: boolean;
  //   foldHeading: boolean;
  //   foldIndent: boolean;
  //   rightToLeft: boolean;
  //   readableLineLength: boolean;
  //   tabSize: number;
  //   showFrontmatter: boolean;
  // }

  interface FoldPosition {
    from: number;
    to: number;
  }

  interface FoldInfo {
    folds: FoldPosition[];
    lines: number;
  }

  // export interface FoldManager {
  //   load(file: TFile): Promise<FoldInfo>;
  //   save(file: TFile, foldInfo: FoldInfo): Promise<void>;
  // }

  // interface Vault {
  //   config: Record<string, any>;
  //   getConfig<T extends keyof VaultSettings>(setting: T): VaultSettings[T];
  // }

  // export interface PluginInstance {
  //   id: string;
  // }

  // export interface ViewRegistry {
  //   viewByType: Record<string, (leaf: WorkspaceLeaf) => unknown>;
  //   isExtensionRegistered(extension: string): boolean;
  // }

  // export interface App {
  //   internalPlugins: InternalPlugins;
  //   viewRegistry: ViewRegistry;
  // }
  // export interface InstalledPlugin {
  //   enabled: boolean;
  //   instance: PluginInstance;
  // }

  // export interface InternalPlugins {
  //   plugins: Record<string, InstalledPlugin>;
  //   getPluginById(id: string): InstalledPlugin;
  // }
}
