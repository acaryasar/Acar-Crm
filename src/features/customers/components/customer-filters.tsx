"use client";

import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function CustomerFilters() {
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerGroup, setCustomerGroup] = useState("all");
  const [status, setStatus] = useState("all");
  const [city, setCity] = useState("all");
  const [responsiblePerson, setResponsiblePerson] = useState("all");

  const handleClear = () => {
    setSearchTerm("");
    setCustomerGroup("all");
    setStatus("all");
    setCity("all");
    setResponsiblePerson("all");
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm font-medium text-slate-700">Filtreler</span>
        {isOpen ? (
          <ChevronUp size={18} className="text-slate-500" />
        ) : (
          <ChevronDown size={18} className="text-slate-500" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 pt-2">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Müşteri ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            {/* Customer Group Dropdown */}
            <div className="min-w-[150px]">
              <select
                value={customerGroup}
                onChange={(e) => setCustomerGroup(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              >
                <option value="all">Tümü</option>
                <option value="corporate">Kurumsal</option>
                <option value="sme">KOBİ</option>
                <option value="individual">Bireysel</option>
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="min-w-[150px]">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              >
                <option value="all">Tümü</option>
                <option value="active">Aktif</option>
                <option value="passive">Pasif</option>
              </select>
            </div>

            {/* City Dropdown */}
            <div className="min-w-[150px]">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              >
                <option value="all">Tümü</option>
                <option value="istanbul">İstanbul</option>
                <option value="ankara">Ankara</option>
                <option value="izmir">İzmir</option>
                <option value="bursa">Bursa</option>
                <option value="antalya">Antalya</option>
              </select>
            </div>

            {/* Responsible Person Dropdown */}
            <div className="min-w-[150px]">
              <select
                value={responsiblePerson}
                onChange={(e) => setResponsiblePerson(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              >
                <option value="all">Tümü</option>
                <option value="ahmet">Ahmet Yılmaz</option>
                <option value="mehmet">Mehmet Demir</option>
                <option value="elif">Elif Kaya</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleClear}
                className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
              >
                <X size={16} />
                Temizle
              </button>
              <button className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
                Filtrele
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
