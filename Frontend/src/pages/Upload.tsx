import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload as UploadIcon, FileText, Download, Check, AlertCircle, Clock, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [processing, setProcessing] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  // Sample CSV data for preview
  const sampleData = [
    { species: "Bluefin Tuna", location: "Pacific Ocean", depth: "200m", count: 15 },
    { species: "Great White Shark", location: "Atlantic Ocean", depth: "50m", count: 3 },
    { species: "Clownfish", location: "Coral Reef", depth: "10m", count: 45 },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const allowedTypes = ['text/csv', 'application/json', 'text/plain'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.fasta')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV, JSON, or FASTA file.",
        variant: "destructive"
      });
      return;
    }

    const fileId = Math.random().toString(36).substr(2, 9);
    const newFile = {
      id: fileId,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading' as const,
      uploadedAt: new Date().toLocaleString()
    };

    setUploadedFiles(prev => [...prev, newFile]);
    setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev[fileId] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          setUploadedFiles(prevFiles => 
            prevFiles.map(f => 
              f.id === fileId ? { ...f, status: 'completed' as const } : f
            )
          );

          // Parse file for preview (first 4 rows)
          const reader = new FileReader();
          reader.onload = (e) => {
            let rows: any[] = [];
            if (file.type === 'application/json' || file.name.endsWith('.json')) {
              try {
                const json = JSON.parse(e.target?.result as string);
                if (Array.isArray(json)) {
                  rows = json.slice(0, 10);
                }
              } catch {
                toast({
                  title: "Invalid JSON",
                  description: "Could not parse JSON file.",
                  variant: "destructive"
                });
              }
            } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
              const text = e.target?.result as string;
              const lines = text.split('\n').filter(Boolean);
              if (lines.length > 1) {
                const headers = lines[0].split(',').map(h => h.trim());
                rows = lines.slice(1, 11).map(line => {
                  const values = line.split(',');
                  const obj: any = {};
                  headers.forEach((h, i) => obj[h] = values[i]);
                  return obj;
                });
              }
            }
            // You can add FASTA parsing here if needed

            if (rows.length > 0) setPreviewData(rows);
          };

          if (file.type === 'application/json' || file.name.endsWith('.json')) {
            reader.readAsText(file);
          } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
            reader.readAsText(file);
          }
          // Add FASTA support if needed

          toast({
            title: "File uploaded successfully",
            description: `${file.name} is ready for processing.`
          });
          return prev;
        }
        return { ...prev, [fileId]: currentProgress + 10 };
      });
    }, 200);
  };

  const handleSubmit = () => {
    const completedFiles = uploadedFiles.filter(f => f.status === 'completed');
    if (completedFiles.length === 0) {
      toast({
        title: "No files ready",
        description: "Please upload and complete file processing before submitting.",
        variant: "destructive"
      });
      return;
    }

    // Start processing
    completedFiles.forEach(file => {
      setProcessing(prev => ({ ...prev, [file.id]: true }));
      setUploadedFiles(prevFiles => 
        prevFiles.map(f => 
          f.id === file.id ? { ...f, status: 'processing' as const } : f
        )
      );
    });

    // Simulate processing
    setTimeout(() => {
      completedFiles.forEach(file => {
        setProcessing(prev => ({ ...prev, [file.id]: false }));
        setUploadedFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === file.id ? { ...f, status: 'processed' as const } : f
          )
        );
      });
      
      toast({
        title: "Data processed successfully",
        description: `${completedFiles.length} file(s) have been analyzed and stored in the database.`
      });
    }, 3000);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
    toast({
      title: "File removed",
      description: "File has been removed from the upload queue."
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed': return <Check className="h-4 w-4 text-green-500" />;
      case 'processing': return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'processed': return <Check className="h-4 w-4 text-green-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'processed': return 'bg-green-100 text-green-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadTemplate = () => {
    const csvContent = "species,location,depth,count\nBluefin Tuna,Pacific Ocean,200m,15\nGreat White Shark,Atlantic Ocean,50m,3";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marine_data_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-ocean bg-clip-text text-transparent">
            Upload Marine Data
          </h1>
          <p className="text-xl text-muted-foreground">
            Upload your CSV, JSON, or FASTA files for analysis
          </p>
        </div>

        <div className="grid gap-6">
          {/* File Upload Card */}
          <Card className="border-2 border-dashed hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UploadIcon className="h-5 w-5 mr-2" />
                File Upload
              </CardTitle>
              <CardDescription>
                Drag and drop your files here or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Input
                  type="file"
                  accept=".csv,.json,.fasta"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-ocean rounded-full flex items-center justify-center">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      {uploadedFiles.length > 0 ? `${uploadedFiles.length} file(s) in queue` : "Choose files or drag them here"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supports CSV, JSON, and FASTA formats (multiple files allowed)
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <Button onClick={downloadTemplate} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={uploadedFiles.filter(f => f.status === 'completed').length === 0} 
                  className="bg-gradient-ocean"
                >
                  Process {uploadedFiles.filter(f => f.status === 'completed').length} File(s)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* File Queue */}
          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Queue ({uploadedFiles.length})</CardTitle>
                <CardDescription>
                  Monitor file upload and processing status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(file.status)}
                          <span className="font-medium">{file.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(file.status)}>
                            {file.status.toUpperCase()}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            disabled={file.status === 'processing'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {file.status === 'uploading' && (
                        <div className="mb-2">
                          <Progress value={uploadProgress[file.id] || 0} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploading... {uploadProgress[file.id] || 0}%
                          </p>
                        </div>
                      )}
                      
                      <div className="text-sm text-muted-foreground">
                        <span>Size: {(file.size / 1024).toFixed(1)} KB</span>
                        <span className="ml-4">Type: {file.type || 'Unknown'}</span>
                        <span className="ml-4">Uploaded: {file.uploadedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview Table */}
          {previewData.length > 0 && (
            <Card className="overflow-auto">
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>
                  Showing first 10 rows of uploaded data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>id</TableHead>
                        <TableHead>Scientific Name</TableHead>
                        <TableHead>sex</TableHead>
                        <TableHead>habitat</TableHead>
                        <TableHead>samplingProtocol</TableHead>
                        <TableHead>waterBody</TableHead>
                        <TableHead>country</TableHead>
                        <TableHead>locality</TableHead>
                        <TableHead>Minimum Depth</TableHead>
                        <TableHead>Maximum Depth</TableHead>
                        <TableHead>Latitude</TableHead>
                        <TableHead>Longitude</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row["id"]}</TableCell>
                          <TableCell>{row["scientificName"]}</TableCell>
                          <TableCell>{row["sex"]}</TableCell>
                          <TableCell>{row["habitat"]}</TableCell>
                          <TableCell>{row["samplingProtocol"]}</TableCell>
                          <TableCell>{row["waterBody"]}</TableCell>
                          <TableCell>{row["country"]}</TableCell>
                          <TableCell>{row["locality"]}</TableCell>
                          <TableCell>{row["minimumDepthInMeters"]}</TableCell>
                          <TableCell>{row["maximumDepthInMeters"]}</TableCell>
                          <TableCell>{row["decimalLatitude"]}</TableCell>
                          <TableCell>{row["decimalLongitude"]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;