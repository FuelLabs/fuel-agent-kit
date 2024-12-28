import { addLiquidity, type AddLiquidityParams } from "./mira/addLiquidity.js";
import { swapExactInput, type SwapExactInputParams } from "./mira/swap.js";
import { borrowAsset, type BorrowAssetParams } from "./swaylend/borrow.js";
import {
	supplyCollateral,
	type SupplyCollateralParams,
} from "./swaylend/supply.js";
import {
	transfer as walletTransfer,
	type TransferParams,
} from "./transfers/transfers.js";
import { createAgent } from "./agent.js";
import type { AgentExecutor } from "langchain/agents";
import { getOwnBalance, type GetOwnBalanceParams } from "./read/balance.js";
import type { modelMapping } from "./utils/models.js";

interface FuelAgentConfig {
	walletPrivateKey: string;
	modelName: keyof typeof modelMapping;
	openAiApiKey?: string;
	anthropicApiKey?: string;
	googleGeminiApiKey?: string;
}

export class FuelAgent {
	private walletPrivateKey: string;
	private agentExecutor: AgentExecutor;
	private modelName: keyof typeof modelMapping;
	private openAiApiKey?: string;
	private anthropicApiKey?: string;
	private googleGeminiApiKey?: string;

	constructor(config: FuelAgentConfig) {
		this.walletPrivateKey = config.walletPrivateKey;
		this.modelName = config.modelName;
		this.openAiApiKey = config.openAiApiKey;
		this.anthropicApiKey = config.anthropicApiKey;
		this.googleGeminiApiKey = config.googleGeminiApiKey;

		if (!this.walletPrivateKey) {
			throw new Error("Fuel wallet private key is required.");
		}

		this.agentExecutor = createAgent(
			this,
			this.modelName,
			this.openAiApiKey,
			this.anthropicApiKey,
			this.googleGeminiApiKey,
		);
	}

	getCredentials() {
		return {
			walletPrivateKey: this.walletPrivateKey,
			openAiApiKey: this.openAiApiKey || "",
			anthropicApiKey: this.anthropicApiKey || "",
			googleGeminiApiKey: this.googleGeminiApiKey || "",
		};
	}

	async execute(input: string) {
		const response = await this.agentExecutor.invoke({
			input,
		});

		return response;
	}

	async swapExactInput(params: SwapExactInputParams) {
		return await swapExactInput(params, this.walletPrivateKey);
	}

	async transfer(params: TransferParams) {
		return await walletTransfer(params, this.walletPrivateKey);
	}

	async supplyCollateral(params: SupplyCollateralParams) {
		return await supplyCollateral(params, this.walletPrivateKey);
	}

	async borrowAsset(params: BorrowAssetParams) {
		return await borrowAsset(params, this.walletPrivateKey);
	}

	async addLiquidity(params: AddLiquidityParams) {
		return await addLiquidity(params, this.walletPrivateKey);
	}

	async getOwnBalance(params: GetOwnBalanceParams) {
		return await getOwnBalance(params, this.walletPrivateKey);
	}
}
