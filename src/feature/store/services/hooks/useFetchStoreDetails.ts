import { useSuspenseQuery } from '@tanstack/react-query';
import { Selector } from '@/feature/_types';
import { storeApiService } from '../api/storeApiService';

const useFetchStoreDetails = <TReturnData>({
  storeId,
  selector,
}: {
  storeId: number;
  selector: Selector<
    Awaited<ReturnType<typeof storeApiService.fetchStoreDetails>>,
    TReturnData
  >;
}) => {
  return useSuspenseQuery({
    queryKey: ['store', storeId],
    queryFn: () => storeApiService.fetchStoreDetails(String(storeId)),
    select: selector,
  });
};

export default useFetchStoreDetails;
