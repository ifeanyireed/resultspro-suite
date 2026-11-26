"use client";

import React, { useEffect, useState } from "react";
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
    <div
      className={`mx-6 mt-4 mb-1 px-4 py-2.5 rounded-2xl border flex flex-wrap items-center justify-between gap-3 text-xs transition-colors ${
        isOffline
          ? "bg-amber-50 border-amber-200 text-amber-900"
          : "bg-white border-gray-100 text-gray-700 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${
            isOffline
              ? "bg-amber-500 text-white"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          {isOffline ? (
            <>
              <WifiOff className="w-3.5 h-3.5" /> Offline Mode (IndexedDB Active)
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5" /> Online • PWA Sync Ready
            </>
          )}
        </span>

        <span className="text-gray-600 font-medium">
          <strong>{packageCount}</strong> NERDC Pack{packageCount === 1 ? "" : "s"} Cached
        </span>

        {pendingCount > 0 ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#146ef5] font-bold">
            {pendingCount} Pending Sync Operation{pendingCount === 1 ? "" : "s"}
          </span>
        ) : (
          <span className="hidden sm:inline-flex items-center gap-1 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> All Progress Synchronized
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {pendingCount > 0 && !isOffline && (
          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#146ef5] hover:bg-[#105bd1] text-white font-bold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Synchronizing..." : "Sync Now"}
          </button>
        )}

        <button
          onClick={handleToggleOffline}
          className={`px-3 py-1 rounded-lg font-bold border transition-colors ${
            isOffline
              ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
              : "bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200"
          }`}
        >
          {isOffline ? "Reconnect Online" : "Simulate Offline"}
        </button>

        <Link
          href="/dashboard/downloads"
          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#146ef5] font-bold transition-colors"
        >
          <CloudDownload className="w-3.5 h-3.5" /> Offline Manager
        </Link>
      </div>
    </div>
  );
}
