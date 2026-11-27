"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  IconWifi as Wifi,
  IconWifiOff as WifiOff,
  IconRefresh as RefreshCw,
  IconCloudDownload as CloudDownload,
  IconCircleCheck as CheckCircle2,
} from "@tabler/icons-react";
import { offlineDb } from "../lib/offlineDb";
import { syncEngine } from "../lib/syncEngine";

export function OfflineSyncBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [packageCount, setPackageCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const refreshState = async () => {
    setIsOffline(syncEngine.isOffline());
    try {
      const [queue, pkgs] = await Promise.all([
        offlineDb.getSyncQueue(),
        offlineDb.getAllPackages(),
      ]);
      setPendingCount(queue.length);
      setPackageCount(pkgs.length);
    } catch {
      // IndexedDB not ready during SSR
    }
  };

  useEffect(() => {
    syncEngine.registerServiceWorker();
    refreshState();
    return syncEngine.subscribe(refreshState);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleToggleOffline = () => {
    syncEngine.setSimulatedOffline(!isOffline);
  };

  const handleManualSync = async () => {
    if (isOffline) return;
    setSyncing(true);
    await syncEngine.synchronizePendingOperations();
    await refreshState();
    setSyncing(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Topbar Icon Button matching Message & Notification icons */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        title={
          isOffline
            ? `Offline Mode (${packageCount} Packs Cached)`
            : `Online • PWA Sync Ready (${packageCount} Packs Cached)`
        }
        aria-label="Offline Sync & Pack Status"
        className={`w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm transition-colors relative cursor-pointer ${
          isOffline
            ? "text-amber-600 hover:text-amber-700 ring-2 ring-amber-300"
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        {isOffline ? (
          <WifiOff className="w-5 h-5" />
        ) : syncing ? (
          <RefreshCw className="w-5 h-5 animate-spin text-[#146ef5]" />
        ) : (
          <CloudDownload className="w-5 h-5" />
        )}

        {/* Status Indicator Dot (Emerald = synced, Blue = pending sync, Amber = offline) */}
        <span
          className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-2 border-white ${
            isOffline
              ? "bg-amber-500"
              : pendingCount > 0
              ? "bg-[#146ef5]"
              : "bg-emerald-500"
          }`}
        />
      </button>

      {/* Dropdown Popover */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 z-50 text-xs space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-100">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                isOffline
                  ? "bg-amber-500 text-white"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5" /> Offline Mode Active
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5" /> Online • PWA Sync Ready
                </>
              )}
            </span>

            <span className="text-[11px] font-extrabold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-full">
              {packageCount} Pack{packageCount === 1 ? "" : "s"} Cached
            </span>
          </div>

          <div className="space-y-1.5">
            {pendingCount > 0 ? (
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-blue-50/80 text-[#146ef5] font-bold">
                <span>
                  {pendingCount} Pending Sync Operation{pendingCount === 1 ? "" : "s"}
                </span>
                {!isOffline && (
                  <button
                    type="button"
                    onClick={handleManualSync}
                    disabled={syncing}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#146ef5] hover:bg-[#105bd1] text-white text-[11px] font-extrabold transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`} />
                    {syncing ? "Syncing..." : "Sync Now"}
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-emerald-50/70 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All Progress Synchronized</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleToggleOffline}
              className={`flex-1 py-2 px-3 rounded-xl font-extrabold border transition-colors cursor-pointer ${
                isOffline
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200"
              }`}
            >
              {isOffline ? "Reconnect Online" : "Simulate Offline"}
            </button>

            <Link
              href="/dashboard/downloads"
              onClick={() => setOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#146ef5] font-extrabold transition-colors"
            >
              <CloudDownload className="w-3.5 h-3.5" /> Offline Packs
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
