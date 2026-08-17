import { useState } from 'react';
import { PixelPanel } from './PixelPanel';
import { PixelButton } from './PixelButton';
import { ASSIGNMENTS_FILE, useProjectAssignments } from '@/hooks/useProjectAssignments';

export interface AssignmentsPanelProps {
  /** When true, skip absolute positioning — parent lays out the pill row. */
  docked?: boolean;
}

/**
 * Personal hire → project board. Mirrors MemoryPanel: a floor pill that opens
 * a dialog. Data lives in `<harnessHome>/assignments.json`.
 */
export function AssignmentsPanel({ docked = false }: AssignmentsPanelProps) {
  const [open, setOpen] = useState(false);
  const { assignments, harnessHome, loadError, loading } = useProjectAssignments(open);

  const pill = assignments.length > 0
    ? `📋 assignments · ${assignments.length}`
    : '📋 assignments';

  return (
    <div style={{
      position: docked ? 'relative' : 'absolute',
      bottom: docked ? undefined : 12,
      left: docked ? undefined : 12,
      width: open ? 380 : 'auto',
      zIndex: docked ? undefined : 40
    }}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          title="View hire → project assignments (from your harness home)"
          style={{
            padding: '5px 10px 3px',
            background: assignments.length > 0 ? 'var(--cth-sky-light)' : 'var(--cth-cream-200)',
            boxShadow: 'inset 0 0 0 1.5px var(--cth-ink-500)',
            fontFamily: 'var(--cth-font-ui)',
            fontSize: 12,
            color: 'var(--cth-ink-900)',
            cursor: 'pointer',
            border: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          {pill}
        </button>
      ) : (
        <PixelPanel variant="dialog" title="ASSIGNMENTS" noPadding>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 14, maxHeight: '62vh' }}>
            <div style={{ fontSize: 12, color: 'var(--cth-ink-700)', lineHeight: 1.5 }}>
              Who owns which project — loaded from your harness home, never from source code.
            </div>

            <div style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 0
            }}>
              {loading ? (
                <div style={{ fontSize: 12, color: 'var(--cth-ink-500)' }}>Loading…</div>
              ) : assignments.length === 0 ? (
                <div style={{
                  fontFamily: 'var(--cth-font-ui)',
                  fontSize: 12,
                  lineHeight: 1.5,
                  color: 'var(--cth-ink-600)'
                }}>
                  {loadError ?? 'No assignments yet.'}
                  {harnessHome && (
                    <>
                      {' '}File:{' '}
                      <code style={{ fontSize: 11 }}>{harnessHome}/{ASSIGNMENTS_FILE}</code>
                      {' '}— array of{' '}
                      <code style={{ fontSize: 11 }}>{'{"hire","project"}'}</code> objects.
                    </>
                  )}
                </div>
              ) : assignments.map((assignment, idx) => (
                <div
                  key={`${assignment.hire}-${assignment.project}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBottom: 10,
                    marginBottom: 10,
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--cth-ink-300)', paddingTop: 10 }}>
              <PixelButton variant="ghost" size="sm" onClick={() => setOpen(false)}>Close</PixelButton>
            </div>
          </div>
        </PixelPanel>
      )}
    </div>
  );
}
