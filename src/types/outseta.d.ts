// Outseta global types
declare global {
  interface Window {
    Outseta: {
      getSignupWidget(): {
        open(): void;
      };
      getLoginWidget(): {
        open(): void;
      };
      getProfileWidget(): {
        open(): void;
      };
    };
  }
}

export {};