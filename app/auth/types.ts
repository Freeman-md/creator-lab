export type AuthFeedback = {
  error?: string;
  message?: string;
};

export type AuthFeedbackKey = keyof AuthFeedback;

export type AuthPageSearchParams = AuthFeedback & {
  email?: string;
};

export type AuthRedirectParams = Partial<AuthPageSearchParams>;
