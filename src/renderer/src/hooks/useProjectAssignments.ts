import { useEffect, useState } from 'react';

export const ASSIGNMENTS_FILE = 'assignments.json';

export interface ProjectAssignment {
  hire: string;
  project: string;
}

export function parseAssignments(raw: string): ProjectAssignment[] {
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) return [];
  return parsed.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return [];
    const hire = (entry as { hire?: unknown }).hire;
    const project = (entry as { project?: unknown }).project;
    if (typeof hire !== 'string' || typeof project !== 'string') return [];
    const trimmedHire = hire.trim();
    const trimmedProject = project.trim();
    if (!trimmedHire || !trimmedProject) return [];
    return [{ hire: trimmedHire, project: trimmedProject }];
  });
}

/** Personal hire → project map from `<harnessHome>/assignments.json`. */
export function useProjectAssignments(enabled = true) {
  const [assignments, setAssignments] = useState<ProjectAssignment[]>([]);
  const [harnessHome, setHarnessHome] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const config = await window.cth.getConfig();
        const home = config.harnessHome;
        if (cancelled) return;
        setHarnessHome(home);
        if (!home) {
          setAssignments([]);
          setLoadError('No harness home configured yet.');
          return;
        }

        const result = await window.cth.readFile(home, ASSIGNMENTS_FILE);
        if (cancelled) return;

        if (!result.ok) {
          setAssignments([]);
          setLoadError(`Create ${ASSIGNMENTS_FILE} in your harness home to populate this board.`);
          return;
        }

        setAssignments(parseAssignments(result.content ?? '[]'));
        setLoadError(null);
      } catch (err) {
        if (cancelled) return;
        setAssignments([]);
        setLoadError(err instanceof Error ? err.message : 'Could not load assignments.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, [enabled]);

  return { assignments, harnessHome, loadError, loading };
}
