import { auth } from '@/_lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import UserAvatar from './UserAvatar';

async function Navigation() {
  const session = await auth();

  return (
    <nav className="text-xl z-10">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href="/cabins"
            className="hover:text-accent-400 transition-colors"
          >
            Cabins
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-colors"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/account"
            className="flex items-center gap-2 transition-colors hover:text-accent-400"
          >
            {session?.user?.image ? (
              <Image
                width={40}
                height={40}
                src={session.user.image}
                alt={String(session.user.name)}
                className="object-cover rounded-full"
              />
            ) : (
              <UserAvatar name={session?.user?.name} />
            )}
            <span>Guest area</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
