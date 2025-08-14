"use client"

import {useState} from "react"

interface DangerZoneProps {
    files: FSItem[]
    formatFileSize: (bytes: number) => string
    onWipeAll: () => void
    isWiping: boolean
}

const DangerZone = ({files, formatFileSize, onWipeAll, isWiping}: DangerZoneProps) => {
    const [showWipeConfirmation, setShowWipeConfirmation] = useState(false)
    const [wipeConfirmText, setWipeConfirmText] = useState("")

    const getTotalSize = (): number => {
        return files.reduce((total, file) => total + (file.size || 0), 0)
    }

    const handleWipeConfirm = () => {
        if (wipeConfirmText === "DELETE ALL MY DATA") {
            onWipeAll()
            setShowWipeConfirmation(false)
            setWipeConfirmText("")
        }
    }

    return (
        <>
            {/* Danger Zone - Enhanced mobile layout */}
            <div className="bg-slate-800 border-2 border-red-800 rounded-2xl shadow-2xl p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                    </svg>
                    <h2 className="text-lg sm:text-xl font-semibold text-red-300">Danger Zone</h2>
                </div>

                <div className="bg-red-900/30 border border-red-800 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="text-red-300 font-medium mb-2 text-sm sm:text-base">⚠️ This action cannot be
                        undone</p>
                    <p className="text-red-400 text-xs sm:text-sm">
                        This will permanently delete all your files ({formatFileSize(getTotalSize())}), clear your
                        key-value
                        storage, and remove all version history. Make sure you have backed up any important data before
                        proceeding.
                    </p>
                </div>

                <button
                    onClick={() => setShowWipeConfirmation(true)}
                    disabled={isWiping || files.length === 0}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:bg-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                    {isWiping ? (
                        <>
                            <div
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Wiping Data...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                            Wipe All Data
                        </>
                    )}
                </button>
            </div>

            {/* Wipe Confirmation Modal - Enhanced mobile layout */}
            {showWipeConfirmation && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div
                        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-md mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-red-300">Confirm Data Wipe</h3>
                                <p className="text-red-400 text-sm">This action is irreversible</p>
                            </div>
                        </div>

                        <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 sm:p-4 mb-4">
                            <p className="text-red-300 text-sm sm:text-base mb-2">You are about to permanently
                                delete:</p>
                            <ul className="text-red-400 text-xs sm:text-sm space-y-1">
                                <li>• {files.length} files and folders</li>
                                <li>• {formatFileSize(getTotalSize())} of storage</li>
                                <li>• All version history</li>
                                <li>• All key-value data</li>
                                <li>• All sharing permissions</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Type <span className="font-bold text-red-400">"DELETE ALL MY DATA"</span> to confirm:
                            </label>
                            <input
                                type="text"
                                value={wipeConfirmText}
                                onChange={(e) => setWipeConfirmText(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                                placeholder="DELETE ALL MY DATA"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <button
                                onClick={() => {
                                    setShowWipeConfirmation(false)
                                    setWipeConfirmText("")
                                }}
                                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleWipeConfirm}
                                disabled={wipeConfirmText !== "DELETE ALL MY DATA"}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-500 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
                            >
                                Wipe All Data
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default DangerZone
