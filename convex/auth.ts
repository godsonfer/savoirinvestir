import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";
const customPassword = Password<DataModel>({
  profile(params) {
    return {
      email: params.email as string,
      name: params.name as string,
      image: params.image as string,
      phone: params.phone as string,
      role: "member",
    };
  },
});

export const { auth, signIn, signOut, store,  } = convexAuth({
  providers: [customPassword],
});

