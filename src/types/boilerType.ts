
export type BoilerAttributes = {
    id: number;
    name: string;
    location: string;
    description: string; createAt: string;
    updateAt: string;
};
export type BoilerWithoutIdAttribute = Omit<BoilerAttributes, 'id'>;
export type BoilerUsersAttributes = {
    id: number;
    boilerId: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
};
export type BoilerDevicesAttributes = {
    id: number;
    boilerId: number;
    deviceId: number;
    createdAt: string;
    updatedAt: string;
};
export type GetBoilerByIdResponseType = BoilerAttributes & {
    users: BoilerUsersAttributes[];
    devices: BoilerDevicesAttributes[];
};
