import Link from "next/link";
import type { PersonView } from "@/lib/types";
import { Avatar } from "./Avatar";
import { FollowButton } from "./FollowButton";

export function PersonRow({ person }: { person: PersonView }) {
  return (
    <li className="flex items-center gap-3 py-3">
      <Link href={`/app/u/${person.handle}`} className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar name={person.name} image={person.image} initials={person.initials} />
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-semibold text-ink">{person.name}</span>
          <span className="block truncate text-xs text-gray-500">{person.bio || `@${person.handle}`}</span>
        </span>
      </Link>
      {!person.isSelf && <FollowButton userId={person.id} following={person.following} size="sm" />}
    </li>
  );
}
