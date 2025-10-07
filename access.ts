import { BaseItem } from "@keystone-6/core/types";

export type Session = {
  itemId: string;
  data: {
    role: "ADMIN" | "EDITOR" | "CUSTOMER";
  };
};

export const isAdmin = ({ session }: { session?: Session }) =>
  session?.data.role === "ADMIN";

export const isEditor = ({ session }: { session?: Session }) =>
  session?.data.role === "EDITOR";

export const isCustomer = ({ session }: { session?: Session }) =>
  session?.data.role === "CUSTOMER";

export const isAdminOrEditorOrCustomer = ({
  session,
}: {
  session?: Session;
}) => {
  return (
    isAdmin({ session }) || isEditor({ session }) || isCustomer({ session })
  );
};
export const isAdminOrEditor = ({ session }: { session?: Session }) => {
  return isAdmin({ session }) || isEditor({ session });
};
export const isAdminOrCustomer = ({ session }: { session?: Session }) => {
  return isAdmin({ session }) || isCustomer({ session });
};

export const canReadProfile = ({ session }: { session?: Session }) => {
  const otherUserId = session?.itemId;
  if (session?.data.role === "ADMIN") return true;
  return { id: { equals: otherUserId } };
};

export const canUpdateProfile = ({
  session,
  item,
}: {
  session?: Session;
  item: BaseItem;
}) => {
  return isAdmin({ session }) || session?.itemId === item.id;
};

export const canUpdateOrDeleteDeliveryAddress = ({
  session,
}: {
  session?: Session;
}) => {
  const customerId = session?.itemId;
  if (session?.data.role === "ADMIN") return true;
  return { user: { id: { equals: customerId } } };
};
