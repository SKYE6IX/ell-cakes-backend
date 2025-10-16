export type Session = {
  itemId: string;
  listKey: string;
  data: {
    role: "ADMIN" | "EDITOR" | "CUSTOMER";
  };
};

type AccessArgs = {
  session?: Session;
};

export const isSignedIn = ({ session }: AccessArgs) => !!session;

export const permissions = {
  // Admin is allow to manage users
  canManageUsers: ({ session }: AccessArgs) => session?.data.role === "ADMIN",

  canManageProduct: ({ session }: AccessArgs) =>
    session?.data.role === "ADMIN" || session?.data.role === "EDITOR",
};

export const rules = {
  canReadUser: ({ session }: AccessArgs) => {
    if (!session) return false;
    // Admin can read all profile
    if (session.data.role === "ADMIN") return true;
    // Other roles are only allow to read their own profile
    return { id: { equals: session.itemId } };
  },

  canUpdateUser: ({ session }: AccessArgs) => {
    if (!session) return false;
    // Admin can read all profile
    if (session.data.role === "ADMIN") return true;
    // Other roles are only allow to read their own profile
    return { id: { equals: session.itemId } };
  },

  canManageDeliveryAddress: ({ session }: AccessArgs) => {
    if (!session) return false;
    // Admin or Editor can manage all delivery address
    if (session.data.role === "ADMIN" || session.data.role === "EDITOR")
      return true;
    // Customer should only manage their own delivery address
    return { user: { id: { equals: session.itemId } } };
  },
};
