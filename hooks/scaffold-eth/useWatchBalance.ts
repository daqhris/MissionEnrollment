import { useEffect } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import { useQueryClient } from "@tanstack/react-query";
import { useBalance, useBlockNumber } from "wagmi";
import type { Address } from "viem";

/**
 * Wrapper around wagmi's useBalance hook. Updates data on every block change.
 */
export const useWatchBalance = (address?: Address) => {
  const { targetNetwork } = useTargetNetwork();
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true, chainId: targetNetwork.id });
  const balanceResult = useBalance({
    address,
    chainId: targetNetwork.id,
  });

  useEffect(() => {
    // Invalidate the balance query when the block number changes
    queryClient.invalidateQueries({ queryKey: ["balance", { address, chainId: targetNetwork.id }] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, address, targetNetwork.id]);

  return balanceResult;
};
