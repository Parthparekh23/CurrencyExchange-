import { inject, injectable } from "inversify";
import { IMainService } from "../services/ImainService";
const { v4: uuidv4 } = require("uuid");
import { MongoClient, Collection, UUID } from "mongodb";
import UserModel from "../models/userModel";

import envConfig from "../utils/envConfig";
import { TransactionHistory } from "../models/transactionDetails";

@injectable()
export class MainService implements IMainService {
	private client: MongoClient;
	private readonly envConfig = new envConfig();
	private userCollection!: Collection;
	private userDtype = "user";
	constructor() {
		// MongoDB connection string and database name
		const DATABASE_NAME = this.envConfig.DATABASE_NAME;

		// Initialize MongoDB client
		this.client = new MongoClient(this.envConfig.CONNECTION_STRING);
		this.client
			.connect()
			.then(() => {
				console.info("Connected to MongoDB");
				this.userCollection = this.client.db(DATABASE_NAME).collection("collection");
			})
			.catch((err) => {
				console.error("MongoDB connection error:", err);
			});
		
	}
	 
 
	async uploadProfile(body: {imgstring : string , uId : string}): Promise<any> {
		// get user and update profile image
		let user = await this.getUser({ uId: body.uId });
		if (user) {
			try{
				user.profileImage = body.imgstring;
			await this.updateUser(user);
			return {message: "Profile Image updated successfully"};
			}catch(e){
				return {message: "Error in updating profile image"};
			}
		}else{
			return {message: "User not found"};
		}
	} 



async sellCurrency(requestData: { amount: number; plnAmount: number; userUId: string; currency: string; }): Promise<unknown> {
    // Fetch user by UID
    let user = await this.getUser({ uId: requestData.userUId });

    if (user) {
        // Find the balance for the specified currency
        let currencyBalance = user.balance.find(b => b.currency === requestData.currency);

        if (currencyBalance) {
            // Check if user has enough currency to sell
            if (currencyBalance.amount < requestData.amount) {
                throw new Error("Insufficient currency balance to sell.");
            }

            // Deduct the sold amount from the currency balance
            currencyBalance.amount -= requestData.amount;

            // Add the equivalent PLN amount to the user's PLN balance
            user.plnBalance += requestData.plnAmount;

            // Update the balance list to remove currencies with zero balance
            user.balance = user.balance.filter(b => b.amount > 0);

            // Update the user data
            await this.updateUser(user);

            // Log the transaction
            const transaction = new TransactionHistory('sell', requestData.userUId, requestData.plnAmount, `Sold ${requestData.amount} ${requestData.currency}`);
            await this.logTransaction(transaction);

            return { success: true, message: "Currency sold successfully", updatedUser: user };
        } else {
            throw new Error("You don't have a balance for the specified currency to sell.");
        }
    }

    throw new Error("User not found.");
}

async buyCurrency(requestData: { amount: number; plnAmount: number; userUId: string; currency: string; }): Promise<unknown> {
    // Fetch user by UID
    let user = await this.getUser({ uId: requestData.userUId });

    if (user) {
        // Check if user has enough PLN to buy the currency
        if (user.plnBalance < requestData.plnAmount) {
            throw new Error("Insufficient PLN balance to buy currency.");
        }

        // Deduct the PLN amount from the user's balance
        user.plnBalance -= requestData.plnAmount;

        // Find or create the currency balance
        let currencyBalance = user.balance.find(b => b.currency === requestData.currency);
        if (currencyBalance) {
            currencyBalance.amount += requestData.amount;
        } else {
            user.balance.push({ currency: requestData.currency, amount: requestData.amount });
        }

        // Update the user data
        await this.updateUser(user);

        // Log the transaction
        const transaction = new TransactionHistory('buy', requestData.userUId, requestData.plnAmount, `Bought ${requestData.amount} ${requestData.currency}`);
        await this.logTransaction(transaction);

        return { success: true, message: "Currency bought successfully", updatedUser: user };
    }

    throw new Error("User not found.");
}

async addFunds(requestObject: { uId: string; amount: number; }): Promise<any> {
    // Fetch user by UID
    let user = await this.getUser({ uId: requestObject.uId });
    if (user) {
        // Add the amount to PLN balance
        user.plnBalance += requestObject.amount;

        // Find or create the PLN balance
        let plnBalance = user.balance.find((balance) => balance.currency === "PLN");
        if (plnBalance) {
            plnBalance.amount += requestObject.amount;
        } else {
            user.balance.push({ amount: requestObject.amount, currency: "PLN" });
        }

        // Update the user data
        await this.updateUser(user);

        // Log the transaction
        const transaction = new TransactionHistory('fund added', requestObject.uId, requestObject.amount, "Funds added to PLN balance");
        await this.logTransaction(transaction);

        return { message: "Funds added successfully" };
    }

    throw new Error("User not found.");
}

async withdrowFunds(requestObject: { uId: string; amount: number; }): Promise<any> {
    // Fetch user by UID
    let user = await this.getUser({ uId: requestObject.uId });
    if (user) {
        // Check if user has enough PLN balance to withdraw
        if (user.plnBalance < requestObject.amount) {
            throw new Error("Insufficient PLN balance to withdraw.");
        }

        // Deduct the amount from PLN balance
        user.plnBalance -= requestObject.amount;

        // Find the PLN balance and update it
        let plnBalance = user.balance.find((balance) => balance.currency === "PLN");
        if (plnBalance) {
            plnBalance.amount -= requestObject.amount;
        } else {
            throw new Error("PLN balance not found.");
        }

        // Update the user data
        await this.updateUser(user);

        // Log the transaction
        const transaction = new TransactionHistory('withdraw', requestObject.uId, requestObject.amount, "Funds withdrawn from PLN balance");
        await this.logTransaction(transaction);

        return { success: true, message: "Funds withdrawn successfully" };
    }

    throw new Error("User not found.");
}


async logTransaction(transaction:TransactionHistory){
	transaction.uId=uuidv4();
	await this.userCollection.insertOne(transaction);
	return transaction;
}

async getAllTransaction(filter:any):Promise<TransactionHistory[]>{
	filter={...filter,dType:"transaction"}
	let list = await this.userCollection.find<TransactionHistory>(filter).toArray();
	return list;
}
	async getUser(requestObject: { uId: string; }): Promise<UserModel|null> {
		let user = await this.userCollection.findOne<UserModel>({ uId: requestObject.uId });
		return user;
	}
	async register(body: any): Promise<any> {
		try {
			// Destructure fields directly from body
			// check if user exist with email
			const user = await this.userCollection
				.findOne
				<UserModel>({ email: body.email });
			if (user) {
				return {
					message: "User already registered",
				}}
			const registerUser = new UserModel();
			registerUser.firstName = body.firstName;
			registerUser.lastName = body.lastName;
			registerUser.password = body.password;
			registerUser.role = body.role;
			registerUser.uId = uuidv4();
			registerUser.userDtype = this.userDtype;
			registerUser.mobileNumber = body.mobileNumber;
			registerUser.email = body.email;
			registerUser.plnBalance = 0;
			registerUser.balance = [];



			const response = await this.userCollection.insertOne(registerUser);

			return {
				message: "User registered successfully",
				userId: response.insertedId,
			};
		} catch (error) {
			console.error("Error in registering user:", error);
			throw error;
		}
	}

	async login(body: any): Promise<any> {
		try {
			const user = await this.userCollection.findOne({ email: body.email, password: body.password });
			return user;
		} catch (error) {
			console.error("Error in logging user:", error);
			return null;
		}
	}

	async updateUser(requestObject: UserModel): Promise<any> {
		try {
			const response = await this.userCollection.updateOne({ uId: requestObject.uId }, { $set: requestObject });
			return response;
		} catch (error) {
			console.error("Error in updating user:", error);
			throw error;
		}
	}
}
