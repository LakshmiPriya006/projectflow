
import React, { useState, useMemo } from 'react';
import { Search, Filter, MoreHorizontal, Download, Share2, Eye, CheckCircle, Clock, XCircle, AlertCircle, ChevronDown, ChevronRight, FileText, Folder, Calendar, User, Tag, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';

// Mock data for files - moved outside component since it's static
const mockFiles = [
{
  id: 'file-1',
  type: 'file',
  version: 'V4',
  name: 'EUPHORIA - GF OPTIONS',
  fileType: 'PDF',
  uploader: 'Rushal Sohail, Smart...',
  uploadDate: new Date('2024-05-29T20:30:00'),
  status: 'Approved',
  comments: 16,
  hasVersions: true
},
{
  id: 'file-2',
  type: 'file',
  version: 'V3',
  name: 'EUPHORIA - GF OPTIONS',
  fileType: 'PDF',
  uploader: 'Rushal Sohail, Smart...',
  uploadDate: new Date('2024-05-29T14:34:00'),
  status: 'Approved',
  comments: 2,
  parentId: 'file-1'
},
{
  id: 'file-3',
  type: 'file',
  version: 'V2',
  name: 'EUPHORIA - GF OPTIONS',
  fileType: 'PDF',
  uploader: 'Rushal Sohail, Smart...',
  uploadDate: new Date('2024-05-29T14:34:00'),
  status: 'Draft',
  comments: 0,
  parentId: 'file-1'
},
{
  id: 'file-4',
  type: 'file',
  version: 'V1',
  name: 'EUPHORIA - GF OPTIONS',
  fileType: 'PDF',
  uploader: 'Akash Parwani, Sama...',
  uploadDate: new Date('2024-05-21T19:09:00'),
  status: 'Approved',
  comments: 0,
  parentId: 'file-1',
  isHighlighted: true
},
{
  id: 'file-5',
  type: 'file',
  version: 'V1',
  name: 'EUPHORIA - SCHEME PLAN',
  fileType: 'PDF',
  uploader: 'Akash Parwani, Sama...',
  uploadDate: new Date('2024-05-21T19:09:00'),
  status: 'Approved',
  comments: 6
},
{
  id: 'file-6',
  type: 'file',
  version: 'V3',
  name: 'EUPHORIA - SF OPTIONS',
  fileType: 'PDF',
  uploader: 'System User, Smart...',
  uploadDate: new Date('2025-03-13T19:13:00'),
  status: 'Rejected',
  comments: 2
},
{
  id: 'file-7',
  type: 'file',
  version: 'V1',
  name: 'EUPHORIA - BEAM LAYOUT',
  fileType: 'PDF',
  uploader: 'Akash Parwani, Sama...',
  uploadDate: new Date('2024-05-22T11:48:00'),
  status: 'Reviewed',
  comments: 0
}];


export default function FileManager() {
  const [activeTab, setActiveTab] = useState('2D Layout / Adaptation');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUploader, setSelectedUploader] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [expandedFileId, setExpandedFileId] = useState('file-1');
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  // Mock data for project steps
  const projectSteps = [
  { id: 'recce', name: 'Recce', status: 'completed' },
  { id: 'design', name: 'Design', status: 'active' },
  { id: 'boq', name: 'BOQ', status: 'pending' },
  { id: 'order', name: 'Order', status: 'pending' },
  { id: 'work-progress', name: 'Work Progress', status: 'pending' },
  { id: 'snag', name: 'Snag', status: 'pending' },
  { id: 'finance', name: 'Finance', status: 'pending' }];


  // Mock data for tabs
  const tabs = [
  { id: '2d-layout', name: '2D Layout / Adaptation', count: 7, active: true },
  { id: '3d-layout', name: '3D Layout / Adaptation', count: 7 },
  { id: 'production', name: 'Production Files', count: 0 },
  { id: 'section-view', name: 'Section View', count: 1 },
  { id: 'plumbing', name: 'Plumbing Section View', count: 1 },
  { id: 'floor-plans', name: 'Floor Plans', count: 1 },
  { id: 'gfcs', name: 'GFCs', count: 1 },
  { id: '3d-render', name: '3D - Render', count: 0 }];


  // Filter files based on search and filter criteria
  const filteredFiles = useMemo(() => {
    let filtered = mockFiles;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by uploader
    if (selectedUploader) {
      filtered = filtered.filter((file) => file.uploader === selectedUploader);
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter((file) => file.status === selectedStatus);
    }

    return filtered;
  }, [searchQuery, selectedUploader, selectedStatus]);

  // Get unique uploaders for filter dropdown
  const uniqueUploaders = [...new Set(mockFiles.map((file) => file.uploader))];
  const uniqueStatuses = [...new Set(mockFiles.map((file) => file.status))];

  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'draft':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'reviewed':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="w-3 h-3" />;
      case 'draft':
        return <Clock className="w-3 h-3" />;
      case 'rejected':
        return <XCircle className="w-3 h-3" />;
      case 'reviewed':
        return <Eye className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const toggleFileExpansion = (fileId) => {
    setExpandedFileId(expandedFileId === fileId ? null : fileId);
  };

  const toggleFileSelection = (fileId) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const mainFiles = filteredFiles.filter((file) => !file.parentId);
  const getChildFiles = (parentId) => filteredFiles.filter((file) => file.parentId === parentId);

  return (
    <div className="min-h-screen bg-white border-t-4 border-gray-800">
      <div className="max-w-screen-xl mx-auto">
        {/* Project Stepper */}
        <div className="w-full bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full">
              {projectSteps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`relative flex items-center justify-center w-5 h-5 rounded-full border transition-all duration-300 ${
                        step.status === 'completed'
                          ? 'bg-cyan-400 border-cyan-400 shadow-[0_0_8px_theme(colors.cyan.300)]'
                          : step.status === 'active'
                          ? 'bg-cyan-400 border-cyan-400 shadow-[0_0_8px_theme(colors.cyan.300)]'
                          : 'bg-white border-slate-300'
                      }`}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : step.status !== 'active' && (
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                      )}
                      {step.status === 'active' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <span
                      className={`font-medium transition-colors duration-300 whitespace-nowrap ${
                        step.status === 'active' ? 'text-cyan-500' : 'text-slate-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < projectSteps.length - 1 && (
                    <div className="flex-grow h-px mx-4 border-t-2 border-dotted border-slate-300" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center space-x-2 pl-8">
              <div className="text-right p-2 rounded-lg bg-orange-50 border border-orange-200">
                <p className="text-xs text-gray-500">Design Status</p>
                <p className="font-semibold text-sm text-orange-600">Design Review</p>
              </div>
              <Button variant="outline" size="icon" className="border-slate-300">
                <MessageSquare className="w-5 h-5" />
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white px-4">
                <Share2 className="w-4 h-4 mr-2" />
                Actions
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="bg-white px-5 border-b border-slate-200">
          <div className="flex items-center overflow-x-auto">
            {tabs.map((tab, index) => (
              <React.Fragment key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center space-x-2 py-3 px-4 border-b-2 transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.name
                      ? 'border-red-500 text-gray-800'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="text-sm font-medium">{tab.name}</span>
                  {tab.count > 0 && (
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full ${
                        activeTab === tab.name ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
                {index < tabs.length - 1 && <div className="w-px h-4 bg-slate-300 self-center" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {activeTab === '2D Layout / Adaptation' ?
          <div className="space-y-6">
              {/* Search and Filter Bar */}
              <div className="bg-white rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Name of File
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                      placeholder="Search Name of File"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-100 border-slate-200 focus:border-blue-500 focus:ring-blue-500" />

                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Type of File
                    </label>
                    <Select defaultValue="">
                      <SelectTrigger className="bg-slate-100 border-slate-200">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="dwg">DWG</SelectItem>
                        <SelectItem value="jpg">JPG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Uploaded by
                    </label>
                    <Select value={selectedUploader} onValueChange={setSelectedUploader}>
                      <SelectTrigger className="bg-slate-100 border-slate-200">
                        <SelectValue placeholder="Select Uploaded by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={null}>All Uploaders</SelectItem>
                        {uniqueUploaders.map((uploader) =>
                      <SelectItem key={uploader} value={uploader}>
                            {uploader}
                          </SelectItem>
                      )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Uploaded On
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                      placeholder="Uploaded on"
                      className="pl-10 bg-slate-100 border-slate-200"
                      readOnly />

                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Status
                    </label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="bg-slate-100 border-slate-200">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={null}>All Statuses</SelectItem>
                        {uniqueStatuses.map((status) =>
                      <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                      )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* File List */}
              <div className="bg-white rounded-lg overflow-hidden">
                {/* Folder Header */}
                <div className="bg-slate-100 border-b border-slate-200 px-6 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                      checked={false}
                      className="border-slate-400" />

                      <span className="font-semibold text-slate-900">2D Layout / Adaptation</span>
                      <Badge variant="secondary" className="bg-slate-200 text-slate-600">
                        7 Files
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* File Rows */}
                <div className="divide-y divide-slate-100">
                  {mainFiles.map((file) => {
                  const childFiles = getChildFiles(file.id);
                  const isExpanded = expandedFileId === file.id;
                  const isSelected = selectedFiles.has(file.id);

                  return (
                    <div key={file.id}>
                        {/* Main File Row */}
                        <div
                        className={`hover:bg-slate-50 transition-colors duration-200 ${file.hasVersions ? 'cursor-pointer' : ''}`}
                        onClick={() => file.hasVersions && toggleFileExpansion(file.id)}>

                          <div className={`px-6 py-3 ${isExpanded ? 'border-l-4 border-red-500' : ''}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleFileSelection(file.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="border-slate-400" />


                              <div className="flex items-center space-x-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-red-100 text-red-600 text-xs font-bold">
                                  {file.version}
                                </span>
                                <FileText className="w-5 h-5 text-red-500" />
                                <div className="flex items-center">
                                  <span className="font-medium text-slate-900">{file.name}</span>
                                  {file.comments > 0 &&
                                  <div className="ml-2 flex items-center space-x-1 text-sm text-slate-500">
                                      <MessageSquare className="w-4 h-4" />
                                      <span>{file.comments}</span>
                                    </div>
                                  }
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-6">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
                                  {file.uploader.charAt(0)}
                                </div>
                                <span className="text-sm text-slate-600">{file.uploader}</span>
                              </div>
                              <div className="text-sm text-slate-600">
                                {format(file.uploadDate, 'dd MMM yyyy, h:mm a')}
                              </div>
                              <Badge className={`inline-flex items-center space-x-1 border ${getStatusBadgeColor(file.status)}`}>
                                {getStatusIcon(file.status)}
                                <span>{file.status}</span>
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="hover:bg-slate-100" onClick={(e) => e.stopPropagation()}>
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View</DropdownMenuItem>
                                  <DropdownMenuItem>Download</DropdownMenuItem>
                                  <DropdownMenuItem>Share</DropdownMenuItem>
                                  <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          </div>
                        </div>

                        {/* Previous Versions */}
                        {isExpanded &&
                      <div className="bg-slate-50/50 pl-10">
                            <div className="px-6 py-2 border-y border-slate-200">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-600">Previous versions</span>
                                <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {e.stopPropagation();toggleFileExpansion(file.id);}}
                              className="text-slate-500 hover:text-slate-700">

                                  <XCircle className="w-5 h-5" />
                                </Button>
                              </div>
                            </div>
                            {childFiles.map((childFile) =>
                        <div key={childFile.id} className={`hover:bg-white transition-colors duration-200 ${
                        childFile.isHighlighted ? 'border-l-4 border-red-500' : ''}`
                        }>
                                <div className="px-6 py-3 ml-8">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4 flex-1">
                                    <Checkbox
                                  checked={selectedFiles.has(childFile.id)}
                                  onCheckedChange={() => toggleFileSelection(childFile.id)}
                                  className="border-slate-400" />

                                    <div className="flex items-center space-x-3">
                                      <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-red-100 text-red-600 text-xs font-bold">
                                        {childFile.version}
                                      </span>
                                      <FileText className="w-5 h-5 text-red-500" />
                                      <div className="flex items-center">
                                        <span className="font-medium text-slate-900">{childFile.name}</span>
                                        {childFile.comments > 0 &&
                                    <div className="ml-2 flex items-center space-x-1 text-sm text-slate-500">
                                            <MessageSquare className="w-4 h-4" />
                                            <span>{childFile.comments}</span>
                                            </div>
                                    }
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-6">
                                    <div className="flex items-center space-x-2">
                                       <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
                                          {childFile.uploader.charAt(0)}
                                        </div>
                                      <span className="text-sm text-slate-600">{childFile.uploader}</span>
                                    </div>
                                    <div className="text-sm text-slate-600">
                                      {format(childFile.uploadDate, 'dd MMM yyyy, h:mm a')}
                                    </div>
                                    <Badge className={`inline-flex items-center space-x-1 border ${getStatusBadgeColor(childFile.status)}`}>
                                      {getStatusIcon(childFile.status)}
                                      <span>{childFile.status}</span>
                                    </Badge>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                                          <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>View</DropdownMenuItem>
                                        <DropdownMenuItem>Download</DropdownMenuItem>
                                        <DropdownMenuItem>Share</DropdownMenuItem>
                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                                </div>
                              </div>
                        )}
                          </div>
                      }
                      </div>);

                })}
                </div>
              </div>
            </div> :

          <div className="bg-white rounded-lg p-12">
              <div className="text-center">
                <Folder className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-lg text-slate-500 mb-2">No files to display in this section</p>
                <p className="text-sm text-slate-400">
                  Switch to "2D Layout / Adaptation" to view available files
                </p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

}
