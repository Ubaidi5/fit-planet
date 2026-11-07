import type { AdminLogDoc } from "@/server/db/models";
import { Panel } from "./bits";
import { actionLabels } from "./labels";

const time = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

/** The audit trail for one record */
export function History({ entries }: { entries: (AdminLogDoc & { adminName: string })[] }) {
  return (
    <Panel>
      <h2 className="text-lg font-semibold text-ink">Admin history</h2>
      {entries.length ? (
        <ul className="mt-4 divide-y divide-gray-900/[0.06]">
          {entries.map((e) => (
            <li key={e._id.toHexString()} className="flex flex-col gap-0.5 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-ink">
                <span className="font-semibold">{e.adminName}</span> {actionLabels[e.action] ?? e.action}
                {e.note && <span className="text-gray-500"> · {e.note}</span>}
              </span>
              <span className="shrink-0 text-xs text-gray-500">{time.format(e.at)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-gray-500">No admin has touched this yet.</p>
      )}
    </Panel>
  );
}
