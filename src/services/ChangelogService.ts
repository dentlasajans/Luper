import { ChangelogEntry } from '../types';
import { CHANGELOG_HISTORY } from '../data/changelogs';

export const getLatestChangelogEntry = (): ChangelogEntry | undefined => {
  if (CHANGELOG_HISTORY.length === 0) return undefined;
  return CHANGELOG_HISTORY[CHANGELOG_HISTORY.length - 1];
};
