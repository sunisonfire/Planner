import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  FileJson,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  HardDrive,
  Sparkles,
  RefreshCw,
  Eye,
  X,
  FileCode2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BackupInspectionSummary } from '../../utils/storage';
import { Modal } from '../common/Modal';

export const BackupRestoreCard: React.FC = () => {
  const {
    exportBackup,
    importBackup,
    inspectBackup,
    storageUsageKB,
    subjects,
    tasks,
    goals,
    events,
    grades,
    playSound,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Status message
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Inspection modal state
  const [inspectionData, setInspectionData] = useState<{
    summary: BackupInspectionSummary;
    rawJson: string;
  } | null>(null);

  // Manual JSON Copy/Paste Modal
  const [isManualJsonModalOpen, setIsManualJsonModalOpen] = useState(false);
  const [manualJsonText, setManualJsonText] = useState('');
  const [copiedRawJson, setCopiedRawJson] = useState(false);

  const handleExportClick = () => {
    try {
      exportBackup();
      setStatusMessage({
        type: 'success',
        text: '¡Copia de seguridad exportada y descargada exitosamente en formato JSON!',
      });
      setTimeout(() => setStatusMessage(null), 5000);
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Error al exportar los datos. Por favor inténtalo de nuevo.',
      });
    }
  };

  const processFileContent = (jsonText: string) => {
    const summary = inspectBackup(jsonText);
    if (!summary.isValid) {
      playSound('delete');
      setStatusMessage({
        type: 'error',
        text: summary.error || 'El archivo seleccionado no es un JSON válido de UniPlanner.',
      });
      return;
    }

    playSound('pop');
    setInspectionData({
      summary,
      rawJson: jsonText,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processFileContent(text);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setStatusMessage({
        type: 'error',
        text: 'Por favor arrastra únicamente archivos con extensión .json',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processFileContent(text);
    };
    reader.readAsText(file);
  };

  const confirmImport = () => {
    if (!inspectionData) return;

    const result = importBackup(inspectionData.rawJson);
    setInspectionData(null);

    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: '¡Copia de seguridad restaurada con éxito! Todos tus datos han sido actualizados.',
      });
      setTimeout(() => setStatusMessage(null), 6000);
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'No se pudieron importar los datos.',
      });
    }
  };

  const handleOpenManualJson = () => {
    playSound('pop');
    setIsManualJsonModalOpen(true);
    setManualJsonText('');
  };

  const handleApplyManualJson = () => {
    if (!manualJsonText.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Por favor pega el código JSON que deseas importar.',
      });
      return;
    }
    setIsManualJsonModalOpen(false);
    processFileContent(manualJsonText.trim());
  };

  const handleCopyCurrentJSON = () => {
    try {
      const currentData = {
        app: 'UniPlanner',
        version: '1.2.0',
        exportedAt: new Date().toISOString(),
        subjects,
        tasks,
        goals,
        events,
        grades,
      };
      navigator.clipboard.writeText(JSON.stringify(currentData, null, 2));
      setCopiedRawJson(true);
      playSound('success');
      setTimeout(() => setCopiedRawJson(false), 3000);
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'No se pudo copiar al portapapeles.',
      });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      {/* Header with Title and Local Storage Size */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileJson className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
              Copia de Seguridad & Restauración (Backup) 📦
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Transfiere toda tu información académica entre tus dispositivos de manera segura y 100% offline.
          </p>
        </div>

        {/* Local Storage Indicator Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-750 shrink-0 self-start sm:self-auto">
          <HardDrive className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            Almacenamiento: <strong className="text-slate-900 dark:text-white">{storageUsageKB} KB</strong>
          </span>
        </div>
      </div>

      {/* Status feedback message */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Action Cards: Export & Import Dropzone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Export Action Card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 flex flex-col justify-between space-y-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Exportar copia de seguridad
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Descarga un archivo <code className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">.json</code> con tus materias, tareas, metas, exámenes y fórmulas de notas.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              id="backup-export-file-btn"
              type="button"
              onClick={handleExportClick}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              Descargar archivo JSON
            </button>
            <button
              id="backup-copy-json-btn"
              type="button"
              onClick={handleCopyCurrentJSON}
              title="Copiar JSON al portapapeles"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
            >
              {copiedRawJson ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span className="hidden sm:inline">Copiar texto</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. Import Dropzone Card */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`p-5 rounded-2xl border-2 border-dashed transition-all flex flex-col justify-between space-y-4 ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 scale-[1.01]'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 hover:border-indigo-300 dark:hover:border-indigo-800'
          }`}
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Restaurar o importar copia
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Arrastra y suelta tu archivo <code className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-[11px] font-mono text-purple-600 dark:text-purple-400 font-bold">.json</code> aquí o selecciónalo desde tu almacenamiento.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              id="backup-import-file-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95"
            >
              <Upload className="w-4 h-4" />
              Seleccionar archivo .json
            </button>
            <button
              id="backup-paste-json-btn"
              type="button"
              onClick={handleOpenManualJson}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
            >
              <FileCode2 className="w-4 h-4 text-purple-500" />
              <span className="hidden sm:inline">Pegar JSON</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Inspection Modal before applying import */}
      <Modal
        isOpen={!!inspectionData}
        onClose={() => setInspectionData(null)}
        title="Verificar Copia de Seguridad 🔍"
        subtitle="Revisa el contenido del archivo antes de restaurarlo"
      >
        {inspectionData && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  Estudiante en archivo:
                </span>
                <strong className="text-indigo-700 dark:text-indigo-300 font-bold">
                  {inspectionData.summary.studentName || 'Estudiante'}
                </strong>
              </div>
              {inspectionData.summary.exportedAt && (
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    Fecha de exportación:
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    {new Date(inspectionData.summary.exportedAt).toLocaleString('es-CO')}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  Versión del esquema:
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  v{inspectionData.summary.version}
                </span>
              </div>
            </div>

            {/* Grid of contents to restore */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Elementos que se cargarán en tu aplicación:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center border border-slate-200/60 dark:border-slate-750">
                  <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                    {inspectionData.summary.subjectsCount}
                  </span>
                  <p className="text-[10px] text-slate-400">Materias</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center border border-slate-200/60 dark:border-slate-750">
                  <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                    {inspectionData.summary.tasksCount}
                  </span>
                  <p className="text-[10px] text-slate-400">Tareas</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center border border-slate-200/60 dark:border-slate-750">
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    {inspectionData.summary.goalsCount}
                  </span>
                  <p className="text-[10px] text-slate-400">Metas</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center border border-slate-200/60 dark:border-slate-750">
                  <span className="text-base font-extrabold text-purple-600 dark:text-purple-400">
                    {inspectionData.summary.eventsCount}
                  </span>
                  <p className="text-[10px] text-slate-400">Eventos</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Al restaurar esta copia, se actualizarán tus materias, tareas y configuraciones actuales con la información de este archivo.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setInspectionData(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancelar
              </button>
              <button
                id="backup-confirm-restore-btn"
                type="button"
                onClick={confirmImport}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
              >
                Sí, restaurar datos
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Manual JSON Paste Modal */}
      <Modal
        isOpen={isManualJsonModalOpen}
        onClose={() => setIsManualJsonModalOpen(false)}
        title="Pegar código JSON de copia 📋"
        subtitle="Pega el contenido exportado desde otro navegador o dispositivo"
      >
        <div className="space-y-4">
          <textarea
            id="backup-manual-json-textarea"
            rows={8}
            value={manualJsonText}
            onChange={(e) => setManualJsonText(e.target.value)}
            placeholder='Pega aquí el contenido JSON... ej. { "app": "UniPlanner", ... }'
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsManualJsonModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Cancelar
            </button>
            <button
              id="backup-apply-pasted-json-btn"
              type="button"
              onClick={handleApplyManualJson}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
            >
              Verificar y cargar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
