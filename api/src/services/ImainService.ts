export interface IMainService {
	getAllTransaction(filters: any): any;
	buyCurrency(requestData: { amount: number; plnAmount: number; userUId: string; currency: string; }): any;
	sellCurrency(requestData: { amount: number; plnAmount: number; userUId: string; currency: string; }): any;
	uploadProfile(body: any): unknown;
	updateUser(body: any): unknown;
	addFunds(requestObject: { uId: string; amount: number; }): unknown;
	withdrowFunds(requestObject: { uId: string; amount: number; }): unknown;
	getUser(requestObject: { uId: string; }): unknown;
	register(body: any): Promise<any>;
	login(body: any): Promise<any>;
}
