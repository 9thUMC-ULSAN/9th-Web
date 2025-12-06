import { useQuery } from "@tanstack/react-query";
import { type PaginationDto } from "../../types/common.ts";
import { getLpList } from "../../apis/lp.ts";
import { QUERY_KEY } from "../../constants/key.ts";
import type { ResponseLpListDto } from "../../types/lp.ts";

function useGetLpList({ cursor, search, order, limit }: PaginationDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, search, order],

    queryFn: () =>
      getLpList({
        cursor,
        search,
        order,
        limit,
      }),
    // 데이터가 신선하다고(fresh) 간주하는 시간.
    // 이 시간 동안 캐시된 데이터를 그대로 사용. 컴포넌트 마운트나 창 포커스 시에도 재요청 X.
    // 5분 동안 기존 데이터 활용, 네트워크 요청 감소.
    staleTime: 1000 * 60 * 5, // 5분

    // 사용되지 않는(비활성 상태) 쿼리 데이터가 캐시에 남아있는 시간.
    // staleTime 경과 후 데이터가 신선하지 않아도(stale), 일정 시간 메모리에 보관.
    // 이후 해당 쿼리 미사용 시 gcTime이 지난 후 제거 (garbage collection).
    // 예) 10분간 미사용 시 캐시 데이터 삭제, 재요청 시 새 데이터 수신.
    gcTime: 100 * 60 * 10, // 10분
    //enabled: Boolean(search),
    //refetchInterval: 100*60,
    // retry : 쿼리 요청이 실패했을 때 자동으로 재시도할 횟수를 지정
    // 기본 값은 3회 정도, 네트워크 오류 등 일시적인 문제를 보완 가능
    //retry: 3, 

    // initialData: 쿼리 실행 전 미리 제공할 초기 데이터를 설정
    // 컴포넌트가 렌더링 될 때 빈 데이터 구조를 미리 제공해서, 로딩 전에도 안전하게 UI를 구성할 수 있게 해줌
    //initialData: initialLpListData

    // 파라미터가 변경될 때 이전 데이터를 유지하여 UI 깜빡임 (Flicking)을 줄여줌
    // ex ) 페이지네이션 시 페이지 전환 사이에 이전 데이터를 보여주어 사용자 경험을 향상시킴
    // keepPreviousData: true, // This keeps the previous data while fetching new data

    select: (data : ResponseLpListDto) => data.data,
  });
}

export default useGetLpList;