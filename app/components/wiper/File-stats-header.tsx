import {Link} from "react-router";
import React from "react";

interface FileStatsHeaderProps {
    user: PuterUser | null
    files: FSItem[]
    formatFileSize: (bytes: number) => string
}

const FileStatsHeader = ({user, files, formatFileSize}: FileStatsHeaderProps) => {
    const getFileTypeStats = () => {
        const FILE_TYPE_CATEGORIES = {
            images: ["image", "jpg", "jpeg", "png", "gif", "svg", "webp"],
            documents: ["pdf", "doc", "docx", "txt", "rtf", "odt"],
            media: ["audio", "video", "mp3", "mp4", "avi", "mov", "wav"],
            code: ["javascript", "typescript", "python", "java", "cpp", "html", "css", "json"],
            archives: ["zip", "rar", "tar", "gz", "7z"],
            data: ["csv", "xml", "sql", "database"],
        }

        return files.reduce(
            (acc, file) => {
                if (file.is_dir) {
                    acc.directories = (acc.directories || 0) + 1
                } else {
                    acc.files = (acc.files || 0) + 1
                    const type = file.fileType || "other"

                    for (const [category, types] of Object.entries(FILE_TYPE_CATEGORIES)) {
                        if (types.includes(type)) {
                            acc[category] = (acc[category] || 0) + 1
                            break
                        }
                    }
                }
                return acc
            },
            {} as Record<string, number>,
        )
    }

    const getTotalSize = (): number => {
        return files.reduce((total, file) => total + (file.size || 0), 0)
    }

    const stats = getFileTypeStats()

    return (
        <>
            {/* Header */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-6 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <div className="flex items-center justify-between w-full gap-3 sm:gap-4">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                                <img src="/images/server.png" alt="server"
                                     className="object-cover"/>
                            </div>
                            <div>
                                <p className="sm:text-xl font-bold text-slate-100">Puter Cloud Storage
                                    Manager</p>
                                <p className="text-sm sm:text-base text-slate-400">
                                    Manage your cloud files with version control and sharing
                                </p>
                            </div>
                        </div>
                        <Link
                            className="text-white text-sm font-semibold md:text-left text-right border-1 p-2 rounded-xl overflow-hidden"
                            to="/">
                            Back To Homepage
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-700 rounded-lg px-3 py-2 w-fit">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                    <span>
            Authenticated as: <span className="font-semibold text-slate-200">{user?.username || "Guest"}</span>
          </span>
                </div>
            </div>

            {/* Stats Grid - Enhanced responsiveness */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <span className="text-slate-400 text-xs font-medium">Files</span>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-slate-100">{stats.files || 0}</p>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"
                            />
                        </svg>
                        <span className="text-slate-400 text-xs font-medium">Folders</span>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-slate-100">{stats.directories || 0}</p>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <span className="text-slate-400 text-xs font-medium">Images</span>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-slate-100">{stats.images || 0}</p>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <span className="text-slate-400 text-xs font-medium">Documents</span>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-slate-100">{stats.documents || 0}</p>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <svg
                            className="w-4 h-4 text-yellow-400 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                            />
                        </svg>
                        <span className="text-slate-400 text-xs font-medium">Code</span>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-slate-100">{stats.code || 0}</p>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <svg
                            className="w-4 h-4 text-purple-400 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                            />
                        </svg>
                        <span className="text-slate-400 text-xs font-medium">Storage</span>
                    </div>
                    <p className="text-sm sm:text-lg font-bold text-slate-100">{formatFileSize(getTotalSize())}</p>
                </div>
            </div>
        </>
    )
}

export default FileStatsHeader
