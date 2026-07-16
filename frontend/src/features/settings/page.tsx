"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Settings, Save, ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import { Textarea } from "@/lib/components/ui/textarea";
import { Switch } from "@/lib/components/ui/switch";
import { LoadingOverlay } from "@/lib/components/ui/loading-overlay";
import { useSettings, useUpdateSettings } from "./hooks";
import { settingsSchema, SettingsFormData } from "./validation";

export default function SettingsPage() {
  const router = useRouter();
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const tVal = useTranslations("validation");
  const { data: settings, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema(tVal)),
    defaultValues: {
      restaurantName: "",
      phone: "",
      address: "",
      logo: undefined,
      taxEnabled: false,
      taxPercentage: 0,
      serviceChargeEnabled: false,
      serviceChargePercentage: 0,
      receiptHeader: "",
      receiptFooter: "",
    },
  });

  const taxEnabled = watch("taxEnabled");
  const serviceChargeEnabled = watch("serviceChargeEnabled");

  useEffect(() => {
    if (settings) {
      reset({
        restaurantName: settings.restaurantName,
        phone: settings.phone,
        address: settings.address,
        logo: settings.logo ?? undefined,
        taxEnabled: settings.taxEnabled,
        taxPercentage: settings.taxPercentage,
        serviceChargeEnabled: settings.serviceChargeEnabled,
        serviceChargePercentage: settings.serviceChargePercentage,
        receiptHeader: settings.receiptHeader,
        receiptFooter: settings.receiptFooter,
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: SettingsFormData) => {
    await updateMutation.mutateAsync(data);
  };

  if (isLoading) {
    return <LoadingOverlay isLoading={true} message={t("loading")} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(ROUTES.DASHBOARD)}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
            <Settings className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              {t("restaurantInfo")}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("restaurantName")}</Label>
                <Input {...register("restaurantName")} />
                {errors.restaurantName && (
                  <p className="text-sm text-red-500">{errors.restaurantName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("restaurantPhone")}</Label>
                <Input {...register("phone")} />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>{t("restaurantAddress")}</Label>
                <Input {...register("address")} />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address.message}</p>
                )}
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>{t("logoUrl")}</Label>
                <Input {...register("logo")} />
                {errors.logo && (
                  <p className="text-sm text-red-500">{errors.logo.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              {t("taxSettings")}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{t("taxEnabled")}</Label>
                <Switch
                  checked={taxEnabled}
                  onCheckedChange={(checked) => setValue("taxEnabled", checked)}
                />
              </div>
              {taxEnabled && (
                <div className="space-y-2">
                  <Label>{t("taxPercentage")}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("taxPercentage", { valueAsNumber: true })}
                  />
                  {errors.taxPercentage && (
                    <p className="text-sm text-red-500">{errors.taxPercentage.message}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              {t("serviceChargeSettings")}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{t("serviceChargeEnabled")}</Label>
                <Switch
                  checked={serviceChargeEnabled}
                  onCheckedChange={(checked) =>
                    setValue("serviceChargeEnabled", checked)
                  }
                />
              </div>
              {serviceChargeEnabled && (
                <div className="space-y-2">
                  <Label>{t("serviceChargePercentage")}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("serviceChargePercentage", {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.serviceChargePercentage && (
                    <p className="text-sm text-red-500">
                      {errors.serviceChargePercentage.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              {t("receiptSettings")}
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("receiptHeader")}</Label>
                <Textarea rows={3} {...register("receiptHeader")} />
                {errors.receiptHeader && (
                  <p className="text-sm text-red-500">{errors.receiptHeader.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("receiptFooter")}</Label>
                <Textarea rows={3} {...register("receiptFooter")} />
                {errors.receiptFooter && (
                  <p className="text-sm text-red-500">{errors.receiptFooter.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              size="lg"
            >
              <Save className="w-5 h-5 ml-2" />
              {tCommon("save")}
            </Button>
          </div>

          {updateMutation.isSuccess && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {t("saveSuccess")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
