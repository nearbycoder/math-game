import React from 'react';
import Game from '../../../components/Game';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Num() {
  const router = useRouter();
  const { num, operator } = router.query;

  if (!num || !operator) {
    return null;
  }

  return (
    <div className="fixed w-screen">
      <main className="flex justify-center items-center h-screen max-h-full overflow-hidden relative -mt-24">
        <Game operator={String(operator)} num={Number(num)} />
      </main>
      <div className="text-center">
        <Link href="/">Back To Menu</Link>
      </div>
    </div>
  );
}
