import { BaseMessage } from '@langchain/core/messages';
import { Annotation } from '@langchain/langgraph';
import { messagesStateReducer } from '@langchain/langgraph';

export const fuelAgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),

  isTransferOrSwap: Annotation<boolean>({
    reducer: (x, y) => y ?? x ?? false,
    default: () => false,
  }),

  isBorrowOrSupply: Annotation<boolean>({
    reducer: (x, y) => y ?? x ?? false,
    default: () => false,
  }),

  isAddLiquidity: Annotation<boolean>({
    reducer: (x, y) => y ?? x ?? false,
    default: () => false,
  }),
});
