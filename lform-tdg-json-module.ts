import { fs, typedDataGen as tdg } from "./deps.ts";

export async function gitHubLformTsSourceCode(): Promise<tdg.SourceCode> {
  const lformTsUrl = new URL(
    "https://raw.githubusercontent.com/shah/ts-lhncbc-lforms/master/lform.ts",
  );
  const response = await fetch(
    lformTsUrl,
    {
      redirect: "follow",
    },
  );
  const content = await response.blob();
  const buffer = await content.arrayBuffer();
  const lformTs = new TextDecoder().decode(new Deno.Buffer(buffer).bytes());
  return {
    provenance: lformTsUrl,
    content: lformTs,
  };
}

export const defaultLhcFormJsonModuleOptions = {
  imports: [
    {
      denoCompilerSrcKey: "/lform.ts",
      typeScriptImportRef: `import type * as lform from "./lform.ts"`,
      importedRefSourceCode: fs.existsSync("./lform.ts")
        ? new tdg.TextFileSourceCode(
          "./lform.ts",
        )
        : await gitHubLformTsSourceCode(),
    },
  ],
  primaryConstName: "form",
  primaryConstTsType: "lform.NihLhcForm",
};

export class LhcFormJsonModule extends tdg.JsonModule {
}
