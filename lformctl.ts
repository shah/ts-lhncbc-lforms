import { govnData, govnDataCLI as gdctl, path } from "./deps.ts";

const $VERSION = "v1.3.7";
const docoptSpec = `
Goverend LHC Form Data Controller (GLForm) ${$VERSION}.

GLForm is a wrapper around the GovSuite GDC Controller which allows a more convenient CLI for
managing LForm Schemas.

Usage:
  lformctl lform type <lform-json-src> [--lform-schema-ts=<url>] [--validate] [--overwrite] [--verbose] [--dry-run]
  lformctl -h | --help
  lformctl --version

Options:
  <lform-json-src>            LHC Form JSON single local file name or glob (like "*.json" or "**/*.json")
  --lform-schema-ts=<url>     Where the lform.ts TypeScript schema can be found
  --validate                  Validate the generated TypeScript
  --overwrite                 If the destination file already exists, it's OK to replace it
  --verbose                   Be explicit about what's going on
  -h --help                   Show this screen
  --version                   Show version
`;

export class LhcFormJsonTyper extends govnData.TypicalJsonTyper {
  constructor({ "--lform-schema-ts": typeImportURL }: gdctl.docopt.DocOptions) {
    super(govnData.defaultTypicalJsonTyperOptions(
      (typeImportURL ? typeImportURL.toString() : undefined) ||
        "https://denopkg.com/shah/ts-lhncbc-lforms/lform.ts",
      "mod.NihLhcForm",
      { instanceName: "form", emittedFileExtn: ".lhc-form.auto.ts" },
    ));
  }
}

// all CLI handlers are required to be async
// deno-lint-ignore require-await
export async function lhcFormJsonTyperCliHandler(
  ctx: govnData.CliCmdHandlerContext,
): Promise<true | void> {
  const {
    "lform": json,
    "type": type,
    "<lform-json-src>": lformJsonSpec,
    "--validate": validate,
  } = ctx.cliOptions;
  if (json && type && lformJsonSpec) {
    const ctl = new govnData.TypicalController(
      ctx.calledFromMetaURL,
      {
        ...ctx.tco,
        defaultJsonExtn: ".lhc-form.auto.json",
        onAfterEmit: (result: govnData.StructuredDataTyperResult): void => {
          if (validate && govnData.isFileDestinationResult(result)) {
            const destRel = "." + path.SEP + result.destFileNameRel(Deno.cwd());
            console.log(
              `Using Deno dynamic import("${destRel}") to validate...`,
            );
            import(destRel);
          }
        },
      },
    );
    ctl.jsonType({
      jsonSrcSpec: lformJsonSpec?.toString() || "*.json",
      typer: new LhcFormJsonTyper(ctx.cliOptions),
      verbose: ctx.isVerbose || ctx.isDryRun,
      overwrite: ctx.shouldOverwrite,
    });
    return true;
  }
}

if (import.meta.main) {
  gdctl.CLI<govnData.CliCmdHandlerContext>(
    docoptSpec,
    [lhcFormJsonTyperCliHandler],
    (options: gdctl.docopt.DocOptions): govnData.CliCmdHandlerContext => {
      return new govnData.CliCmdHandlerContext(
        import.meta.url,
        options,
        govnData.defaultTypicalControllerOptions({ cli: "NO DATA INSTANCE" }),
      );
    },
  );
}
