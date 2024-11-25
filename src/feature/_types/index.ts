/* eslint-disable @typescript-eslint/no-explicit-any */

export type RTCSessionId = string;

export type OriginalServerData<T extends (...args: any) => any> = Awaited<
  ReturnType<T>
>;

export type Selector<OriginalServerData, TSelectedData> = (
  data: OriginalServerData,
) => TSelectedData;

export interface WithSelector<TServerData, TSelectedData> {
  selector?: Selector<TServerData, TSelectedData>;
}
