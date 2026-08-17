import { useEffect, useState } from 'react';
import { Icon } from './Icon';

const ASSIGNMENTS_FILE = 'assignments.json';

interface ProjectAssignment {
  hire: string;
  project: string;
}

function parseAssignments(raw: string): ProjectAssignment[] {
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

/**
 * Personal hire → project assignments. Loaded from
 * `<harnessHome>/assignments.json` (never hardcoded in source).
 */
export function ProjectNoticeboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [assignments, setAssignments] = useState<ProjectAssignment[]>([]);
  const [harnessHome, setHarnessHome] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
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
      }
    };

    void load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: '1px solid var(--cth-ink-300)',
      boxShadow: 'inset 0 0 0 1px var(--cth-paper-100)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid var(--cth-ink-300)',
        backgroundColor: 'var(--cth-cream-100)',
        cursor: 'pointer',
        userSelect: 'none',
        flexShrink: 0
      }}
      onClick={() => setCollapsed(!collapsed)}
      >
        <div style={{
          fontFamily: 'var(--cth-font-display)',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--cth-ink-900)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          ASSIGNMENTS
        </div>
        <Icon
          name={collapsed ? 'arrow-right' : 'code'}
          size={0.8}
          style={{
            width: 14,
            height: 14,
            color: 'var(--cth-ink-500)',
            transition: 'transform 200ms ease'
          }}
        />
      </div>

      {!collapsed && (
        <div style={{
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          backgroundColor: 'var(--cth-paper-200)'
        }}>
          {assignments.length === 0 ? (
            <div style={{
              fontFamily: 'var(--cth-font-ui)',
              fontSize: 12,
              lineHeight: 1.5,
              color: 'var(--cth-ink-600)'
            }}>
              {loadError ?? 'No assignments yet.'}
              {harnessHome && (
                <>
                  {' '}File: <code style={{ fontSize: 11 }}>{harnessHome}/{ASSIGNMENTS_FILE}</code>
                  {' '}— array of <code style={{ fontSize: 11 }}>{'{"hire","project"}'}</code> objects.
                </>
              )}
            </div>
          ) : assignments.map((assignment, idx) => (
            <div
              key={`${assignment.hire}-${assignment.project}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: 12,
                marginBottom: 12,
                borderBottom: idx < assignments.length - 1 ? '1px solid var(--cth-ink-200)' : 'none',
                gap: 8
              }}
            >
              <div style={{
                fontFamily: 'var(--cth-font-display)',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--cth-ink-900)',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}>
                {assignment.hire}
              </div>
              <div style={{
                fontFamily: 'var(--cth-font-ui)',
                fontSize: 12,
                color: 'var(--cth-ink-700)',
                wordBreak: 'break-word',
                textAlign: 'right',
                flex: 1,
                minWidth: 0
              }}>
                {assignment.project}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
