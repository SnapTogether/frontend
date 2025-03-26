// src/components/ui/EventForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../Input/Input";
import { createEvent, CreateEventData } from "@/api/event";
import { useRouter } from "next/navigation";
import Button from "../Button/Button";
import { useTranslations } from "next-intl";
import PendingPaymentNotice from "../PendingPaymentNotice/PendingPaymentNotice";

export default function EventForm() {
  const router = useRouter();
  const [eventResponse, setEventResponse] = useState<string | null>(null);
  const [selectedPaidPlan, setSelectedPaidPlan] = useState<"starter" | "pro" | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventData>();

  const onSubmit = async (data: CreateEventData) => {
    const response = await createEvent(data);

    if (response.status === 201) {
      if (data.plan === "free") {
        // Free plan = redirect directly
        router.push(`/event/${response.eventCode}/${response.hostCode}/dashboard`);
      } else {
        // Paid plan = show payment instructions
        setSelectedPaidPlan(data.plan); // ⬅️ this will show payment info
      }
    }
    

  };

  const t = useTranslations("eventForm");

  return (
    <>
      {!selectedPaidPlan ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-fit max-w-md w-full space-y-4 p-6 rounded-lg shadow-md bg-white opacity-90"
        >
          <h2 className="text-xl font-mulish text-center">{t("title")}</h2>

          <Input
            label={t("name")}
            {...register("fullName", { required: t("fullNameRequired") })}
            error={errors.fullName?.message}
          />

          <Input
            label={t("email")}
            type="email"
            {...register("email", { required: t("emailRequired") })}
            error={errors.email?.message}
          />

          <Input
            label={t("eventName")}
            {...register("eventName", { required: t("eventNameRequired") })}
            error={errors.eventName?.message}
          />

          <Input
            label={t("eventDate")}
            type="date"
            {...register("eventDate", { required: t("eventDateRequired") })}
            error={errors.eventDate?.message}
          />

          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700">{t("plan") || "Select Plan"}</label>
            <select
              {...register("plan", { required: "Please select a plan" })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              defaultValue="free" // optional default
            >
              <option value="free">{t("plans.free")}</option>
              <option value="starter">{t("plans.starter")} 20$</option>
              <option value="pro">{t("plans.pro")} 60$</option>
            </select>
            {errors.plan && <p className="text-red-500 text-xs mt-1">{errors.plan.message}</p>}
          </div>

          <Button type="submit" variant="primary" className="w-full !bg-[rgba(120,128,181,1)]">
            {t("createEvent")}
          </Button>

          {eventResponse && <p className="text-slate-700 text-sm text-center mt-2">{eventResponse}</p>}
        </form>
      ) : (
        <PendingPaymentNotice plan={selectedPaidPlan} />
      )}
    </>
  );

}
