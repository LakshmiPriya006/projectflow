
import React, { useState, useMemo } from 'react';
import './../styles/FileManager.scss';
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
        return 'status-badge-approved';
      case 'draft':
        return 'status-badge-draft';
      case 'rejected':
        return 'status-badge-rejected';
      case 'reviewed':
        return 'status-badge-reviewed';
      default:
        return 'status-badge-default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="status-icon" />;
      case 'draft':
        return <Clock className="status-icon" />;
      case 'rejected':
        return <XCircle className="status-icon" />;
      case 'reviewed':
        return <Eye className="status-icon" />;
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
    <div className="file-manager-container">
      <div className="file-manager-content">
        {/* Project Stepper */}
        <div className="project-stepper">
          <div className="project-stepper-inner">
            <div className="project-steps">
              {projectSteps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="step">
                    <div
                      className={`step-icon ${
                        step.status === 'completed'
                          ? 'step-icon-completed'
                          : step.status === 'active'
                          ? 'step-icon-active'
                          : 'step-icon-pending'
                      }`}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle className="step-icon-check" />
                      ) : step.status !== 'active' && (
                        <div className="step-icon-dot step-icon-dot-pending"></div>
                      )}
                      {step.status === 'active' && <div className="step-icon-dot step-icon-dot-active"></div>}
                    </div>
                    <span
                      className={`step-name ${
                        step.status === 'active' ? 'step-name-active' : 'step-name-pending'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < projectSteps.length - 1 && (
                    <div className="stepper-divider" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="project-actions">
              <div className="design-status">
                <p className="design-status-label">Design Status</p>
                <p className="design-status-value">Design Review</p>
              </div>
              <Button variant="outline" size="icon" className="action-button">
                <MessageSquare className="action-button-icon" />
              </Button>
              <Button className="primary-action-button">
                <Share2 className="primary-action-icon" />
                Actions
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <div className="tab-navigation-inner">
            {tabs.map((tab, index) => (
              <React.Fragment key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.name)}
                  className={`tab-button ${
                    activeTab === tab.name
                      ? 'tab-button-active'
                      : 'tab-button-inactive'
                  }`}
                >
                  <span className="tab-name">{tab.name}</span>
                  {tab.count > 0 && (
                    <span
                      className={`tab-count ${
                        activeTab === tab.name ? 'tab-count-active' : 'tab-count-inactive'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
                {index < tabs.length - 1 && <div className="tab-divider" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {activeTab === '2D Layout / Adaptation' ?
          <div className="files-container">
              {/* Search and Filter Bar */}
              <div className="search-filter-bar">
                <div className="search-filter-grid">
                  <div className="form-field">
                    <label className="form-label">
                      Name of File
                    </label>
                    <div className="input-container">
                      <Search className="search-icon" />
                      <Input
                      placeholder="Search Name of File"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-input" />

                    </div>
                  </div>
                  <div>
                    <label className="form-label">
                      Type of File
                    </label>
                    <Select defaultValue="">
                      <SelectTrigger className="select-trigger">
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
                    <label className="form-label">
                      Uploaded by
                    </label>
                    <Select value={selectedUploader} onValueChange={setSelectedUploader}>
                      <SelectTrigger className="select-trigger">
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
                    <label className="form-label">
                      Uploaded On
                    </label>
                    <div className="input-container">
                      <Calendar className="calendar-icon" />
                      <Input
                      placeholder="Uploaded on"
                      className="text-input"
                      readOnly />

                    </div>
                  </div>
                  <div>
                    <label className="form-label">
                      Status
                    </label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="select-trigger">
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
              <div className="file-list-container">
                {/* Folder Header */}
                <div className="folder-header">
                  <div className="folder-header-inner">
                    <div className="folder-info">
                      <Checkbox
                      checked={false}
                      className="folder-checkbox" />

                      <span className="folder-name">2D Layout / Adaptation</span>
                      <Badge variant="secondary" className="folder-badge">
                        7 Files
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="more-button" />
                    </Button>
                  </div>
                </div>

                {/* File Rows */}
                <div className="file-rows-container">
                  {mainFiles.map((file) => {
                  const childFiles = getChildFiles(file.id);
                  const isExpanded = expandedFileId === file.id;
                  const isSelected = selectedFiles.has(file.id);

                  return (
                    <div key={file.id}>
                        {/* Main File Row */}
                        <div
                        className={`file-row ${file.hasVersions ? 'file-row-clickable' : ''}`}
                        onClick={() => file.hasVersions && toggleFileExpansion(file.id)}>

                          <div className={`file-row-inner ${isExpanded ? 'file-row-expanded' : ''}`}>
                          <div className="file-row-content">
                            <div className="file-info">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleFileSelection(file.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="file-checkbox" />


                              <div className="file-details">
                                <span className="file-version">
                                  {file.version}
                                </span>
                                <FileText className="file-icon" />
                                <div className="file-name-container">
                                  <span className="file-name">{file.name}</span>
                                  {file.comments > 0 &&
                                  <div className="file-comments">
                                      <MessageSquare className="file-comment-icon" />
                                      <span>{file.comments}</span>
                                    </div>
                                  }
                                </div>
                              </div>
                            </div>
                            <div className="file-metadata">
                              <div className="uploader-info">
                                <div className="uploader-avatar">
                                  {file.uploader.charAt(0)}
                                </div>
                                <span className="uploader-name">{file.uploader}</span>
                              </div>
                              <div className="upload-date">
                                {format(file.uploadDate, 'dd MMM yyyy, h:mm a')}
                              </div>
                              <Badge className={`status-badge ${getStatusBadgeColor(file.status)}`}>
                                {getStatusIcon(file.status)}
                                <span>{file.status}</span>
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="file-actions-button" onClick={(e) => e.stopPropagation()}>
                                    <MoreHorizontal className="more-button" />
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
                      <div className="previous-versions-container">
                            <div className="previous-versions-header">
                              <div className="previous-versions-header-inner">
                                <span className="previous-versions-title">Previous versions</span>
                                <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {e.stopPropagation();toggleFileExpansion(file.id);}}
                              className="close-versions-button">

                                  <XCircle className="close-versions-icon" />
                                </Button>
                              </div>
                            </div>
                            {childFiles.map((childFile) =>
                        <div key={childFile.id} className={`child-file-row ${
                        childFile.isHighlighted ? 'child-file-row-highlighted' : ''}`
                        }>
                                <div className="child-file-row-inner">
                                <div className="file-row-content">
                                  <div className="file-info">
                                    <Checkbox
                                  checked={selectedFiles.has(childFile.id)}
                                  onCheckedChange={() => toggleFileSelection(childFile.id)}
                                  className="file-checkbox" />

                                    <div className="file-details">
                                      <span className="file-version">
                                        {childFile.version}
                                      </span>
                                      <FileText className="file-icon" />
                                      <div className="file-name-container">
                                        <span className="file-name">{childFile.name}</span>
                                        {childFile.comments > 0 &&
                                    <div className="file-comments">
                                            <MessageSquare className="file-comment-icon" />
                                            <span>{childFile.comments}</span>
                                            </div>
                                    }
                                      </div>
                                    </div>
                                  </div>
                                  <div className="file-metadata">
                                    <div className="uploader-info">
                                       <div className="uploader-avatar">
                                          {childFile.uploader.charAt(0)}
                                        </div>
                                      <span className="uploader-name">{childFile.uploader}</span>
                                    </div>
                                    <div className="upload-date">
                                      {format(childFile.uploadDate, 'dd MMM yyyy, h:mm a')}
                                    </div>
                                    <Badge className={`status-badge ${getStatusBadgeColor(childFile.status)}`}>
                                      {getStatusIcon(childFile.status)}
                                      <span>{childFile.status}</span>
                                    </Badge>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="file-actions-button">
                                          <MoreHorizontal className="more-button" />
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

          <div className="empty-state-container">
              <div className="empty-state-content">
                <Folder className="empty-state-icon" />
                <p className="empty-state-title">No files to display in this section</p>
                <p className="empty-state-subtitle">
                  Switch to "2D Layout / Adaptation" to view available files
                </p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

}
