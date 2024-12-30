import { ChatOpenAI } from '@langchain/openai';
import 'dotenv/config';

export const model = new ChatOpenAI({
  apiKey:
    process.env.OPENAI_API_KEY ??
    (() => {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    })(),
  modelName: 'gpt-4o-mini',
  temperature: 0,
});
