import { Injectable } from '@nestjs/common';
import { SignupCustomerDTO } from './dto/signup-customer.dto';
// import { db, users } from '@paytomorrow/db';

@Injectable()
export class CustomerService {
  async create(userData: SignupCustomerDTO) {
    try {
      // await db.insert(users).values({
      //   firstName: userData.firstName,
      //   lastName: userData.lastName,
      //   email: userData.email,
      //   // pass
      // })
      return await new Promise(() => userData);
    } catch (error) {
      console.log(error);
      throw new Error('Error executing query', error);
    }
  }
}
