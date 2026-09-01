/**
 * What is actually downloadable today.
 *
 * The store listings and desktop installers do not exist yet, and linking to
 * them anyway produced four 404s from the hero's Download menu and the
 * /get-app page. Availability lives here, in one place, so the UI can offer
 * a real "not yet" instead of a dead link — and so shipping a platform is a
 * one-line change rather than a hunt through components.
 *
 * To release a platform: set `available: true`. For the desktop builds that
 * also means publishing a GitHub release whose asset is named exactly
 * `Vendly-Setup.exe` / `Vendly.dmg`, since the `latest/download` permalink
 * resolves by filename. For iOS, replace the placeholder id in `url` with the
 * numeric App Store id Apple assigns on approval.
 */
export type Platform = 'windows' | 'mac' | 'android' | 'ios';

export type Release = {
  /** Flip to true only once the target below genuinely resolves. */
  available: boolean;
  url: string;
};

export const releases: Record<Platform, Release> = {
  windows: {
    available: false,
    url: 'https://github.com/DananjayaNadun/vendlylk/releases/latest/download/Vendly-Setup.exe',
  },
  mac: {
    available: false,
    url: 'https://github.com/DananjayaNadun/vendlylk/releases/latest/download/Vendly.dmg',
  },
  android: {
    available: false,
    url: 'https://play.google.com/store/apps/details?id=lk.vendly.app',
  },
  ios: {
    /* The id below is a placeholder — Apple issues the real one at approval. */
    available: false,
    url: 'https://apps.apple.com/lk/app/vendly-lk/id0000000000',
  },
};

/** True when at least one mobile store listing is live. */
export const anyMobileAvailable = releases.android.available || releases.ios.available;
