import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Operator() {
  const router = useRouter();
  const { operator } = router.query;

  return (
    <div className="fixed w-screen">
      <main className="flex flex-col justify-center items-center h-screen max-h-full overflow-hidden relative -mt-24">
        <div>
          <p className="text-sm md:text-2xl p-4 text-center">
            Pick a number to multiply by:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-8">
            {[...Array(10).keys()].map((num) => (
              <Link
                href={`/${operator}/${num + 1}`}
                className={`border rounded text-md md:text-5xl p-4 text-center`}
                key={num}>
                {num + 1}
              </Link>
            ))}
          </div>
        </div>
        <div className="text-center mt-12">
          <Link href="/">Back To Menu</Link>
        </div>
      </main>
    </div>
  );
}
