"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Mail, ShieldCheck, Save, Upload, Calendar, Phone, IdCard, Building, Briefcase, MapPin, UserCheck, Bell, X } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

const roleColors: Record<string, string> = {
  EMPLOYEE:   "bg-slate-100 text-slate-600",
  MANAGER:    "bg-blue-100 text-blue-600",
  SUPERVISOR: "bg-emerald-100 text-emerald-600",
  ADMIN:      "bg-violet-100 text-violet-600",
};

interface UserFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId: string;
  dateOfBirth: string;
  gender: "male" | "female";
  profilePicture: string | null;
  
  // Account Information
  username: string;
  password: string;
  confirmPassword: string;
  changePasswordOnFirstLogin: boolean;
  accountStatus: boolean;
  accountEndDate: string;
  
  // Organization Information
  department: string;
  position: string;
  workplace: string;
  manager: string;
  startDate: string;
  description: string;
  
  // Role and Permissions
  roles: string[];
}

interface UserFormProps {
  mode?: "create" | "edit" | "view";
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phone?: string;
    nationalId?: string;
    dateOfBirth?: string;
    gender?: string;
    department?: string;
    position?: string;
    workplace?: string;
    manager?: string;
    startDate?: string;
    description?: string;
    username?: string;
    accountStatus?: boolean;
    accountEndDate?: string;
  };
}

export function UserFormComprehensive({ mode = "create", user }: UserFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    // Personal Information
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    nationalId: user?.nationalId || "",
    dateOfBirth: user?.dateOfBirth || "",
    gender: (user?.gender as "male" | "female") || "male",
    profilePicture: null,
    
    // Account Information
    username: user?.username || "",
    password: "",
    confirmPassword: "",
    changePasswordOnFirstLogin: false,
    accountStatus: user?.accountStatus ?? true,
    accountEndDate: user?.accountEndDate || "",
    
    // Organization Information
    department: user?.department || "",
    position: user?.position || "",
    workplace: user?.workplace || "",
    manager: user?.manager || "",
    startDate: user?.startDate || "",
    description: user?.description || "",
    
    // Role and Permissions
    roles: user?.role ? [user.role] : [],
  });

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [availableRoles] = useState([
    { id: "ADMIN", label: "Sistem Yöneticisi" },
    { id: "SUPERVISOR", label: "Süpervizör" },
    { id: "MANAGER", label: "Yönetici" },
    { id: "EMPLOYEE", label: "Personel" },
  ]);

  const [departments] = useState([
    "Satış", "Pazarlama", "İnsan Kaynakları", "Finans", "Üretim", "IT", "Lojistik"
  ]);

  const [positions] = useState([
    "Genel Müdür", "Müdür", "Süpervizör", "Uzman", "Uzman Yardımcısı", "Personel"
  ]);

  const [workplaces] = useState([
    "Merkez Ofis", "Fabrika A", "Fabrika B", "Depo", "Satış Ofisi"
  ]);

  const [managers] = useState([
    "Ahmet Yılmaz", "Mehmet Demir", "Ayşe Kaya", "Ali Çelik"
  ]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        nationalId: user.nationalId || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: (user.gender as "male" | "female") || "male",
        profilePicture: null,
        username: user.username || "",
        password: "",
        confirmPassword: "",
        changePasswordOnFirstLogin: false,
        accountStatus: user.accountStatus ?? true,
        accountEndDate: user.accountEndDate || "",
        department: user.department || "",
        position: user.position || "",
        workplace: user.workplace || "",
        manager: user.manager || "",
        startDate: user.startDate || "",
        description: user.description || "",
        roles: user.role ? [user.role] : [],
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
        setFormData(prev => ({ ...prev, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoleToggle = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter(r => r !== roleId)
        : [...prev.roles, roleId]
    }));
  };

  const handleRoleRemove = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.filter(r => r !== roleId)
    }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const body: any = {
      ...formData,
      primaryRole: formData.roles[0] || "EMPLOYEE",
    };

    if (mode === "create") {
      await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
          ...body,
          action: "update",
          id: user?.id,
        }),
      });
    }

    setLoading(false);
    router.push("/users");
  }

  const isReadonly = mode === "view";

  return (
    <form id="user-form" onSubmit={handleSubmit} className="space-y-5">
      {mode !== "create" && user && (
        <input type="hidden" name="id" value={user.id} />
      )}

      <div className="grid grid-cols-12 gap-5">
        {/* Top Row - Personal Info, Organization Info, Account Info, Summary */}
        <div className="col-span-3 space-y-5">
          {/* Personal Information Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Kişisel Bilgiler</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className={labelClass}>Ad</label>
                <input 
                  name="firstName" 
                  placeholder="Ad" 
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={isReadonly ? inputClass + " bg-slate-100" : inputClass} 
                  readOnly={isReadonly}
                  required={!isReadonly}
                />
              </div>
              <div>
                <label className={labelClass}>Soyad</label>
                <input 
                  name="lastName" 
                  placeholder="Soyad" 
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={isReadonly ? inputClass + " bg-slate-100" : inputClass} 
                  readOnly={isReadonly}
                  required={!isReadonly}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5"><Mail size={12} />E-posta</span>
                </label>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="email@example.com" 
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={isReadonly ? inputClass + " bg-slate-100" : inputClass} 
                  readOnly={isReadonly}
                  required={!isReadonly}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5"><Phone size={12} />Telefon</span>
                </label>
                <input 
                  name="phone" 
                  placeholder="+90 555 123 4567" 
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={isReadonly ? inputClass + " bg-slate-100" : inputClass} 
                  readOnly={isReadonly}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5"><IdCard size={12} />T.C. Kimlik No</span>
                </label>
                <input 
                  name="nationalId" 
                  placeholder="11 haneli TC Kimlik No" 
                  value={formData.nationalId}
                  onChange={(e) => handleInputChange("nationalId", e.target.value)}
                  className={isReadonly ? inputClass + " bg-slate-100" : inputClass} 
                  readOnly={isReadonly}
                  maxLength={11}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5"><Calendar size={12} />Doğum Tarihi</span>
                </label>
                <input 
                  name="dateOfBirth" 
                  type="date" 
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className={isReadonly ? inputClass + " bg-slate-100" : inputClass} 
                  readOnly={isReadonly}
                />
              </div>
              <div>
                <label className={labelClass}>Cinsiyet</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={(e) => handleInputChange("gender", e.target.value as "male")}
                      disabled={isReadonly}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="text-sm text-slate-700">Erkek</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={(e) => handleInputChange("gender", e.target.value as "female")}
                      disabled={isReadonly}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="text-sm text-slate-700">Kadın</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3 space-y-5">
          {/* Organization Information Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Building size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Organizasyon Bilgileri</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5"><Briefcase size={12} />Departman</span>
                </label>
                <select 
                  name="department" 
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  className={isReadonly ? inputClass + " bg-slate-100" : inputClass} 
                  disabled={isReadonly}
                >
                  <option value="">Seçiniz</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5"><MapPin size={12} />Pozisyon</span>
                </label>
                <select 
                  name="position" 
                  value={formData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  className={isReadonly ? inputClass + " bg-slate-100" : inputClass} 
                  disabled={isReadonly}
                >
                  <option value="">Seçiniz</option>
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Çalışma Yeri</label>
                <select 
                  name="workplace" 
                  value={formData.workplace}
                  onChange={(e) => handleInputChange("workplace", e.target.value)}
                  className={isReadonly ? inputClass + " bg-slate-100" : inputClass} 
                  disabled={isReadonly}
                >
                  <option value="">Seçiniz</option>
                  {workplaces.map(wp => (
                    <option key={wp} value={wp}>{wp}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5"><UserCheck size={12} />Yönetici</span>
                </label>
                <select 
                  name="manager" 
                  value={formData.manager}
                  onChange={(e) => handleInputChange("manager", e.target.value)}
                  className={isReadonly ? inputClass + " bg-slate-100" : inputClass} 
                  disabled={isReadonly}
                >
                  <option value="">Seçiniz</option>
                  {managers.map(mgr => (
                    <option key={mgr} value={mgr}>{mgr}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5"><Calendar size={12} />İşe Giriş Tarihi</span>
                </label>
                <input 
                  name="startDate" 
                  type="date" 
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className={isReadonly ? inputClass + " bg-slate-100" : inputClass} 
                  readOnly={isReadonly}
                />
              </div>
              <div>
                <label className={labelClass}>Açıklama</label>
                <textarea 
                  name="description" 
                  placeholder="Ek açıklama..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className={isReadonly ? inputClass + " bg-slate-100 min-h-[60px]" : inputClass + " min-h-[60px]"} 
                  readOnly={isReadonly}
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3 space-y-5">
          {/* Account Information Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Hesap Bilgileri</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className={labelClass}>Kullanıcı Adı</label>
                <input 
                  name="username" 
                  placeholder="kullaniciadi" 
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className={isReadonly ? inputClass + " bg-slate-100" : inputClass} 
                  readOnly={isReadonly}
                />
              </div>

              <div>
                <label className={labelClass}>Hesap Durumu</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => !isReadonly && handleInputChange("accountStatus", !formData.accountStatus)}
                    disabled={isReadonly}
                    className={`relative w-12 h-6 rounded-full transition-colors ${formData.accountStatus ? 'bg-emerald-500' : 'bg-slate-300'} ${isReadonly ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.accountStatus ? 'translate-x-6' : ''}`} />
                  </button>
                  <span className="text-sm text-slate-700">{formData.accountStatus ? 'Aktif' : 'Pasif'}</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Hesap Bitiş Tarihi</label>
                <input 
                  name="accountEndDate" 
                  type="date" 
                  value={formData.accountEndDate}
                  onChange={(e) => handleInputChange("accountEndDate", e.target.value)}
                  className={isReadonly ? inputClass + " bg-slate-100" : inputClass} 
                  readOnly={isReadonly}
                />
              </div>
            </div>
          </div>

          {/* Role and Permissions Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Rol ve Yetkiler</h2>
            </div>

            <div>
              <label className={labelClass}>Rol</label>
              <select 
                name="role" 
                value={formData.roles[0] || ""}
                onChange={(e) => handleInputChange("roles", e.target.value ? [e.target.value] : [])}
                className={isReadonly ? inputClass + " bg-slate-100" : inputClass} 
                disabled={isReadonly}
              >
                <option value="">Seçiniz</option>
                {availableRoles.map(role => (
                  <option key={role.id} value={role.id}>{role.label}</option>
                ))}
              </select>
            </div>

            <p className="text-xs text-slate-500">Rol ve yetki detaylarını kaydettikten sonra düzenleyebilirsiniz.</p>

            {!isReadonly && (
              <button
                type="button"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Rol Detaylarını Düzenle
              </button>
            )}
          </div>
        </div>

        <div className="col-span-3 space-y-5">
          {/* Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Özet</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Kişi</p>
                <p className="text-sm font-medium text-slate-800">{formData.firstName} {formData.lastName}</p>
                <p className="text-xs text-slate-600">{formData.email}</p>
                <p className="text-xs text-slate-600">{formData.phone || '-'}</p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500 mb-1">Departman</p>
                <p className="text-sm font-medium text-slate-800">{formData.department || '-'}</p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500 mb-1">Pozisyon</p>
                <p className="text-sm font-medium text-slate-800">{formData.position || '-'}</p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500 mb-1">Rol</p>
                <div className="flex flex-wrap gap-1">
                  {formData.roles.map(roleId => {
                    const role = availableRoles.find(r => r.id === roleId);
                    return (
                      <span
                        key={roleId}
                        className={`text-xs px-2 py-1 rounded-full ${roleColors[roleId]}`}
                      >
                        {role?.label}
                      </span>
                    );
                  })}
                  {formData.roles.length === 0 && (
                    <span className="text-xs text-slate-400">-</span>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500 mb-1">Hesap Durumu</p>
                <p className={`text-sm font-medium ${formData.accountStatus ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formData.accountStatus ? 'Aktif' : 'Pasif'}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500 mb-1">İşe Giriş Tarihi</p>
                <p className="text-sm font-medium text-slate-800">
                  {formData.startDate ? new Date(formData.startDate).toLocaleDateString('tr-TR') : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Note */}
        <div className="col-span-12">
          {/* Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Bell size={16} className="text-amber-600 mt-0.5" />
            <p className="text-sm text-amber-800">
              Kullanıcı kaydedildikten sonra sistem tarafından bilgilendirme e-postası gönderilecektir.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
