import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/user.entity";
import { RegisterInput } from "./register/RegisterInput";
<<<<<<< HEAD
import { isAuth } from "../middleware/isAuth";
=======
import { isAuth } from "./middleware/isAuth";
>>>>>>> 55ae9457d723f5476c149131c54e42392c219d1c

@Resolver()
export class RegisterResolver {
    @UseMiddleware(isAuth)
    @Query(() => String)
    async hello() {
        return "Hello World";
    }

    @Mutation(() => User)
    async register(
        @Arg("data") { firstName, lastName, email, password }: RegisterInput
    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        }).save();
        return user;
    }
}
