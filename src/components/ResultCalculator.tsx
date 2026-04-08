import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileText, BarChart3, Trash2, Loader2, GraduationCap, ArrowLeft, Plus } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { analyzeStudentData, StudentData } from '@/src/lib/gemini';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ResultCalculatorProps {
  onBack: () => void;
}

export const ResultCalculator: React.FC<ResultCalculatorProps> = ({ onBack }) => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('results');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    setIsAnalyzing(true);
    try {
      for (const file of acceptedFiles) {
        const reader = new FileReader();
        
        if (file.type.startsWith('image/')) {
          reader.onload = async () => {
            const base64 = (reader.result as string).split(',')[1];
            const result = await analyzeStudentData({
              mimeType: file.type,
              data: base64
            });
            setStudents(prev => [...prev, ...result]);
            setIsDialogOpen(false);
            setActiveTab('results');
          };
          reader.readAsDataURL(file);
        } else {
          reader.onload = async () => {
            const text = reader.result as string;
            const result = await analyzeStudentData(text);
            setStudents(prev => [...prev, ...result]);
            setIsDialogOpen(false);
            setActiveTab('results');
          };
          reader.readAsText(file);
        }
      }
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt']
    },
    multiple: true
  } as any);

  const clearData = () => {
    setStudents([]);
    setActiveTab('upload');
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-emerald-500';
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-blue-500';
      case 'C': return 'bg-yellow-500';
      case 'D': return 'bg-orange-500';
      default: return 'bg-red-500';
    }
  };

  const gradeDistribution = students.reduce((acc: any, student) => {
    acc[student.grade] = (acc[student.grade] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(gradeDistribution).map(grade => ({
    name: grade,
    value: gradeDistribution[grade]
  }));

  const COLORS = ['#10b981', '#22c55e', '#3b82f6', '#eab308', '#f97316', '#ef4444'];

  return (
    <div className="min-h-screen bg-[#f5f5f4] p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
              <p className="text-sm opacity-50 uppercase tracking-widest font-bold">Class XI Result Analysis</p>
            </div>
          </div>
          <div className="flex gap-4">
            {students.length > 0 && (
              <Button variant="outline" onClick={clearData} className="rounded-full border-red-200 text-red-600 hover:bg-red-50">
                <Trash2 size={16} className="mr-2" />
                Clear Data
              </Button>
            )}
            <div className="w-10 h-10 bg-[#0a0a0a] rounded-full flex items-center justify-center text-white">
              <GraduationCap size={20} />
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-between items-center">
            <TabsList className="bg-white/50 p-1 rounded-full border border-[#0a0a0a]/5">
              <TabsTrigger value="results" className="rounded-full px-8 data-[state=active]:bg-[#0a0a0a] data-[state=active]:text-white">
                <FileText size={14} className="mr-2" />
                Results
              </TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-full px-8 data-[state=active]:bg-[#0a0a0a] data-[state=active]:text-white">
                <BarChart3 size={14} className="mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger render={
                <Button className="rounded-full bg-[#0a0a0a] text-white px-6 uppercase text-xs tracking-widest font-bold">
                  <Plus size={16} className="mr-2" />
                  Upload Data
                </Button>
              } />
              <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none bg-transparent shadow-none">
                <Card className="border-none shadow-2xl">
                  <CardHeader className="bg-[#0a0a0a] text-white p-8">
                    <DialogTitle className="text-2xl font-light italic">Neural Analysis</DialogTitle>
                    <DialogDescription className="text-white/60 uppercase tracking-widest text-[10px] font-bold">
                      Upload student data for CNN processing
                    </DialogDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div {...getRootProps()} className={`
                      border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
                      ${isDragActive ? 'border-[#0a0a0a] bg-gray-50' : 'border-gray-200 hover:border-gray-300'}
                    `}>
                      <input {...getInputProps()} />
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        {isAnalyzing ? (
                          <Loader2 className="animate-spin text-[#0a0a0a]" size={24} />
                        ) : (
                          <Upload className="text-[#0a0a0a]" size={24} />
                        )}
                      </div>
                      <p className="text-sm font-medium mb-1">
                        {isAnalyzing ? "Analyzing..." : "Drop files here"}
                      </p>
                      <p className="text-xs opacity-40 uppercase tracking-wider">
                        Images, CSV, or Text
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </DialogContent>
            </Dialog>
          </div>

          <AnimatePresence mode="wait">
            <TabsContent value="results">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="bg-white border-none shadow-sm overflow-hidden">
                  <CardHeader className="border-b border-gray-50">
                    <CardTitle>Student Performance Ledger</CardTitle>
                    <CardDescription>Detailed breakdown of marks and calculated percentages.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[500px]">
                      <Table>
                        <TableHeader className="bg-gray-50/50">
                          <TableRow>
                            <TableHead className="w-[200px] uppercase text-[10px] font-bold tracking-widest">Student Name</TableHead>
                            <TableHead className="uppercase text-[10px] font-bold tracking-widest">Roll No.</TableHead>
                            <TableHead className="uppercase text-[10px] font-bold tracking-widest">Subjects</TableHead>
                            <TableHead className="text-right uppercase text-[10px] font-bold tracking-widest">Percentage</TableHead>
                            <TableHead className="text-right uppercase text-[10px] font-bold tracking-widest">Grade</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="h-64 text-center opacity-30 italic">
                                No data analyzed yet.
                              </TableCell>
                            </TableRow>
                          ) : (
                            students.map((student, idx) => (
                              <TableRow key={idx} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="font-medium">{student.name}</TableCell>
                                <TableCell className="font-mono text-xs opacity-60">{student.rollNumber}</TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {student.subjects.map((sub, sIdx) => (
                                      <Badge key={sIdx} variant="secondary" className="text-[10px] font-normal bg-gray-100">
                                        {sub.name}: {sub.marks}/{sub.maxMarks}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                  {student.totalPercentage.toFixed(2)}%
                                </TableCell>
                                <TableCell className="text-right">
                                  <Badge className={`${getGradeColor(student.grade)} text-white border-none`}>
                                    {student.grade}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="analytics">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                <Card className="bg-white border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest font-bold opacity-50">Grade Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest font-bold opacity-50">Performance Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={students}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" hide />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="totalPercentage" fill="#0a0a0a" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
};
