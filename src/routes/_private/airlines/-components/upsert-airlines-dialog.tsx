import { useEffect, useRef } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Dialog, ErrorMessage, Input, Label, toast } from "@/components/ui";
import { useTranslation } from "@/i18n";
import { useCreateAirlineMutation, useUpdateAirlineMutation } from "@/services/airlines/actions";
import { getAirlineSchema } from "@/services/airlines/schemas";
import type { Airline, CreateAirline, UpdateAirline } from "@/services/airlines/types";
import type { UpsertAirlineFormData } from "@/services/airlines/types";
import { handleAxiosFieldErrors } from "@/utils";

type UpsertAirlineDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  airline?: Airline;
};

export const UpsertAirlineDialog = ({
  airline,
  isOpen,
  onOpenChange,
}: UpsertAirlineDialogProps) => {
  const { t } = useTranslation();
  const hasResetRef = useRef(false);

  const currentAirline = airline;
  const isNewAirline = !currentAirline;

  const { isPending: isCreating, mutate: createAirline } = useCreateAirlineMutation();
  const { isPending: isUpdating, mutate: updateAirline } = useUpdateAirlineMutation();
  const isPending = isUpdating || isCreating;

  const handleCreate = (payload: CreateAirline) => {
    createAirline(payload, {
      onSuccess: () => {
        toast.success(t("airlines.create.success"));
        onOpenChange(false);
        reset();
      },
      onError: (error) => {
        handleAxiosFieldErrors<CreateAirline>(error, setError, t("airlines.create.error"));
      },
    });
  };

  const handleUpdate = (payload: UpdateAirline) => {
    updateAirline(payload, {
      onSuccess: () => {
        toast.success(t("airlines.update.success"));
        onOpenChange(false);
        reset();
      },
      onError: (error) => {
        handleAxiosFieldErrors<UpdateAirline>(error, setError, t("airlines.update.error"));
      },
    });
  };

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<UpsertAirlineFormData>({
    mode: "onTouched",
    resolver: zodResolver(getAirlineSchema()),
    defaultValues: {
      name: currentAirline?.name ?? "",
      description: currentAirline?.description ?? "",
    },
  });

  useEffect(() => {
    if (isOpen && currentAirline && !hasResetRef.current) {
      reset({
        name: currentAirline?.name ?? "",
        description: currentAirline?.description ?? "",
      });
      hasResetRef.current = true;
    }

    if (!isOpen) {
      hasResetRef.current = false;
    }
  }, [isOpen, currentAirline, reset]);

  const onSubmit: SubmitHandler<UpsertAirlineFormData> = (data) => {
    const payload = {
      name: data.name ?? "",
      description: data.description,
    };

    if (isNewAirline) {
      return handleCreate(payload);
    }

    return handleUpdate({ id: currentAirline!.id, ...payload });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={isOpen}>
      <Dialog.Content isDismissible={!isPending}>
        <Dialog.Header>
          <Dialog.Title>
            {isNewAirline ? t("airlines.create.title") : t("airlines.update.title")}
          </Dialog.Title>
          <Dialog.Description>
            {isNewAirline ? t("airlines.create.description") : t("airlines.update.description")}
          </Dialog.Description>
        </Dialog.Header>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">{t("form.name")}</Label>
            <Input {...register("name")} id="name" size="sm" />
            <ErrorMessage errorMessage={errors?.name?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">{t("airlines.create.description")}</Label>
            <Input {...register("description")} id="description" size="sm" />
            <ErrorMessage errorMessage={errors?.description?.message} />
          </div>

          <Dialog.Footer>
            <Dialog.Close disabled={isPending} asChild>
              <Button variant="outlined">{t("buttons.cancel")}</Button>
            </Dialog.Close>
            <Button isLoading={isPending} type="submit">
              {isNewAirline ? t("buttons.create") : t("buttons.update")}
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
