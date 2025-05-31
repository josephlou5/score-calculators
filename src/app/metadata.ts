import { Metadata } from "next";

/** Title of the app. */
export const TITLE = "Score Calculators";
/** GitHub repo name (which becomes the base path). */
export const BASE_PATH = "score-calculators";

export const GITHUB_LINK = `https://github.com/josephlou5/${BASE_PATH}`;

/** Creates Metadata for a page. */
export function metadataForPage(pageTitle: string = ""): Metadata {
  let title = TITLE;
  if (pageTitle) {
    title += ` - ${pageTitle}`;
  }
  return {
    title,
    applicationName: TITLE,
    description: "A static webpage to calculate scores for some board games.",
  };
}
