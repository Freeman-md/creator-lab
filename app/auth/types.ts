export type AuthFeedback = {
  error?: string;
  message?: string;
};

export type AuthFeedbackKey = keyof AuthFeedback;
