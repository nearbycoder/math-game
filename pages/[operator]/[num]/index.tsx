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
      <main className="flex flex-col justify-center items-center h-screen max-h-full overflow-hidden relative -mt-24">
        <Game operator={String(operator)} num={Number(num)} />
        <div className="text-center mt-12">
          <Link href="/">Back To Menu</Link>
        </div>
      </main>
    </div>
  );
}
