import Link from 'next/link';
import logo from '@/public/logo.png';
import Image from 'next/image';

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4 z-10">
      <Image
        src={logo}
        placeholder="blur"
        width="60"
        height="60"
        alt="the wild oasis logo"
      />
      <span className="text-xl font-semibold text-primary-100">
        The Wild Oasis
      </span>
    </Link>
  );
}

export default Logo;
