# LHC Forms Goverance

This library provides functionality to help validate and edit LHC Form JSON files.

The following commands are available:

```bash
❯ deno-run lformctl.ts --help
Governend LHC Form Data Controller (GLForm) v1.3.0.

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
  --overwrite                 If the destination file already exists, replace it
  --verbose                   Inform what actions are taking place
  -h --help                   Show this screen
  --version                   Show version
```

# Structural Validation Example

Normal usage will be to have JSON files available in a directory and just run from URL:

```bash
❯ deno-run "https://denopkg.com/shah/ts-lhncbc-lforms/lformctl.ts" json type "**/*.json" --verbose
```

As shown above, you can use either a specific version or leave out the version number to use the latest version.

There is a sample LHC Form JSON file `test1-with-error.lhc-form.json` which has forced error. If you run the validator, it should give you a proper error message:

```bash
❯ deno-run lformctl.ts lform type "*.json" --validate --overwrite --verbose
TS2322 [ERROR]: Type 'string' is not assignable to type 'number'.
        min: 'bad data',
        ~~~
    at /test1-with-error.lhc-form.auto.ts:12:9
```

# Convert LHC Form JSON to Governed Structured Data (GSD) TypeScript

Normal usage will be to have JSON files available in a directory and just run from URL:

```bash
❯ deno-run "https://denopkg.com/shah/ts-lhncbc-lforms/lformctl.ts" lform type "**/*.json" --verbose
❯ deno-run "https://denopkg.com/shah/ts-lhncbc-lforms@v1.3.0/lformctl.ts" lform type "**/*.json" --verbose
```

As shown above, you can use either a specific version or leave out the version number to use the latest version.

You can take one or more LHC Form JSON files like `test1-with-error.lhc-form.json` and generate editable TypeScript files from them. If destination files already exist, they will not be overwritten unless explictly told to. For example:

```bash
❯ deno-run lformctl.ts lform type "*.json" --verbose
[GSDC-01-000] test1-with-error.lhc-form.auto.ts exists, overwrite not requested, not replacing
[GSDC-01-000] test2-github-issue2.lhc-form.auto.ts exists, overwrite not requested, not replacing
[GSDC-01-000] test3-update-interface-NihLhcForm.lhc-form.auto.ts exists, overwrite not requested, not replacing

❯ deno-run lformctl.ts lform type "*.json" --verbose --overwrite
Overwriting: test1-with-error.lhc-form.auto.ts
./test1-with-error.lhc-form.auto.ts
Overwriting: test2-github-issue2.lhc-form.auto.ts
./test2-github-issue2.lhc-form.auto.ts
Overwriting: test3-update-interface-NihLhcForm.lhc-form.auto.ts
./test3-update-interface-NihLhcForm.lhc-form.auto.ts

❯ deno fmt test1-with-error.lhc-form.auto.ts
```

# Content Validation of fields in LHC Forms

In addition to structurally validating a form, some of the content of an LHC may also be validated using TypeScript-based strong typing. To understand how to perform stronger typing, review the [item.ts](item.ts) module. `item.ts` contains typed FormItem interfaces that can be used by `NihLhcForm` (see [lform.ts](lform.ts)) instances.

For example, see the following `FormItem` specialized interfaces. These interfaces are pretty simple but they can be combined with other types or extended to include any valid LHC Form properties and definitions. The nice thing about defining them in TypeScript is that, combined with GSD, the `tsc` compiler can validate an LHC Form JSON with no extra coding.

```typescript
export interface UniqueItem {
  readonly questionCardinality: { min: 1; max: 1 };
}

export interface TextItem extends FormItem {
  readonly dataType: "ST";
}

export interface EmailAddressItem extends FormItem {
  readonly dataType: "EMAIL" | "ST";
}

export interface StrictEmailAddressItem extends EmailAddressItem {
  readonly dataType: "EMAIL";
}
```

The above can then be mixed algebraically to create even further specialized interfaces:

```typescript
export type UniqueTextItem = TextItem & UniqueItem;
export type UniqueEmailAddressItem = EmailAddressItem & UniqueItem;
export type UniqueStrictEmailAddressItem = StrictEmailAddressItem & UniqueItem;

```

Then, they can be used in a type-safe Form. In the example below, the `RespondentContactInformation` type is a section defined to require specifically typed items and then it's used in the `OfferingProfileLhcForm` with other sections. For the full example, see [medigy/governance/offering-profile/lform.ts](https://github.com/medigy/governance/blob/master/offering-profile/lform.ts).

```typescript
export interface RespondentCompanyName extends lf.UniqueTextItem {
  readonly questionCode: "company-name";
  readonly localQuestionCode: "company-name";
  readonly question: "Name of the company providing this offering*";
}

export interface RespondentEmailAddress extends lf.UniqueEmailAddressItem {
  readonly questionCode: "Q002-05";
  readonly localQuestionCode: "Q002-05";
  readonly question: "Email address of the company*";
}

export interface RespondentContactInformation extends lf.FormItem {
  readonly header: true;
  readonly question: "Respondent Contact Information";
  readonly items: [
    RespondentCompanyName,
    RespondentEmailAddress,
    RespondentContactPhoneNumber,
    RespondentVendorName,
    RespondentVendorEmailAddress,
    RespondentVendorPhoneNumber,
    RespondentSource,
  ];
}

...

export interface OfferingProfileLhcForm extends lf.NihLhcForm {
  readonly items: [
    RespondentContactInformation,
    ProductDetails,
    SocialPresence,
  ];
}
```

# Contributing

If you need to make any changes to this repo, please do the following:

* Update the file
* Run `deno run -A --unstable lformctl.ts lform type *.json` 
* If everything works, do a Git commit and then `projectctl publish` to bump the version