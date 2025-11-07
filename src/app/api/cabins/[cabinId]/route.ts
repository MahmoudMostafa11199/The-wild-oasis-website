import { getBookedDatesByCabinId, getCabin } from '@/_lib/data-service';

type ParamsType = {
  params: { cabinId: string };
};

export const GET = async (request: Request, { params }: ParamsType) => {
  const { cabinId } = params;

  try {
    const [cabin, bockedDates] = await Promise.all([
      getCabin(cabinId),
      getBookedDatesByCabinId(cabinId),
    ]);

    return Response.json({ cabin, bockedDates });

    //
  } catch {
    return Response.json({ message: 'Cabin not found' });
  }
};
