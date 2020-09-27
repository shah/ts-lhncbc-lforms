import { govnData as gd, inflect, path } from "./deps.ts";

// deno-lint-ignore no-empty-interface
export interface LhcFormContainerOptions {
}

export abstract class LhcFormContainer implements gd.StructuredDataTyper {
  constructor(readonly options?: LhcFormContainerOptions) {
  }

  destFileName(fc: gd.FileContext): string {
    return fc.forceExtension(".ts");
  }

  className(fileNameIV: inflect.InflectableValue, fc: gd.FileContext): string {
    return inflect.toPascalCase(fileNameIV);
  }

  isTypeable(
    ctx: gd.StructuredDataTyperContext,
  ): gd.StructuredDataTyperContext | false {
    if (gd.isJsonSupplierEntryContext(ctx.udseCtx)) {
      const result: gd.JsonTyperContext = {
        ...ctx,
        isJsonTyperContext: true,
        jseCtx: ctx.udseCtx,
      };
      return result;
    }
    return false;
  }

  protected typerResult(
    ctx: gd.StructuredDataTyperContext,
    textResult: string,
    destFileName?: string,
  ): gd.JsonTyperTextResult {
    const result: gd.JsonTyperTextResult = {
      isStructuredDataTyperResult: true,
      isJsonTyperTextResult: true,
      udseCtx: ctx.udseCtx,
      text: textResult,
    };
    if (destFileName) {
      const enhanced: gd.JsonTyperTextResult & gd.FileDestinationResult = {
        ...result,
        destFileName: destFileName,
        destFileNameRel: (relTo: string): string => {
          return path.relative(relTo, destFileName);
        },
      };
      return enhanced;
    }
    return result;
  }

  protected abstract typerContent(
    ctx: gd.JsonTyperContext,
    fc: gd.FileContext,
  ): string;

  typeData(
    ctx: gd.StructuredDataTyperContext,
  ): gd.JsonTyperTextResult {
    let textResult, destFileName: string | undefined;
    if (gd.isJsonTyperContext(ctx)) {
      if (gd.isFileContext(ctx.udseCtx)) {
        destFileName = this.destFileName(ctx.udseCtx);
        textResult = this.typerContent(ctx, ctx.udseCtx);
      } else {
        textResult =
          `ctx.jseCtx is expected to be a FileContext instance: ${ctx.jseCtx}`;
      }
    } else {
      textResult = `ctx is expected to be a JsonTyperContext instance: ${ctx}`;
    }
    return this.typerResult(ctx, textResult, destFileName);
  }
}
