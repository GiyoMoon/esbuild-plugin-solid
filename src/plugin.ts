import { parse } from "path";
import { Plugin } from "esbuild";
import { readFile } from "fs/promises";
import { transformAsync } from "@babel/core";
import solid from "babel-preset-solid";
import ts from "@babel/preset-typescript";

export interface SolidOptions {
  hydratable?: boolean;
  generate?: 'dom' | 'ssr';
}

export function solidPlugin(options: SolidOptions = {}): Plugin {
  return {
    name: "esbuild:solid",

    setup(build) {
      build.onLoad({ filter: /\.(t|j)sx$/ }, async (args) => {
        const source = await readFile(args.path, { encoding: "utf-8" });

        const { name, ext } = parse(args.path);
        const filename = name + ext;

        const { code } = await transformAsync(source, {
          presets: [[solid, options], ts],
          filename,
          sourceMaps: "inline",
        });

        return { contents: code, loader: "js" };
      });
    },
  };
}
