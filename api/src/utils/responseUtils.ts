interface SuccessResponse<T> {
	data: T;
	success: boolean;
	failCode: number;
	params: Record<string, any>;
	message: string;
}

const generateSuccessResponse = <T>(data: T, message = "Success", params: Record<string, any> = {}): SuccessResponse<T> => {
	return {
		data,
		success: true,
		failCode: 0,
		params,
		message,
	};
};
const generateFilterDataResponse = <T>(statusCode: number, data: T, filter: any, message = "Success", success = true): any => {
	return {
		data,
		filter,
		success: success,
		statusCode,
		message,
	};
};
const generateErrorResponse = (failCode: number, message = "Error", params: Record<string, any> = {}): SuccessResponse<null> => {
	console.error("Error : " + message);
	return {
		data: null,
		success: false,
		failCode,
		params,
		message,
	};
};

export { generateSuccessResponse, generateErrorResponse, generateFilterDataResponse };
