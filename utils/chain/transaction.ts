import { type Chain, type ChainFormatter, type TransactionRequest, type Prettify } from 'viem';
import { safeBigIntToNumber } from './bigint';

type TransactionFields = Prettify<{
  maxFeePerGas?: bigint | number;
  maxPriorityFeePerGas?: bigint | number;
  value?: bigint | number;
  gasLimit?: bigint | number;
  gasPrice?: bigint | number;
  nonce?: bigint | number;
}>;

export function processChainTransaction(chain: Chain): Chain {
  const processTransactionFields = {
    format: (transaction: TransactionFields): TransactionRequest => {
      const processed: TransactionFields = {};

      if (transaction.maxFeePerGas !== undefined) {
        processed.maxFeePerGas = safeBigIntToNumber(transaction.maxFeePerGas);
      }
      if (transaction.maxPriorityFeePerGas !== undefined) {
        processed.maxPriorityFeePerGas = safeBigIntToNumber(transaction.maxPriorityFeePerGas);
      }
      if (transaction.value !== undefined) {
        processed.value = safeBigIntToNumber(transaction.value);
      }
      if (transaction.gasLimit !== undefined) {
        processed.gasLimit = safeBigIntToNumber(transaction.gasLimit);
      }
      if (transaction.gasPrice !== undefined) {
        processed.gasPrice = safeBigIntToNumber(transaction.gasPrice);
      }
      if (transaction.nonce !== undefined) {
        processed.nonce = safeBigIntToNumber(transaction.nonce);
      }

      return processed as TransactionRequest;
    },
    type: 'transactionRequest' as const
  } satisfies ChainFormatter<'transactionRequest'>;

  return {
    ...chain,
    id: safeBigIntToNumber(chain.id),
    formatters: {
      ...chain.formatters,
      transactionRequest: processTransactionFields
    }
  };
}

export function safeChainId(chain: Chain): Chain {
  return processChainTransaction(chain);
}
