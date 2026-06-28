import { createCustomer, updateCustomer } from "@/features/customers/actions/create-customer";
import { User, Mail, Phone, MapPin, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition";

const inputClassReadonly =
  "w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-600 outline-none";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

interface CustomerFormProps {
  mode?: "create" | "edit" | "view";
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
    street?: string | null;
    city?: string | null;
    postalCode?: string | null;
    notes?: string | null;
  };
}

export function CustomerForm({ mode = "create", customer }: CustomerFormProps) {
  const t = useTranslations("customers");
  const isReadonly = mode === "view";
  const action = mode === "create" ? createCustomer : updateCustomer;

  return (
    <form id="customer-form" action={action} className="space-y-5">
      {mode !== "create" && customer && (
        <input type="hidden" name="id" value={customer.id} />
      )}
      
      <div className="grid grid-cols-2 gap-5">
        {/* Left Column - Personal Info & Notes */}
        <div className="col-span-1 space-y-5">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{t("personalInformation")}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t("firstName")}</label>
                <input 
                  name="firstName" 
                  placeholder="John" 
                  className={isReadonly ? inputClassReadonly : inputClass} 
                  defaultValue={customer?.firstName}
                  readOnly={isReadonly}
                  required={!isReadonly}
                />
              </div>
              <div>
                <label className={labelClass}>{t("lastName")}</label>
                <input 
                  name="lastName" 
                  placeholder="Doe" 
                  className={isReadonly ? inputClassReadonly : inputClass} 
                  defaultValue={customer?.lastName}
                  readOnly={isReadonly}
                  required={!isReadonly}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5"><Mail size={12} />{t("email")}</span>
                </label>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  className={isReadonly ? inputClassReadonly : inputClass} 
                  defaultValue={customer?.email || ""}
                  readOnly={isReadonly}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5"><Phone size={12} />{t("phone")}</span>
                </label>
                <input 
                  name="phone" 
                  type="tel" 
                  placeholder="+49 000 000 0000" 
                  className={isReadonly ? inputClassReadonly : inputClass} 
                  defaultValue={customer?.phone || ""}
                  readOnly={isReadonly}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{t("notes")}</h2>
            </div>
            <textarea
              name="notes"
              rows={4}
              placeholder="Additional notes about the customer..."
              className={isReadonly ? inputClassReadonly : inputClass}
              defaultValue={customer?.notes || ""}
              readOnly={isReadonly}
            />
          </div>
        </div>

        {/* Right Column - Address */}
        <div className="col-span-1">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{t("address")}</h2>
            </div>

            <div>
              <label className={labelClass}>{t("street")}</label>
              <input 
                name="street" 
                placeholder="Musterstraße 1" 
                className={isReadonly ? inputClassReadonly : inputClass} 
                defaultValue={customer?.street || ""}
                readOnly={isReadonly}
              />
            </div>


            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t("postalCode")}</label>
                  <input 
                    name="postalCode" 
                    placeholder="10115" 
                    className={isReadonly ? inputClassReadonly : inputClass} 
                    defaultValue={customer?.postalCode || ""}
                    readOnly={isReadonly}
                  />
                </div>

                <div>
                  <label className={labelClass}>{t("city")}</label>
                  <input 
                    name="city" 
                    placeholder="Berlin" 
                    className={isReadonly ? inputClassReadonly : inputClass} 
                    defaultValue={customer?.city || ""}
                    readOnly={isReadonly}
                  />
                </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
