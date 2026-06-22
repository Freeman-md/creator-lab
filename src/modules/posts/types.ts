export type PostRecord = {
  id: string;
  title?: string;
  body: string;
  publishedDateTime: string;
  goal: string;
  category: string;
  audience: string;
  creationTime: string;
  updatedAt: number;
};

export type PostFormValues = Pick<
  PostRecord,
  "title" | "body" | "publishedDateTime" | "goal" | "category" | "audience"
>;

export type PostFormSubmitValues = Omit<PostFormValues, "title"> & {
  title?: string;
};
