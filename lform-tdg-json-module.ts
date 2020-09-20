import { typedDataGen as tdg } from "./deps.ts";

export class LhcFormJsonModule extends tdg.JsonModule {
  static readonly defaultOptions = {
    imports: [
      {
        denoCompilerSrcKey: "/lform.ts",
        typeScriptImportRef: `import type * as lform from "./lform.ts"`,
        importedRefSourceCode: new tdg.TextFileSourceCode(
          "./lform.ts",
        ),
      },
    ],
    primaryConstName: "form",
    primaryConstTsType: "lform.NihLhcForm",
  };
}
