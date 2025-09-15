// Outseta global types
declare global {
  interface Window {
    Outseta: {
      getUser(): Promise<{
        user: {
          uid: string;
          email: string;
          firstName: string;
          lastName: string;
          fullName: string;
          created: string;
          updated: string;
        };
        account: {
          uid: string;
          name: string;
          accountStage: number;
          billingStageName: string;
          personAccount: Array<{
            person: any;
            isPrimary: boolean;
          }>;
          currentSubscription?: {
            uid: string;
            plan: {
              uid: string;
              slug: string;
              name: string;
            };
            billingRenewalTerm: number;
            startDate: string;
            renewalDate: string;
          };
        };
      }>;
      getJwtPayload(): Promise<{
        sub: string;
        email: string;
        name: string;
        account_uid: string;
        plan_uid?: string;
        plan_name?: string;
        account_stage: number;
        exp: number;
        iat: number;
      }>;
      auth: {
        login(): void;
        logout(): void;
      };
      profile: {
        show(): void;
      };
    };
    o_options: {
      domain: string;
      load: string;
    };
  }
}

export {};