import { Metadata } from "next";

/** Title of the app. */
// TODO: Update title.
export const TITLE = "App Title";
/** GitHub repo name (which becomes the base path). */
// TODO: Update base path.
export const BASE_PATH = "app-title";

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
    // TODO: Update description.
    description: "App description",
  };
}
