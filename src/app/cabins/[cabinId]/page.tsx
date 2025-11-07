import Cabin from '@/_components/Cabin';
import Reservation from '@/_components/Reservation';
import Spinner from '@/_components/Spinner';
import { getCabin, getCabins } from '@/_lib/data-service';
import { Suspense } from 'react';

type ParamProps = {
  params: {
    cabinId: string;
  };
};

export async function generateMetadata({ params }: ParamProps) {
  const { cabinId } = params;

  const { name } = await getCabin(cabinId);

  return { title: `Cabin ${name}` };
}

export async function generateStaticParams() {
  const cabins = await getCabins();

  const ids = cabins.map((c) => ({ cabinId: String(c.id) }));

  return ids;
}

export default async function Page({ params }: ParamProps) {
  const { cabinId } = params;
  const cabin = await getCabin(cabinId);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />

      <div>
        <h2 className="text-5xl font-semibold text-center text-accent-400 mb-8">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>

        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
