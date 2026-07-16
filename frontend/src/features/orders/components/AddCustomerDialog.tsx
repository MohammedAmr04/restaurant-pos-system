"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/ui/dialog";
import { useCreateCustomer } from "@/features/customers/hooks";

interface AddCustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated: (customerId: number) => void;
}

export function AddCustomerDialog({
  isOpen,
  onClose,
  onCustomerCreated,
}: AddCustomerDialogProps) {
  const t = useTranslations("customers");
  const tCommon = useTranslations("common");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const createCustomerMutation = useCreateCustomer();

  const handleSave = async () => {
    if (!name.trim()) return;

    const result = await createCustomerMutation.mutateAsync({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim() || undefined,
    });

    setName("");
    setPhone("");
    setAddress("");
    onCustomerCreated(result.id);
  };

  const handleClose = () => {
    setName("");
    setPhone("");
    setAddress("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("addCustomer")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("name")} *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("phone")}</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("phonePlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("address")}</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("addressPlaceholder")}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>
              {tCommon("cancel")}
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim() || createCustomerMutation.isPending}
            >
              {tCommon("save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
