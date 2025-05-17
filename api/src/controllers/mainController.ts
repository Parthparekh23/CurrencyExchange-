import { Request, Response, Router } from "express";
import { IMainService } from "../services/ImainService";
import { generateErrorResponse, generateFilterDataResponse, generateSuccessResponse } from "../utils/responseUtils";
class mainController {
	private readonly router;
	constructor(private readonly _mainService: IMainService) {
		this.router = Router();

		this.configureRoutes();
	}
	private configureRoutes() {
		this.router.post("/register", (req, res) => this.register(req, res));
		this.router.post("/login", (req, res) => this.login(req, res));
		this.router.post("/getUser", (req, res) => this.getUser(req, res));
		this.router.post("/addFunds", (req, res) => this.addFunds(req, res));
		this.router.post("/withdrowFunds", (req, res) => this.withdrowFunds(req, res));
		this.router.post("/updateUser", (req, res) => this.updateUser(req, res));
		this.router.post("/uploadProfile", (req, res) => this.uploadProfile(req, res));
		this.router.post("/buyCurrency", (req, res) => this.buyCurrency(req, res));
		this.router.post("/sellCurrecy", (req, res) => this.sellCurrency(req, res));
		this.router.post("/getAllTransaction", (req, res) => this.getAllTransaction(req, res));
	}
	sellCurrency = async (req: Request, res: Response): Promise<void> => {
		try {
			let requestData:{ amount: number; plnAmount: number; userUId: string; currency: string; }=req.body;
			const response = await this._mainService.sellCurrency(requestData);
			res.status(200).json(generateFilterDataResponse(200, response.message, "sucess")); 
		} catch (error: any) {
			console.error("Error in processing", error);
			res.status(500).json(generateFilterDataResponse(500, null, null, "Internal Server Error", false));
		}
	};
	getAllTransaction = async (req: Request, res: Response): Promise<void> => {
		try {
			const response = await this._mainService.getAllTransaction(req.body);
			res.status(200).json(generateFilterDataResponse(200, response, "sucess")); 
		} catch (error: any) {
			console.error("Error in processing", error);
			res.status(500).json(generateFilterDataResponse(500, null, null, "Internal Server Error", false));
		}
	};
	buyCurrency= async (req: Request, res: Response): Promise<void> => {
		try {
			let requestData:{ amount: number; plnAmount: number; userUId: string; currency: string; }=req.body;
			const response = await this._mainService.buyCurrency(requestData);
			res.status(200).json(generateFilterDataResponse(200, response.message, "sucess")); 
		} catch (error: any) {
			console.error("Error in processing", error);
			res.status(500).json(generateFilterDataResponse(500, null, null, "Internal Server Error", false));
		}
	};

	// --------- Buy -------------
	

	// ----------- Register --------------
	register = async (req: Request, res: Response): Promise<void> => {
		try {
			const response = await this._mainService.register(req.body);

			if (response != null) {
				res.status(200).json(generateFilterDataResponse(200, response.uId, response.filter, "Data Fetched successfully", true));
			} else {
				console.error("Data not found");
				res.status(404).json(generateFilterDataResponse(404, null, null, "Data not found", false));
			}
		} catch (error: any) {
			console.error("Error in processing", error);
			res.status(500).json(generateFilterDataResponse(500, null, null, "Internal Server Error", false));
		}
	};
	// --------------- updateUser ----------------
	updateUser = async (req: Request, res: Response): Promise<void> => {
		try {
			const response = await this._mainService.updateUser(req.body);

			if (response != null) {
				res.status(200).json(generateSuccessResponse(response, "User Data updated successfully"));
			} else {
				console.error("Data not found");
				res.status(200).json(generateErrorResponse(404, "User Not Found !"));
			}
		} catch (error: any) {
			console.error("Error in processing", error);
			res.status(500).json(generateFilterDataResponse(500, null, null, "Internal Server Error", false));
		}
	};

	// --------------- uploadProfile ----------------
	uploadProfile = async (req: Request, res: Response): Promise<void> => {
		try {
			const response = await this._mainService.uploadProfile(req.body);

			if (response != null) {
				res.status(200).json(generateSuccessResponse(response, "Profile Image uploaded successfully"));
			} else {
				console.error("Data not found");
				res.status(200).json(generateErrorResponse(404, "User Not Found !"));
			}
		} catch (error: any) {
			console.error("Error in processing", error);
			res.status(500).json(generateFilterDataResponse(500, null, null, "Internal Server Error", false));
		}
	};

	// --------------- Login ----------------
	login = async (req: Request, res: Response): Promise<void> => {
		try {
			let requestObject = req.body as { email: string; password: string };
			const response = await this._mainService.login(requestObject);

			if (response != null) {
				res.status(200).json(generateSuccessResponse(response, "login sucessfully"));
			} else {
				console.error("Data not found");
				res.status(200).json(generateErrorResponse(404, "User Not Found !"));
			}
		} catch (error: any) {
			console.error("Error in processing", error);
			res.status(500).json(generateFilterDataResponse(500, null, null, "Internal Server Error", false));
		}
	};

	// --------------- getUser ----------------
	getUser = async (req: Request, res: Response): Promise<void> => {
		try {
			let requestObject = req.body as { uId: string };
			const response = await this._mainService.getUser(requestObject);

			if (response != null) {
				res.status(200).json(generateSuccessResponse(response, "User Data fetched successfully"));
			} else {
				console.error("Data not found");
				res.status(200).json(generateErrorResponse(404, "User Not Found !"));
			}
		} catch (error: any) {
			console.error("Error in processing", error);
			res.status(500).json(generateFilterDataResponse(500, null, null, "Internal Server Error", false));
		}
	};

	// --------------- addFunds ----------------
	addFunds = async (req: Request, res: Response): Promise<void> => {
		try {
			let requestObject = req.body as { uId: string; amount: number };
			const response = await this._mainService.addFunds(requestObject);

			if (response != null) {
				res.status(200).json(generateSuccessResponse(response, "Funds added successfully"));
			} else {
				console.error("Data not found");
				res.status(200).json(generateErrorResponse(404, "User Not Found !"));
			}
		} catch (error: any) {
			console.error("Error in processing", error);
			res.status(500).json(generateFilterDataResponse(500, null, null, "Internal Server Error", false));
		}
	};

	// --------------- withdrowFunds ----------------
	withdrowFunds = async (req: Request, res: Response): Promise<void> => {
		try {
			let requestObject = req.body as { uId: string; amount: number };
			const response:any = await this._mainService.withdrowFunds(requestObject);

			if (response.success) {
				res.status(200).json(generateSuccessResponse(response, "Funds withdrow successfully"));
			} else {
				res.status(500).json(generateSuccessResponse(500,response.message ));
			}
		} catch (error: any) {
			console.error("Error in processing", error);
			res.status(500).json(generateFilterDataResponse(500, null, null, "Internal Server Error", false));
		}
	};

	getRouter(): Router {
		return this.router;
	}
}

export { mainController };
