"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/lib/components/ui/dialog";
import { ConfirmDialog } from "@/lib/components/ui/confirm-dialog";
import { EmptyState } from "@/lib/components/ui/empty-state";
import { LoadingOverlay } from "@/lib/components/ui/loading-overlay";
import {
  useTables,
  useCreateTable,
  useUpdateTable,
  useDeleteTable,
  Table,
} from "./hooks";
import { tableSchema, TableFormData } from "./validation";

export default function TablesPage() {
  const t = useTranslations("tables");
  const tCommon = useTranslations("common");
  const tVal = useTranslations("validation");
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [deletingTable, setDeletingTable] = useState<Table | null>(null);

  const { data: tables, isLoading } = useTables();
  const createMutation = useCreateTable();
  const updateMutation = useUpdateTable();
  const deleteMutation = useDeleteTable();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TableFormData>({
    resolver: zodResolver(tableSchema(tVal)),
    defaultValues: {
      number: 0,
    },
  });

  const handleCreate = async (data: TableFormData) => {
    await createMutation.mutateAsync(data);
    setIsCreateOpen(false);
    reset();
  };

  const handleEdit = async (data: TableFormData) => {
    if (editingTable) {
      await updateMutation.mutateAsync({ id: editingTable.id, data });
      setEditingTable(null);
      reset();
    }
  };

  const handleDelete = async () => {
    if (deletingTable) {
      await deleteMutation.mutateAsync(deletingTable.id);
      setDeletingTable(null);
    }
  };

  const openEditDialog = (table: Table) => {
    setEditingTable(table);
    reset({ number: table.number });
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
            <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-5 h-5 ml-2" />
            {t("createTitle")}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {tables && tables.length === 0 ? (
          <EmptyState
            title={t("emptyTitle")}
            description={t("emptyDescription")}
          />
        ) : (
          <div className="bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("number")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {tCommon("status")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {tCommon("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tables?.map((table) => (
                  <tr key={table.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {table.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          table.isOccupied
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {table.isOccupied ? t("occupied") : t("available")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(table)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingTable(table)}
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

      <Dialog open={isCreateOpen} onOpenChange={(open) => !open && (setIsCreateOpen(false), reset())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("createTitle")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            <div className="space-y-2">
              <Label>{t("number")}</Label>
              <Input
                type="number"
                {...register("number", { valueAsNumber: true })}
              />
              {errors.number?.message && (
                <p className="text-sm text-red-500">{errors.number.message}</p>
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
                {tCommon("save")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingTable} onOpenChange={(open) => !open && (setEditingTable(null), reset())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editTitle")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
            <div className="space-y-2">
              <Label>{t("number")}</Label>
              <Input
                type="number"
                {...register("number", { valueAsNumber: true })}
              />
              {errors.number?.message && (
                <p className="text-sm text-red-500">{errors.number.message}</p>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingTable(null);
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
        isOpen={!!deletingTable}
        onClose={() => setDeletingTable(null)}
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
