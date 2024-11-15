export type RTCSessionId = string;

export type Selector<OriginalServerData, TSelectedData> = (
  data: OriginalServerData,
) => TSelectedData[];

export type OriginalServerData<T extends (...args: any) => any> = Awaited<
  ReturnType<T>
>;
