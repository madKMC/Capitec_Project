export type User = {
	customerId: string;
	name: string;
	email: string;
	accountType: string;
	totalSpent: number;
	currency: string;
};

export type AuthContextType = {
    user: User | null;
    token: string | null;
    isInitializing: boolean;
    login: (username: string) => Promise<void>;
    logout: () => Promise<void>;
};