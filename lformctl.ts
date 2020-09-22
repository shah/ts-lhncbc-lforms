import { typedDataGen as tdg } from "./deps.ts";
import * as mod from "./mod.ts";
import docopt, {
  DocOptions,
} from "https://denopkg.com/Eyal-Shalev/docopt.js@v1.0.1/src/docopt.ts";

const docoptSpec = `
LHC Form Controller.

Usage:
  lformctl.ts validate <lhc-json-file> [--lform-schema-ts=<url>] [--persist-on-error] [--verbose]
  lformctl.ts json-to-tdg-ts <lhc-json-file> [--lform-schema-ts=<url>] [<lhc-tdg-ts-file>] [--verbose]
  lformctl.ts -h | --help
  lformctl.ts --version

Options:
  -h --help                   Show this screen
  --version                   Show version
  <lhc-json-file>             LHC Form JSON file name (can be local or URL)
  <lhc-tdg-ts-file>           LHC Form Typed Data Gen (TDG) TypeScript file name
  --lform-schema-ts=<url>     Where the lform.ts TypeScript schema can be found
  --persist-on-error          Saves the generated *.auto.ts file on error
  --verbose                   Be explicit about what's going on
`;

export interface CommandHandler {
  (options: DocOptions): Promise<true | void>;
}

export async function validationHandler(
  options: DocOptions,
): Promise<true | void> {
  const {
    validate,
    "<lhc-json-file>": lhcFormJsonFileName,
    "--lform-schema-ts": lformSchemaTsSrcURL,
    "--persist-on-error": persistOnError,
    "--verbose": verbose,
  } = options;
  if (validate && lhcFormJsonFileName) {
    const moduleName = tdg.forceExtension(
      ".auto.ts",
      lhcFormJsonFileName.toString(),
    );
    const lhcFormJsonModule = new mod.LhcFormJsonModule({
      ...await mod.defaultLhcFormJsonModuleOptions(
        lformSchemaTsSrcURL ? lformSchemaTsSrcURL.toString() : undefined,
      ),
      moduleName: moduleName,
      jsonContentFileName: lhcFormJsonFileName.toString(),
    });
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
    }
    return true;
  }
}

export async function jsonToTypedDataGenHandler(
  options: DocOptions,
): Promise<true | void> {
  const {
    "json-to-tdg-ts": jsonToTDG,
    "<lhc-json-file>": lhcFormJsonFileName,
    "<lhc-tdg-ts-file>": lhcFormTdgTsFileName,
    "--lform-schema-ts": lformSchemaTsSrcURL,
    "--verbose": verbose,
  } = options;
  if (jsonToTDG && lhcFormJsonFileName) {
    const moduleName = lhcFormTdgTsFileName
      ? tdg.forceExtension(".tdg.ts", lhcFormTdgTsFileName.toString())
      : tdg.forceExtension(
        ".auto.tdg.ts",
        lhcFormJsonFileName.toString(),
      );
    const lhcFormJsonModule = new mod.LhcFormJsonModule({
      ...await mod.defaultLhcFormJsonModuleOptions(
        lformSchemaTsSrcURL ? lformSchemaTsSrcURL.toString() : undefined,
      ),
      moduleName: moduleName,
      jsonContentFileName: lhcFormJsonFileName.toString(),
    });
    const writtenToFile = lhcFormJsonModule.persistTypedDataGenCode(moduleName);
    if (verbose) {
      console.log(
        `Created ${writtenToFile}, run 'deno fmt ${writtenToFile}' to format it.`,
      );
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
