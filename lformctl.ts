import { typedDataGen as tdg, fs, path } from "./deps.ts";
import * as mod from "./mod.ts";
import docopt, {
  DocOptions,
} from "https://denopkg.com/Eyal-Shalev/docopt.js@v1.0.1/src/docopt.ts";

const $VERSION = "v1.1.3";
const docoptSpec = `
LHC Form Controller ${$VERSION}.

Usage:
  lformctl validate <lhc-json-src> [--lform-schema-ts=<url>] [--persist-on-error] [--verbose]
  lformctl json-to-tdg-ts <lhc-json-src> [--lform-schema-ts=<url>] [<lhc-tdg-ts-file>] [--verbose]
  lformctl -h | --help
  lformctl --version

Options:
  -h --help                   Show this screen
  --version                   Show version
  <lhc-json-src>              LHC Form JSON single local file name or glob (like "*.json" or "**/*.json")
  <lhc-tdg-ts-file>           LHC Form Typed Data Gen (TDG) TypeScript file name
  --lform-schema-ts=<url>     Where the lform.ts TypeScript schema can be found
  --persist-on-error          Saves the generated *.auto.ts file on error
  --verbose                   Be explicit about what's going on
`;

export interface CommandHandler {
  (options: DocOptions): Promise<true | void>;
}

export function isDryRun(options: DocOptions): boolean {
  const { "--dry-run": dryRun } = options;
  return dryRun ? true : false;
}

export function isVerbose(options: DocOptions): boolean {
  const { "--verbose": verbose } = options;
  return verbose ? true : false;
}

export function lhcFormJsonSources(options: DocOptions): string[] {
  const { "<lhc-json-src>": lhcFormJsonSrc } = options;
  const sources: string[] = [];
  if (lhcFormJsonSrc) {
    const sourceSpec = lhcFormJsonSrc.toString();
    if (fs.existsSync(sourceSpec)) {
      sources.push(sourceSpec);
    } else {
      for (const we of fs.expandGlobSync(sourceSpec)) {
        sources.push(we.path);
      }
    }
  }
  return sources;
}

export async function lhcFormJsonModuleOptions(
  options: DocOptions,
  forDynamicCompiling: boolean,
  moduleName: string,
  jsonContentFileName: string,
): Promise<tdg.JsonModuleOptions> {
  const { "--lform-schema-ts": lformSchemaTsSrcURL } = options;
  return await mod.defaultLhcFormJsonModuleOptions(
    forDynamicCompiling,
    moduleName,
    jsonContentFileName,
    lformSchemaTsSrcURL ? lformSchemaTsSrcURL.toString() : undefined,
  );
}

export async function validationHandler(
  options: DocOptions,
): Promise<true | void> {
  const {
    validate,
    "<lhc-json-src>": lhcFormJsonSrcSpec,
    "--persist-on-error": persistOnError,
  } = options;
  if (validate && lhcFormJsonSrcSpec) {
    const verbose = isVerbose(options);
    const sources = lhcFormJsonSources(options);
    if (sources.length == 0) {
      console.error(`No valid sources specified: ${lhcFormJsonSrcSpec}`);
      return true;
    }
    if (verbose) {
      console.log(`Validating ${sources.length} source files...`);
    }
    for (const source of sources) {
      const moduleName = tdg.forceExtension(
        ".auto.ts",
        path.relative(Deno.cwd(), source)
          .replaceAll(path.SEP, "__"), // TypeScript compiler doesn't like paths
      );
      const jmOptions = await lhcFormJsonModuleOptions(
        options,
        true,
        moduleName,
        source,
      );
      const lhcFormJsonModule = new mod.LhcFormJsonModule(jmOptions);
      const tsSrcDiagnostics = await lhcFormJsonModule.validate();
      if (tsSrcDiagnostics) {
        if (persistOnError) {
          const writtenToFile = lhcFormJsonModule.persistGeneratedSrcCode();
          if (verbose) console.log(`Created ${writtenToFile}`);
        } else {
          if (verbose) {
            console.log(
              `Generated file not persisted, use --persist-on-error to see source code`,
            );
          }
        }
        console.error(Deno.formatDiagnostics(tsSrcDiagnostics));
      } else {
        if (verbose) {
          console.log(
            `Validated ${path.relative(Deno.cwd(), source)} (no errors)`,
          );
        }
      }
    }
    return true;
  }
}

export async function jsonToTypedDataGenHandler(
  options: DocOptions,
): Promise<true | void> {
  const {
    "json-to-tdg-ts": jsonToTDG,
    "<lhc-json-src>": lhcFormJsonSrcSpec,
    "<lhc-tdg-ts-file>": lhcFormTdgTsFileName,
  } = options;
  if (jsonToTDG && lhcFormJsonSrcSpec) {
    const verbose = isVerbose(options);
    const sources = lhcFormJsonSources(options);
    if (sources.length == 0) {
      console.error(`No valid sources specified: ${lhcFormJsonSrcSpec}`);
      return true;
    }
    if (sources.length > 1 && lhcFormTdgTsFileName) {
      console.error(
        `<lhc-tdg-ts-file> should not be specified for multiple files`,
      );
      return true;
    }
    for (const source of sources) {
      const moduleName = lhcFormTdgTsFileName
        ? tdg.forceExtension(".tdg.ts", lhcFormTdgTsFileName.toString())
        : tdg.forceExtension(
          ".auto.tdg.ts",
          path.relative(Deno.cwd(), source)
            .replaceAll(path.SEP, "__"), // TypeScript compiler doesn't like paths
        );
      const jmOptions = await lhcFormJsonModuleOptions(
        options,
        false,
        moduleName,
        source,
      );
      const lhcFormJsonModule = new mod.LhcFormJsonModule(jmOptions);
      const writtenToFile = lhcFormJsonModule.persistTypedDataGenCode(
        tdg.forceExtension(
          ".auto.tdg.ts",
          source,
        ),
      );
      const relWritten = path.relative(Deno.cwd(), writtenToFile);
      if (verbose) {
        console.log(
          `Created ${relWritten}, run 'deno fmt ${relWritten}' to format it.`,
        );
      }
    }
    return true;
  }
}

if (import.meta.main) {
  const handlers: CommandHandler[] = [
    validationHandler,
    jsonToTypedDataGenHandler,
  ];
  try {
    const options = docopt(docoptSpec);
    let handled: true | void;
    for (const handler of handlers) {
      handled = await handler(options);
      if (handled) break;
    }
    if (!handled) {
      console.error("Unable to handle validly parsed docoptSpec:");
      console.dir(options);
    }
  } catch (e) {
    console.error(e.message);
  }
}
