import { z } from "zod";

import i18n from "@/i18n";

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  emailAddress: z.string().email(),
});

export const hasMinLength = (value: string) => {
  return value.length >= 8;
};

export const hasNumber = (value: string) => {
  return /\d/.test(value);
};

export const hasLetter = (value: string) => {
  return /[a-zA-Z]/.test(value);
};

export const getUserSchema = () => {
  return userSchema
    .omit({ id: true })
    .extend({
      emailAddress: z.email({
        message: i18n.t("form.errors.invalidField", { field: i18n.t("form.email") }),
      }),
      password: z
        .string()
        .refine(hasMinLength, { message: i18n.t("form.errors.passwordTooWeak") })
        .refine(hasNumber, { message: i18n.t("form.errors.passwordTooWeak") })
        .refine(hasLetter, { message: i18n.t("form.errors.passwordTooWeak") }),
      passwordConfirmation: z.string(),
    })
    .refine(
      (values) => {
        return values.password === values.passwordConfirmation;
      },
      {
        message: i18n.t("form.errors.passwordMismatch"),
        path: ["passwordConfirmation"],
      },
    );
};
