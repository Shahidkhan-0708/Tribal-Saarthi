import { useState, type FormEvent, type ChangeEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useSession } from '@/store/session';
import { useData, broadcastRecipients } from '@/store/data';
import { Card, SectionTitle, Badge, Button, SimulatedBadge } from '@/components/ui';
import { COVERAGE_SNAPSHOTS } from '@/data/coverage';

export function NotificationsAdmin() {
  const { user } = useSession();
  const data = useData();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetGroup, setTargetGroup] = useState<'all' | 'deficiency' | 'district'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState(COVERAGE_SNAPSHOTS[0].district);
  const [sentSuccess, setSentSuccess] = useState<string | null>(null);

  const recipients = broadcastRecipients(data.students, data.applications, targetGroup, selectedDistrict);

  const handleBroadcast = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const count = data.broadcast(user?.name ?? 'Officer', title, body, targetGroup, selectedDistrict);
    setSentSuccess(`Created ${count} in-app notices. SMS and IVR are not sent in this demo.`);

    setTitle('');
    setBody('');
    setTimeout(() => setSentSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionTitle
          title="Demo In-App Broadcasts"
          subtitle="Targeted communications, deadline reminders, and camp alerts for tribal students."
        />
        <SimulatedBadge label="SMS / IVR · not connected" />
      </div>

      {sentSuccess && (
        <div className="flex items-center gap-2.5 rounded-lg border-l-4 border-l-emerald-600 border border-emerald-200 bg-emerald-50/90 p-4 text-sm font-medium text-emerald-950 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{sentSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Broadcast Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="mb-4 text-base font-bold text-stone-900 dark:text-stone-100">
              Compose Targeted Announcement
            </h3>
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Notice Headline / Title
                </label>
                <input
                  aria-label="Notice title"
                  type="text"
                  value={title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  placeholder="e.g. Document Correction Camp in Mandla District (12-14 Oct)"
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Target Audience Segment
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setTargetGroup('all')}
                    className={`rounded-lg border p-2.5 text-left text-xs transition-colors ${
                      targetGroup === 'all'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-600/30 dark:border-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-300'
                        : 'border-stone-200 hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800/40'
                    }`}
                  >
                    <div className="font-semibold">All ST Students</div>
                    <div className="text-[10px] text-stone-500">Universal scholarship updates</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetGroup('deficiency')}
                    className={`rounded-lg border p-2.5 text-left text-xs transition-colors ${
                      targetGroup === 'deficiency'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 dark:border-amber-500 dark:bg-amber-950/30 dark:text-amber-300'
                        : 'border-stone-200 hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800/40'
                    }`}
                  >
                    <div className="font-semibold">Pending Deficiencies</div>
                    <div className="text-[10px] text-stone-500">Urgent document fix requests</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetGroup('district')}
                    className={`rounded-lg border p-2.5 text-left text-xs transition-colors ${
                      targetGroup === 'district'
                        ? 'border-teal-700 bg-teal-50 text-teal-950 font-semibold shadow-xs ring-1 ring-teal-600/30 dark:border-teal-500 dark:bg-teal-950/30 dark:text-teal-300'
                        : 'border-stone-200 hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800/40'
                    }`}
                  >
                    <div className="font-semibold">High-Gap District</div>
                    <div className="text-[10px] text-stone-500">Unreached enrollment zones</div>
                  </button>
                </div>
              </div>

              {targetGroup === 'district' && (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Select Target District
                  </label>
                  <select
                    aria-label="Target district"
                    value={selectedDistrict}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedDistrict(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs dark:border-stone-700 dark:bg-stone-800"
                  >
                    {COVERAGE_SNAPSHOTS.map((snap) => {
                      const gap = Math.max(0, snap.stEnrolled - snap.availing);
                      return (
                        <option key={snap.district} value={snap.district}>
                          {snap.district}, {snap.state} ({gap.toLocaleString('en-IN')} unreached students)
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Message Content
                </label>
                <textarea
                  aria-label="Message content"
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Dear Student, you have 7 days to upload your updated ST certificate at the portal or visit the local block resource center to prevent application cancellation..."
                  className="w-full rounded-lg border border-stone-300 bg-white p-3 text-xs leading-relaxed text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                  required
                />
              </div>

              <p className="text-xs text-stone-500">Delivery: in-app only. SMS and IVR previews do not send messages.</p>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-stone-500">
                  Selected audience: <span className="font-bold text-stone-800 dark:text-stone-200">{recipients.length.toLocaleString('en-IN')} students</span>
                </div>
                <Button type="submit" disabled={recipients.length === 0}>
                  Send in-app broadcast
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Live Preview / Gateway Status */}
        <div className="space-y-4">
          <Card className="p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              SMS DLT Preview (Simulated)
            </h4>
            <div className="mt-3 rounded-xl border border-stone-200 bg-stone-50 p-4 font-mono text-[11px] text-stone-800 dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-200">
              <div className="text-stone-400 text-[10px] mb-2">Sender: VM-MOTA-GOV</div>
              <p className="whitespace-pre-wrap">{body || 'Type a message on the left to see an unsent SMS preview...'}</p>
              <div className="mt-3 text-[9px] text-stone-400 border-t border-stone-200 pt-2 dark:border-stone-800">
                DLT Registration ID: 1407168923019 · MoTA Portal
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Gateway Health
            </h4>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-600 dark:text-stone-300">NIC SMS Gateway</span>
                <Badge tone="gray">NOT CONNECTED</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-600 dark:text-stone-300">CDAC M-Seva IVR</span>
                <Badge tone="gray">NOT CONNECTED</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-600 dark:text-stone-300">Local in-app notices</span>
                <Badge tone="blue">LOCAL DEMO</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
