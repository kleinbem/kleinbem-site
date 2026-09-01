interface ImportMetaEnv {
  /** Origin of the kleinbem-auth service. Defaults to https://login.kleinbem.dev. */
  readonly PUBLIC_AUTH_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
