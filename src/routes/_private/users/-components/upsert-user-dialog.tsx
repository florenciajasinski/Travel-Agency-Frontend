import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  Dialog,
  ErrorMessage,
  Input,
  Label,
  PasswordInput,
  PasswordValidator,
  toast,
} from "@/components/ui";
import { useTranslation } from "@/i18n";
import {
  type CreateUser,
  getUserSchema,
  type UpdateUser,
  useCreateUserMutation,
  type User,
  useUpdateUserMutation,
} from "@/services";
import { handleAxiosFieldErrors } from "@/utils";

type UpsertUserDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
};

export const UpsertUserDialog = ({ isOpen, onOpenChange, user }: UpsertUserDialogProps) => {
  const { t } = useTranslation();

  const { isPending: isCreating, mutate: createUser } = useCreateUserMutation();
  const { isPending: isUpdating, mutate: updateUser } = useUpdateUserMutation();

  const isNewUser = !user;
  const isPending = isUpdating || isCreating;

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm({
    mode: "onTouched",
    resolver: zodResolver(getUserSchema()),
    values: {
      emailAddress: user?.emailAddress ?? "",
      name: user?.name ?? "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit: SubmitHandler<CreateUser | UpdateUser> = (data) => {
    if (isNewUser) {
      return createUser(data, {
        onSuccess: () => {
          toast.success(t("users.create.success"));
          onOpenChange(false);
          reset();
        },
        onError: (error) => {
          handleAxiosFieldErrors<CreateUser>(error, setError, t("users.create.error"));
        },
      });
    }

    return updateUser(
      { ...data, id: user.id },
      {
        onSuccess: () => {
          toast.success(t("users.update.success"));
          onOpenChange(false);
          reset();
        },
        onError: (error) => {
          handleAxiosFieldErrors<UpdateUser>(error, setError, t("users.update.error"));
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }

    onOpenChange(open);
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={isOpen}>
      <Dialog.Content isDismissible={!isUpdating && !isCreating}>
        <Dialog.Header>
          <Dialog.Title>
            {isNewUser ? t("users.create.title") : t("users.update.title")}
          </Dialog.Title>

          <Dialog.Description>
            {isNewUser ? t("users.create.description") : t("users.update.description")}
          </Dialog.Description>
        </Dialog.Header>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">{t("form.name")}</Label>

            <Input {...register("name")} id="name" size="sm" />

            <ErrorMessage errorMessage={errors?.name?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="emailAddress">{t("form.email")}</Label>

            <Input {...register("emailAddress")} id="emailAddress" size="sm" />

            <ErrorMessage errorMessage={errors?.emailAddress?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">{t("form.password")}</Label>

            <PasswordInput {...register("password")} id="password" size="sm" />

            <ErrorMessage errorMessage={errors?.password?.message} />

            <PasswordValidator control={control} name="password" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="passwordConfirmation">{t("form.confirmPassword")}</Label>

            <PasswordInput
              {...register("passwordConfirmation")}
              id="passwordConfirmation"
              size="sm"
            />

            <ErrorMessage errorMessage={errors?.passwordConfirmation?.message} />
          </div>

          <Dialog.Footer>
            <Dialog.Close disabled={isPending} asChild>
              <Button variant="outlined">{t("buttons.cancel")}</Button>
            </Dialog.Close>

            <Button isLoading={isPending} type="submit">
              {isNewUser ? t("buttons.create") : t("buttons.update")}
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
