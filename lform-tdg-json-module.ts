import { fs, typedDataGen as tdg } from "./deps.ts";

export const lformSchemaTsGitHubURL = new URL(
  "https://raw.githubusercontent.com/shah/ts-lhncbc-lforms/master/lform.ts",
);

export async function defaultLhcFormJsonModuleOptions(
  lformSchemaTsSrcURL?: string,
) {
  const defaultLformTsRef = fs.existsSync("./lform.ts")
    ? "./lform.ts"
    : lformSchemaTsGitHubURL;
  let lformSC: tdg.SourceCode;
  if (lformSchemaTsSrcURL) {
    lformSC = await tdg.acquireSourceCode(lformSchemaTsSrcURL);
    if (!lformSC.isValid) {
      console.error(
        `${lformSchemaTsSrcURL} is not a valid LCH Form Schema reference. Using default (${defaultLformTsRef}) instead.`,
      );
      lformSC = await tdg.acquireSourceCode(defaultLformTsRef);
    }
  } else {
    lformSC = await tdg.acquireSourceCode(defaultLformTsRef);
  }

  return {
    imports: [
      {
        denoCompilerSrcKey: "/lform.ts",
        typeScriptImportRef: `import type * as lform from "./lform.ts"`,
        importedRefSourceCode: lformSC,
      },
    ],
    primaryConstName: "form",
    primaryConstTsType: "lform.NihLhcForm",
  };
}

export class LhcFormJsonModule extends tdg.JsonModule {
}
