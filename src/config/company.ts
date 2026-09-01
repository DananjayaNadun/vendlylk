/**
 * Facts about the business that only its owner can confirm.
 *
 * Everything here appears verbatim on public pages — contact routes, support
 * hours, the legal and data-protection pages. None of it can be checked
 * against an outside source the way a place name or a currency code can, so
 * it lives in one file, flagged, rather than scattered through page copy
 * where an unconfirmed detail reads as established fact.
 *
 * `CONFIRMED` marks whether a value has been verified by the business.
 * While it is false the UI degrades honestly — a channel with no confirmed
 * address is not offered, and the legal pages carry a draft notice — instead
 * of publishing a support address that bounces or a retention promise nobody
 * has agreed to.
 *
 * Before launch: check each value, then set its `confirmed` to true.
 */

export type Fact<T> = { value: T; confirmed: boolean };

const fact = <T,>(value: T, confirmed = false): Fact<T> => ({ value, confirmed });

export const company = {
  legalName: fact('Vendly', true),
  /** The domain this site ships on. */
  domain: fact('vendly.lk', true),

  /* --- Contact ------------------------------------------------------- */
  /** Set confirmed once the mailbox exists and is monitored. */
  supportEmail: fact('support@vendly.lk'),
  /** E.164, e.g. '+94771234567'. Empty until a real line is in service. */
  whatsapp: fact(''),
  /** Street address, or a city when no public office is listed. */
  officeLocation: fact('Colombo, Sri Lanka'),

  /* --- Support ------------------------------------------------------- */
  /** Sri Lanka observes UTC+05:30 year-round (IANA Asia/Colombo). */
  supportHours: fact('Mon–Sat, 9am–7pm (UTC+5:30)'),
  /** Sinhala and Tamil are Sri Lanka's official languages; English is the
      constitutional link language. Whether support is staffed in all three
      is a business fact, not a linguistic one. */
  supportLanguages: fact(['Sinhala', 'Tamil', 'English']),
  /** Target first-reply time. Stated publicly, so it is a commitment. */
  responseTarget: fact('one business day'),

  /* --- Legal commitments --------------------------------------------- */
  /** Days a cancelled account stays exportable before deletion. */
  exportWindowDays: fact(30),
  /** Where production data physically lives. */
  dataRegion: fact(''),
  /** Whether encryption in transit and at rest is actually implemented. */
  encryptionInPlace: fact(false),

  /* --- Hiring --------------------------------------------------------- */
  /** Real, currently-open roles only. An empty list renders an honest
      "nothing open right now" rather than inventing vacancies people would
      waste time applying to. */
  openRoles: fact<{ title: string; type: string; body: string }[]>([], true),
} as const;

/**
 * Whether account creation and sign-in actually work end to end.
 *
 * The auth screens currently submit to nothing (`onSubmit` is a no-op and the
 * social buttons have no handler). While this is false they say so, rather
 * than accepting a password and a business name and silently discarding both
 * — which reads to a visitor as a completed signup.
 */
export const accountsLive = false;

/** True when every value the legal pages depend on has been confirmed. */
export const legalPagesReviewed =
  company.exportWindowDays.confirmed && company.dataRegion.confirmed && company.encryptionInPlace.confirmed;
