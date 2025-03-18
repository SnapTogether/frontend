// src/components/ui/EventForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../Input/Input";
import { createEvent, CreateEventData } from "@/api/event";
import { useRouter } from "next/navigation";
import Button from "../Button/Button";
import { useTranslations } from "next-intl";

export default function EventForm() {
  const router = useRouter();
  const [eventResponse, setEventResponse] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventData>();

  const onSubmit = async (data: CreateEventData) => {
    const response = await createEvent(data);
    
    if (response.status === 201) {
      setEventResponse(response.message);

      // ✅ Redirect Host to Their Dashboard
      router.push(`/event/${response.eventCode}/${response.hostCode}/dashboard`);
    } else {
      setEventResponse("❌ Failed to create event. Please try again.");
    }
  };

  const t = useTranslations("eventForm");

  return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-fit max-w-md w-full space-y-4 p-6 rounded-lg shadow-md bg-white opacity-90"
      >
      <h2 className="text-xl font-mulish text-center">{t("title")}</h2>

      <Input label={t("name")} {...register("name", { required: "Name is required" })} error={errors.name?.message} />
      <Input label={t("surname")} {...register("surname", { required: "Surname is required" })} error={errors.surname?.message} />
      <Input label={t("email")} type="email" {...register("email", { required: "Email is required" })} error={errors.email?.message} />
      <Input label={t("eventName")} {...register("eventName", { required: "Event name is required" })} error={errors.eventName?.message} />
      <Input label={t("eventDate")} type="date" {...register("eventDate", { required: "Event date is required" })} error={errors.eventDate?.message} />

      <Button type="submit" variant="primary" className="w-full !bg-[rgba(120,128,181,1)]">
        {t("createEvent")}
      </Button>

      {eventResponse && <p className="text-slate-700 text-sm text-center mt-2">{eventResponse}</p>}
    </form>
  );
}
