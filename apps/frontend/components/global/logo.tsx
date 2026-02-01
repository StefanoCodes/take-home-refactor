import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/anvara-logo.png';
interface LogoProps extends React.HTMLAttributes<HTMLAnchorElement> {
  className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <Link href="/" className={cn('text-2xl font-bold', className)} {...props}>
      <Image src={logo} alt="Anvara" width={100} height={100} />
    </Link>
  );
}
