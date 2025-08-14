"use client"

import {Fragment, useEffect, useState} from "react"
import FileStatsHeader from "~/components/wiper/File-stats-header"
import FileManager from "~/components/wiper/File-Manager"
import {usePuterStore} from "~/lib/puter";
import DangerZone from "~/components/wiper/Danger-zone";
import {useNavigate} from "react-router";

const WipeApp = () => {
    const {auth, isLoading, error, clearError, fs, ai, kv} = usePuterStore()
    const [files, setFiles] = useState<FSItem[]>([]);
    const [errors, setErrors] = useState("")
    const navigate = useNavigate()
    const [isDeleting, setIsDeleting] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [viewMode, setViewMode] = useState<"list" | "grid">("list")
    const [previewFile, setPreviewFile] = useState<FSItem | null>(null)
    const [deleteConfirmation, setDeleteConfirmation] = useState<
        { type: "single"; file: FSItem } | { type: "bulk"; files: FSItem[] } | null
    >(null)
    const [isWiping, setIsWiping] = useState(false)


    // Protected this Page/......./
    useEffect(() => {
        if (!isLoading) {
            if (!auth.isAuthenticated) {
                navigate("/auth?next=/wipe");
            } else if (auth.user?.username !== "arafat457") {
                setErrors("Unauthorized User Detect.");
            }
        }
    }, [isLoading]);

    useEffect(() => {
        const demoFiles: FSItem[] = [
            {
                id: "1",
                uid: "file_001",
                name: "project-proposal.pdf",
                path: "/documents/project-proposal.pdf",
                is_dir: false,
                parent_id: "root",
                parent_uid: "root_uid",
                created: Date.now() - 86400000 * 5,
                modified: Date.now() - 86400000 * 2,
                accessed: Date.now() - 86400000,
                size: 2048576,
                writable: true,
                fileType: "pdf",
                shared: true,
                version: 2,
                permissions: ["read", "write"],
            },
            {
                id: "2",
                uid: "file_002",
                name: "vacation-photos",
                path: "/photos/vacation-photos",
                is_dir: true,
                parent_id: "root",
                parent_uid: "root_uid",
                created: Date.now() - 86400000 * 10,
                modified: Date.now() - 86400000 * 3,
                accessed: Date.now() - 86400000,
                size: null,
                writable: true,
                shared: false,
                permissions: ["read", "write", "delete"],
            },
            {
                id: "3",
                uid: "file_003",
                name: "app.js",
                path: "/projects/my-app/app.js",
                is_dir: false,
                parent_id: "proj_001",
                parent_uid: "proj_001_uid",
                created: Date.now() - 86400000 * 7,
                modified: Date.now() - 86400000,
                accessed: Date.now() - 3600000,
                size: 15420,
                writable: true,
                fileType: "javascript",
                shared: false,
                version: 5,
                permissions: ["read", "write"],
            },
            {
                id: "4",
                uid: "file_004",
                name: "presentation.pptx",
                path: "/work/presentation.pptx",
                is_dir: false,
                parent_id: "work_001",
                parent_uid: "work_001_uid",
                created: Date.now() - 86400000 * 3,
                modified: Date.now() - 86400000,
                accessed: Date.now() - 7200000,
                size: 5242880,
                writable: true,
                fileType: "presentation",
                shared: true,
                version: 1,
                permissions: ["read"],
            },
            {
                id: "5",
                uid: "file_005",
                name: "music-collection",
                path: "/media/music-collection",
                is_dir: true,
                parent_id: "media_001",
                parent_uid: "media_001_uid",
                created: Date.now() - 86400000 * 30,
                modified: Date.now() - 86400000 * 5,
                accessed: Date.now() - 86400000 * 2,
                size: null,
                writable: true,
                shared: false,
                permissions: ["read", "write"],
            },
            {
                id: "6",
                uid: "file_006",
                name: "database-backup.sql",
                path: "/backups/database-backup.sql",
                is_dir: false,
                parent_id: "backup_001",
                parent_uid: "backup_001_uid",
                created: Date.now() - 86400000,
                modified: Date.now() - 86400000,
                accessed: Date.now() - 43200000,
                size: 104857600,
                writable: false,
                fileType: "database",
                shared: false,
                version: 1,
                permissions: ["read"],
            },
        ]
        setFiles(demoFiles)
    }, [])

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    const formatDate = (timestamp: number): string => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const handlePreview = (file: FSItem) => {
        setPreviewFile(file)
    }

    const handleDownload = async (file: FSItem) => {
        try {
            // Mock download functionality
            console.log(`Downloading ${file.name}...`)
            // In real implementation: await fs.download(file.path)
        } catch (error) {
            console.error("Download failed:", error)
        }
    }

    const handleDelete = (file: FSItem) => {
        setDeleteConfirmation({type: "single", file})
    }

    const handleBulkDelete = () => {
        const filesToDelete = files.filter((file) => selectedFiles.has(file.id))
        setDeleteConfirmation({type: "bulk", files: filesToDelete})
    }

    const confirmDelete = async () => {
        if (!deleteConfirmation) return

        setIsDeleting(true)
        try {
            if (deleteConfirmation.type === "single") {
                // Mock delete functionality
                console.log(`Deleting ${deleteConfirmation.file.name}...`)
                setFiles((prev) => prev.filter((f) => f.id !== deleteConfirmation.file.id))
            } else {
                // Mock bulk delete functionality
                console.log(`Deleting ${deleteConfirmation.files.length} files...`)
                const idsToDelete = new Set(deleteConfirmation.files.map((f) => f.id))
                setFiles((prev) => prev.filter((f) => !idsToDelete.has(f.id)))
                setSelectedFiles(new Set())
            }
        } catch (error) {
            console.error("Delete failed:", error)
        } finally {
            setIsDeleting(false)
            setDeleteConfirmation(null)
        }
    }

    const handleWipeAll = async () => {
        setIsWiping(true)
        try {
            // Mock wipe functionality
            console.log("Wiping all data...")
            await new Promise((resolve) => setTimeout(resolve, 2000))
            setFiles([])
            setSelectedFiles(new Set())
        } catch (error) {
            console.error("Wipe failed:", error)
        } finally {
            setIsWiping(false)
        }
    }

    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-300 text-lg">Loading your files...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div
                    className="bg-slate-800 border border-red-700 rounded-2xl shadow-2xl p-6 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-red-300 mb-2">Connection Error</h2>
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                        onClick={clearError}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }
    if (errors) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div
                    className="bg-slate-800 border border-red-700 rounded-2xl shadow-2xl p-6 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-red-300 mb-2">Connection Error</h2>
                    <p className="text-red-400 mb-4">{errors}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Go Back :
                        <Fragment></Fragment>)
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
                <FileStatsHeader user={auth.user} files={files} formatFileSize={formatFileSize}/>

                <FileManager
                    files={files}
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    onPreview={handlePreview}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    onBulkDelete={handleBulkDelete}
                    formatFileSize={formatFileSize}
                    formatDate={formatDate}
                    isDeleting={isDeleting}
                />

                <DangerZone files={files} formatFileSize={formatFileSize} onWipeAll={handleWipeAll}
                            isWiping={isWiping}/>

                {/* File Preview Modal - Enhanced mobile layout */}
                {previewFile && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div
                            className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg sm:text-xl font-bold text-slate-100 truncate">{previewFile.name}</h3>
                                <button
                                    onClick={() => setPreviewFile(null)}
                                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
                                >
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>

                            <div className="bg-slate-700 rounded-lg p-4 mb-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-slate-400">Path:</span>
                                        <p className="text-slate-200 break-all">{previewFile.path}</p>
                                    </div>
                                    {previewFile.size && (
                                        <div>
                                            <span className="text-slate-400">Size:</span>
                                            <p className="text-slate-200">{formatFileSize(previewFile.size)}</p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-slate-400">Modified:</span>
                                        <p className="text-slate-200">{formatDate(previewFile.modified)}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Type:</span>
                                        <p className="text-slate-200">
                                            {previewFile.is_dir ? "Directory" : previewFile.fileType || "File"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                    onClick={() => handleDownload(previewFile)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    Download
                                </button>
                                <button
                                    onClick={() => setPreviewFile(null)}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal - Enhanced mobile layout */}
                {deleteConfirmation && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div
                            className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-md">
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-red-300">Confirm Deletion</h3>
                                    <p className="text-red-400 text-sm">This action cannot be undone</p>
                                </div>
                            </div>

                            <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 sm:p-4 mb-4">
                                {deleteConfirmation.type === "single" ? (
                                    <div>
                                        <p className="text-red-300 text-sm sm:text-base mb-2">You are about to
                                            delete:</p>
                                        <p className="text-red-400 font-medium text-sm sm:text-base">{deleteConfirmation.file.name}</p>
                                        {deleteConfirmation.file.size && (
                                            <p className="text-red-400 text-xs sm:text-sm">
                                                Size: {formatFileSize(deleteConfirmation.file.size)}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-red-300 text-sm sm:text-base mb-2">
                                            You are about to delete {deleteConfirmation.files.length} files:
                                        </p>
                                        <div className="max-h-32 overflow-y-auto">
                                            {deleteConfirmation.files.map((file) => (
                                                <p key={file.id} className="text-red-400 text-xs sm:text-sm truncate">
                                                    • {file.name}
                                                </p>
                                            ))}
                                        </div>
                                        <p className="text-red-400 text-xs sm:text-sm mt-2">
                                            Total
                                            size: {formatFileSize(deleteConfirmation.files.reduce((sum, f) => sum + (f.size || 0), 0))}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <button
                                    onClick={() => setDeleteConfirmation(null)}
                                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors text-sm sm:text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-500 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WipeApp
