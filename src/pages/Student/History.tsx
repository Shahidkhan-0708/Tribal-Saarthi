import { Calendar, CheckCircle2 } from 'lucide-react';
import { useData } from '@/store/data';
import { useSession } from '@/store/session';
import { STUDENTS } from '@/data/students';
import { Card, SectionTitle, Badge, StatusBadge, EmptyState } from '@/components/ui';
import { fmtDate, inrPretty, statusTone } from '@/lib/format';

// ============================================================
// Scholarship History: longitudinal record for the student.
// ============================================================

export function History() {
  const data = useData();
  const { user } = useSession();
  const student = data.students.find((s) => s.id === user?.studentId) ?? data.students[0] ?? STUDENTS[0];

  const apps = data.applications
    .filter((a) => a.studentId === student.id)
    .sort((a, b) => b.academicYear.localeCompare(a.academicYear));

  const total = apps.reduce((s, a) => s + (a.disbursedAmount ?? 0), 0);

  return (
    <div className="space-y-6">
      <SectionTitle title="Scholarship History" subtitle="Your complete longitudinal record across every academic year." />

      {apps.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-10 w-10 text-stone-400 stroke-1" />}
          title="No history yet"
          hint="Your applications and payments will appear here."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                  <th scope="col" className="p-3.5">Academic Year</th>
                  <th scope="col" className="p-3.5">Scheme</th>
                  <th scope="col" className="p-3.5">Sanction Grant</th>
                  <th scope="col" className="p-3.5">DBT Payment</th>
                  <th scope="col" className="p-3.5">Disbursal Date</th>
                  <th scope="col" className="p-3.5">PFMS UTR</th>
                  <th scope="col" className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors dark:border-slate-800 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-bold font-mono text-slate-900 dark:text-slate-100">{a.academicYear}</td>
                    <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">{data.schemes.find((s) => s.id === a.schemeId)?.shortName ?? 'Post-Matric ST'}</td>
                    <td className="p-3.5 font-bold font-mono text-emerald-950 dark:text-emerald-300">{inrPretty(a.disbursedAmount ?? a.sanctionedAmount)}</td>
                    <td className="p-3.5">
                      {a.dbtStatus ? (
                        <Badge tone={statusTone(a.dbtStatus)}>
                          {a.dbtStatus === 'successful' ? (
                            <span className="flex items-center gap-1.5 font-semibold">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              DBT to ••••{a.bankAccountLast4}
                            </span>
                          ) : (
                            a.dbtStatus
                          )}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono text-xs">{fmtDate(a.dbtDate)}</td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold">{a.pfmsTransactionId ?? '-'}</td>
                    <td className="p-3.5"><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 bg-slate-50/50 p-4 text-xs font-medium text-slate-700 dark:border-slate-800 dark:text-slate-300 flex items-center justify-between flex-wrap gap-2">
            <span className="font-semibold">
              Total Disbursed: <span className="text-emerald-900 font-bold font-mono text-sm">{inrPretty(total)}</span>
            </span>
            <span className="text-slate-500">
              Direct Benefit Transfer (DBT) · Public Financial Management System (PFMS)
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}
