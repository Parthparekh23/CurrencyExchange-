import { Expose } from 'class-transformer';

class UserModel
{
    @Expose()
    firstName : string = "";

    @Expose()
    lastName : string = "";
    
    @Expose()
    userDtype : string = "";

    @Expose()
    mobileNumber : string = "";
    
    @Expose()
    password : string = "";

    @Expose()
    role : string = "";

    @Expose()
    email : string = "";

    @Expose()
    uId: string | null= "";

    @Expose()
    profileImage : string = "";

    @Expose()
    plnBalance : number = 0;

    @Expose()
    balance : Balance[] = [];
    
    constructor() {
	}
}

type Balance={
    amount: number;
    currency: string;

};

export default UserModel;
