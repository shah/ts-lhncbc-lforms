import { fs, typedDataGen as tdg, cache } from "./deps.ts";

export const lformSchemaTsGitHubURL = new URL(
  "https://raw.githubusercontent.com/shah/ts-lhncbc-lforms/master/lform.ts",
);

const sourceCodeCache = cache.lruCache<tdg.SourceCode & tdg.Validatable>();

export async function acquireSourceCode(
  provenance: string | URL,
): Promise<tdg.SourceCode & tdg.Validatable> {
  const cacheKey = provenance.toString();
  let sc = sourceCodeCache[cacheKey];
  if (!sc) {
    sc = await tdg.acquireSourceCode(provenance);
    sourceCodeCache[cacheKey] = sc;
  }
  return sc;
}

export async function defaultLhcFormJsonModuleOptions(
  forDynamicCompiling: boolean,
  moduleName: string,
  jsonContentFileName: string,
  lformSchemaTsSrcURL?: string,
): Promise<tdg.JsonModuleOptions> {
  const localSrcFileFound = fs.existsSync("./lform.ts");
  const defaultLformTsRef = localSrcFileFound
    ? "./lform.ts"
    : lformSchemaTsGitHubURL;
  let lformSC: tdg.SourceCode & tdg.Validatable;
  if (lformSchemaTsSrcURL) {
    lformSC = await acquireSourceCode(lformSchemaTsSrcURL);
    if (!lformSC.isValid) {
      console.error(
        `${lformSchemaTsSrcURL} is not a valid LCH Form Schema reference. Using default (${defaultLformTsRef}) instead.`,
      );
      lformSC = await acquireSourceCode(defaultLformTsRef);
    }
  } else {
    lformSC = await acquireSourceCode(defaultLformTsRef);
  }
  return {
    imports: [
      {
        denoCompilerSrcKey: (sc: tdg.SourceCode): string => {
          return "/lform.ts";
        },
        typeScriptImportRef: (sc: tdg.SourceCode): string => {
          return !forDynamicCompiling && tdg.isRemoteSourceCode(sc)
            ? `import type * as lform from "${sc.fetchResult.finalURL}"`
            : `import type * as lform from "./lform.ts"`;
        },
        importedRefSourceCode: lformSC,
      },
    ],
    primaryConstName: "form",
    primaryConstTsType: "lform.NihLhcForm",
    moduleName: moduleName,
    jsonContentFileName: jsonContentFileName,
  };
}

export class LhcFormJsonModule extends tdg.JsonModule {
}
