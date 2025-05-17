import { injectable } from "inversify";
import { config } from "dotenv";

@injectable()
class envConfig {
	public readonly ENV: string;
	public readonly CONNECTION_STRING: string;
	public readonly DATABASE_NAME: string;
	public readonly PORT: string;
	public readonly SMTP_HOST: string;
	public readonly SMTP_PORT: number;
	public readonly SMTP_USER: string;
	public readonly SMTP_PASS: string;
	public readonly SMTP_FROM: string;
	public readonly GOOGLE_API_KEY: string;

	constructor() {
		config();
		this.ENV = process.env.NODE_ENV || "";
		this.CONNECTION_STRING = process.env.MONGODB_URI || "";
		this.PORT = process.env.PORT || "";
		this.DATABASE_NAME = process.env.DATABASE_NAME || "currencyexchange";

		// SMTP Configurations
		this.SMTP_HOST = process.env.SMTP_HOST || "";
		this.SMTP_PORT = parseInt(process.env.SMTP_PORT || "");
		this.SMTP_USER = process.env.SMTP_USER || "";
		this.SMTP_PASS = process.env.SMTP_PASS || "";
		this.SMTP_FROM = process.env.SMTP_FROM || "";
		this.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "" || "";
	}
}

export default envConfig;
