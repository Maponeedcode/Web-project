export const CONSENT_BUCKET = "consent-documents";

export const CONSENT_EXTENSIONS = ["pdf", "jpg"] as const;

export const consentPathFor = (userId: string, ext: (typeof CONSENT_EXTENSIONS)[number]) =>
  `${userId}/consent.${ext}`;

export const isOwnConsentPath = (userId: string, path: string) =>
  CONSENT_EXTENSIONS.some((ext) => path === consentPathFor(userId, ext));
