"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, ArrowRight, ToggleLeft, ToggleRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/lib/components/ui/dialog";
import { AppImageUpload } from "@/lib/components/app-image-upload";
import { ROUTES } from "@/lib/constants/routes";
import { ConfirmDialog } from "@/lib/components/ui/confirm-dialog";
import { EmptyState } from "@/lib/components/ui/empty-state";
import { LoadingOverlay } from "@/lib/components/ui/loading-overlay";
import { useCategories } from "@/features/categories/hooks";
import {
  useMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  useToggleAvailability,
  MenuItem,
} from "./hooks";
import { toast } from "sonner";
import { menuItemSchema, MenuItemFormData } from "./validation";

export default function MenuItemsPage() {
  const t = useTranslations("menuItems");
  const tCommon = useTranslations("common");
  const tVal = useTranslations("validation");
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);

  const { data: menuItems, isLoading: isLoadingItems } = useMenuItems();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const createMutation = useCreateMenuItem();
  const updateMutation = useUpdateMenuItem();
  const deleteMutation = useDeleteMenuItem();
  const toggleAvailabilityMutation = useToggleAvailability();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema(tVal)),
    defaultValues: {
      categoryId: 0,
      name: "",
      price: 0,
      image: undefined,
      notes: undefined,
      displayOrder: 0,
    },
  });

  const handleCreate = async (data: MenuItemFormData) => {
    await createMutation.mutateAsync(data);
    toast.success(t("createSuccess"));
    setIsCreateOpen(false);
    reset();
  };

  const handleEdit = async (data: MenuItemFormData) => {
    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, data });
      toast.success(t("updateSuccess"));
      setEditingItem(null);
      reset();
    }
  };

  const handleDelete = async () => {
    if (deletingItem) {
      await deleteMutation.mutateAsync(deletingItem.id);
      toast.success(t("deleteSuccess"));
      setDeletingItem(null);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    await toggleAvailabilityMutation.mutateAsync({
      id: item.id,
      isAvailable: !item.isAvailable,
    });
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    reset({
      categoryId: item.categoryId,
      name: item.name,
      price: item.price,
      image: item.image ?? undefined,
      notes: item.notes ?? undefined,
      displayOrder: item.displayOrder,
    });
  };

  const categoryOptions =
    categories?.map((c) => ({ value: c.id, label: c.name })) || [];

  if (isLoadingItems || isLoadingCategories) {
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
            <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-5 h-5 ml-2" />
            {t("title")}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {menuItems && menuItems.length === 0 ? (
          <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {tCommon("image")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {t("name")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {t("category")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {t("price")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {tCommon("status")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {tCommon("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menuItems?.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">—</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.categoryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        className={`flex items-center gap-1 ${
                          item.isAvailable ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {item.isAvailable ? (
                          <ToggleRight className="w-5 h-5" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                        {item.isAvailable ? t("available") : t("unavailable")}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(item)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingItem(item)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Dialog open={isCreateOpen} onOpenChange={(open) => { if (!open) { setIsCreateOpen(false); reset(); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("createTitle")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            <div className="space-y-2">
              <Label>{t("category")}</Label>
              <select
                {...register("categoryId", { valueAsNumber: true })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">{t("selectCategory")}</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-sm text-destructive">{errors.categoryId.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("name")}</Label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("price")}</Label>
              <Input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{tCommon("image")}</Label>
              <AppImageUpload
                value={watch("image")}
                onChange={(url) => setValue("image", url ?? "", { shouldValidate: true })}
                folder="menu-items"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("displayOrder")}</Label>
              <Input
                type="number"
                {...register("displayOrder", { valueAsNumber: true })}
              />
              {errors.displayOrder && (
                <p className="text-sm text-destructive">{errors.displayOrder.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("notes")}</Label>
              <Input {...register("notes")} />
              {errors.notes && (
                <p className="text-sm text-destructive">{errors.notes.message}</p>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsCreateOpen(false);
                  reset();
                }}
              >
                {tCommon("cancel")}
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? tCommon("loading") : tCommon("save")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItem} onOpenChange={(open) => { if (!open) { setEditingItem(null); reset(); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("editTitle")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
            <div className="space-y-2">
              <Label>{t("category")}</Label>
              <select
                {...register("categoryId", { valueAsNumber: true })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">{t("selectCategory")}</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-sm text-destructive">{errors.categoryId.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("name")}</Label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("price")}</Label>
              <Input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{tCommon("image")}</Label>
              <AppImageUpload
                value={watch("image")}
                onChange={(url) => setValue("image", url ?? "", { shouldValidate: true })}
                folder="menu-items"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("displayOrder")}</Label>
              <Input
                type="number"
                {...register("displayOrder", { valueAsNumber: true })}
              />
              {errors.displayOrder && (
                <p className="text-sm text-destructive">{errors.displayOrder.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("notes")}</Label>
              <Input {...register("notes")} />
              {errors.notes && (
                <p className="text-sm text-destructive">{errors.notes.message}</p>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingItem(null);
                  reset();
                }}
                >
                  {tCommon("cancel")}
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {tCommon("save")}
                </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDelete}
        title={t("deleteTitle")}
        message={t("deleteConfirm")}
        confirmText={tCommon("delete")}
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
