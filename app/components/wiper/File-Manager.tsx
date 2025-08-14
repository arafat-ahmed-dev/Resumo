"use client"
import {Input} from "~/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select"
import {Button} from "~/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card"
import {Badge} from "~/components/ui/badge"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "~/components/ui/table"

interface FileManagerProps {
    files: FSItem[]
    selectedFiles: Set<string>
    setSelectedFiles: (files: Set<string>) => void
    searchTerm: string
    setSearchTerm: (term: string) => void
    selectedCategory: string
    setSelectedCategory: (category: string) => void
    viewMode: "list" | "grid"
    setViewMode: (mode: "list" | "grid") => void
    onPreview: (file: FSItem) => void
    onDownload: (file: FSItem) => void
    onDelete: (file: FSItem) => void
    onBulkDelete: () => void
    formatFileSize: (bytes: number) => string
    formatDate: (timestamp: number) => string
    isDeleting: boolean
}

const FileManager = ({
                         files,
                         selectedFiles,
                         setSelectedFiles,
                         searchTerm,
                         setSearchTerm,
                         selectedCategory,
                         setSelectedCategory,

                         onPreview,
                         onDownload,
                         onDelete,
                         onBulkDelete,
                         formatFileSize,
                         formatDate,
                         isDeleting,
                     }: FileManagerProps) => {
    const FILE_TYPE_CATEGORIES = {
        images: ["image", "jpg", "jpeg", "png", "gif", "svg", "webp"],
        documents: ["pdf", "doc", "docx", "txt", "rtf", "odt"],
        media: ["audio", "video", "mp3", "mp4", "avi", "mov", "wav"],
        code: ["javascript", "typescript", "python", "java", "cpp", "html", "css", "json"],
        archives: ["zip", "rar", "tar", "gz", "7z"],
        data: ["csv", "xml", "sql", "database"],
    }

    const getFilteredFiles = () => {
        return files.filter((file) => {
            const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())

            if (selectedCategory === "all") return matchesSearch
            if (selectedCategory === "directories") return matchesSearch && file.is_dir

            const categoryTypes = FILE_TYPE_CATEGORIES[selectedCategory as keyof typeof FILE_TYPE_CATEGORIES]
            if (categoryTypes) {
                return matchesSearch && !file.is_dir && categoryTypes.includes(file.fileType || "")
            }

            return matchesSearch
        })
    }

    const getFileIcon = (file: FSItem) => {
        if (file.is_dir) {
            return (
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"
                    />
                </svg>
            )
        }

        switch (file.fileType) {
            case "image":
                return (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                )
            case "audio":
                return (
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                    </svg>
                )
            case "video":
                return (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                    </svg>
                )
            case "pdf":
                return (
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                )
            case "javascript":
            case "json":
                return (
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                    </svg>
                )
            default:
                return (
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                )
        }
    }

    const filteredFiles = getFilteredFiles()

    return (
        <>
            <Card className="bg-slate-800 border-slate-700 mb-6 sm:mb-8">
                <CardContent>
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Input
                                type="text"
                                placeholder="Search files and folders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-slate-700 border-slate-600 placeholder-slate-400 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger
                                    className="flex-1 sm:flex-none bg-slate-700 border-slate-600 text-slate-100">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent className="bg-slate-700 border-slate-600 text-slate-100">
                                    <SelectItem value="all">All Files</SelectItem>
                                    <SelectItem value="directories">Directories</SelectItem>
                                    <SelectItem value="images">Images</SelectItem>
                                    <SelectItem value="documents">Documents</SelectItem>
                                    <SelectItem value="media">Media</SelectItem>
                                    <SelectItem value="code">Code</SelectItem>
                                    <SelectItem value="archives">Archives</SelectItem>
                                    <SelectItem value="data">Data</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {selectedFiles.size > 0 && (
                        <div
                            className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 mt-4 sm:p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
              <span className="text-blue-300 font-medium text-sm sm:text-base">
                {selectedFiles.size} file{selectedFiles.size !== 1 ? "s" : ""} selected
              </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={onBulkDelete}
                                    disabled={isDeleting}
                                    className="flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                    Delete Selected
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedFiles(new Set())}
                                    className="text-slate-400 hover:text-slate-200"
                                >
                                    Clear Selection
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 mb-6 sm:mb-8">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                                />
                            </svg>
                            <CardTitle className="text-lg sm:text-xl text-slate-100">Your Files</CardTitle>
                            <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                                {filteredFiles.length} {filteredFiles.length === 1 ? "item" : "items"}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {filteredFiles.length === 0 ? (
                        <div className="text-center py-8 sm:py-12">
                            <div
                                className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <p className="text-slate-300 font-medium text-sm sm:text-base">
                                {searchTerm || selectedCategory !== "all" ? "No files match your filters" : "No files found"}
                            </p>
                            <p className="text-slate-500 text-xs sm:text-sm">
                                {searchTerm || selectedCategory !== "all"
                                    ? "Try adjusting your search or filters"
                                    : "Your storage is empty"}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-700">
                                    <TableHead className="w-12"></TableHead>
                                    <TableHead className="text-slate-300">Name</TableHead>
                                    <TableHead className="text-slate-300 hidden sm:table-cell">Size</TableHead>
                                    <TableHead className="text-slate-300 hidden md:table-cell">Modified</TableHead>
                                    <TableHead className="text-slate-300 w-32">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFiles.map((file) => (
                                    <TableRow key={file.id} className="border-slate-700 hover:bg-slate-700/50">
                                        <TableCell>
                                            <input
                                                type="checkbox"
                                                checked={selectedFiles.has(file.id)}
                                                onChange={(e) => {
                                                    const newSelected = new Set(selectedFiles)
                                                    if (e.target.checked) {
                                                        newSelected.add(file.id)
                                                    } else {
                                                        newSelected.delete(file.id)
                                                    }
                                                    setSelectedFiles(newSelected)
                                                }}
                                                className="w-4 h-4 text-blue-500 bg-slate-600 border-slate-500 rounded focus:ring-blue-500"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                                                    {getFileIcon(file)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-slate-100 truncate text-sm">{file.name}</p>
                                                        {file.shared && (
                                                            <Badge variant="secondary"
                                                                   className="bg-blue-800 text-blue-300 text-xs">
                                                                Shared
                                                            </Badge>
                                                        )}
                                                        {file.version && file.version > 1 && (
                                                            <Badge variant="secondary"
                                                                   className="bg-green-800 text-green-300 text-xs">
                                                                v{file.version}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-400 truncate">{file.path}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell text-slate-400 text-sm">
                                            {file.size ? formatFileSize(file.size) : "-"}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-slate-400 text-sm">
                                            {file.modified ? formatDate(file.modified) : "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button size="sm" variant="ghost" onClick={() => onPreview(file)}
                                                        className="h-8 w-8 p-0">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                         viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            stroke="text-gray-200"
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => onDownload(file)}
                                                        className="h-8 w-8 p-0">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                         viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        />
                                                    </svg>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => onDelete(file)}
                                                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                         viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </>
    )
}

export default FileManager
