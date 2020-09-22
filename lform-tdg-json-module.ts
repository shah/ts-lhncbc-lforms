import { fs, typedDataGen as tdg } from "./deps.ts";

export const lformSchemaTsGitHubURL = new URL(
  "https://raw.githubusercontent.com/shah/ts-lhncbc-lforms/master/lform.ts",
);

export async function defaultLhcFormJsonModuleOptions(
  lformSchemaTsSrcURL?: string,
) {
  return {
    imports: [
      {
        denoCompilerSrcKey: "/lform.ts",
        typeScriptImportRef: `import type * as lform from "./lform.ts"`,
        importedRefSourceCode: await tdg.acquireSourceCode(
          lformSchemaTsSrcURL
            ? lformSchemaTsSrcURL
            : (fs.existsSync("./lform.ts") ? "./lform.ts"
            : lformSchemaTsGitHubURL),
        ),
      },
    ],
    primaryConstName: "form",
    primaryConstTsType: "lform.NihLhcForm",
  };
}

export class LhcFormJsonModule extends tdg.JsonModule {
}
