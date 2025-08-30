// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
// import { FileText, Download, Search, TrendingUp, Award } from "lucide-react"
// import type { ExamResult } from "@/lib/types/parent"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// // Mock exam results data
// const mockExamResults: ExamResult[] = [
//   {
//     exam_id: 1,
//     exam_name: "Unit Test 1",
//     exam_type: "Unit Test",
//     subject: "Mathematics",
//     max_marks: 100,
//     obtained_marks: 85,
//     percentage: 85,
//     grade: "A",
//     exam_date: "2024-01-15",
//     result_date: "2024-01-20",
//     remarks: "Good performance in algebra",
//   },
//   {
//     exam_id: 2,
//     exam_name: "Unit Test 1",
//     exam_type: "Unit Test",
//     subject: "Science",
//     max_marks: 100,
//     obtained_marks: 92,
//     percentage: 92,
//     grade: "A+",
//     exam_date: "2024-01-16",
//     result_date: "2024-01-21",
//     remarks: "Excellent understanding of concepts",
//   },
//   {
//     exam_id: 3,
//     exam_name: "Unit Test 1",
//     exam_type: "Unit Test",
//     subject: "English",
//     max_marks: 100,
//     obtained_marks: 78,
//     percentage: 78,
//     grade: "B+",
//     exam_date: "2024-01-17",
//     result_date: "2024-01-22",
//     remarks: "Good essay writing skills",
//   },
//   {
//     exam_id: 4,
//     exam_name: "Mid Term",
//     exam_type: "Mid Term",
//     subject: "Mathematics",
//     max_marks: 100,
//     obtained_marks: 88,
//     percentage: 88,
//     grade: "A",
//     exam_date: "2024-02-15",
//     result_date: "2024-02-25",
//     remarks: "Consistent performance",
//   },
//   {
//     exam_id: 5,
//     exam_name: "Mid Term",
//     exam_type: "Mid Term",
//     subject: "Science",
//     max_marks: 100,
//     obtained_marks: 95,
//     percentage: 95,
//     grade: "A+",
//     exam_date: "2024-02-16",
//     result_date: "2024-02-26",
//     remarks: "Outstanding performance",
//   },
// ]

// export function ExamResults() {
//   const [examResults] = useState<ExamResult[]>(mockExamResults)
//   const [filteredResults, setFilteredResults] = useState<ExamResult[]>(mockExamResults)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedExamType, setSelectedExamType] = useState<string>("all")
//   const [selectedSubject, setSelectedSubject] = useState<string>("all")
//   const [isMobile, setIsMobile] = useState(false)

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768)
//     }

//     handleResize()
//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   // Filter logic
//   const filterResults = () => {
//     let filtered = examResults

//     if (searchTerm) {
//       filtered = filtered.filter(
//         (result) =>
//           result.exam_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           result.subject.toLowerCase().includes(searchTerm.toLowerCase()),
//       )
//     }

//     if (selectedExamType !== "all") {
//       filtered = filtered.filter((result) => result.exam_type === selectedExamType)
//     }

//     if (selectedSubject !== "all") {
//       filtered = filtered.filter((result) => result.subject === selectedSubject)
//     }

//     setFilteredResults(filtered)
//   }

//   // Apply filters when dependencies change
//   useEffect(() => {
//     filterResults()
//   }, [searchTerm, selectedExamType, selectedSubject])

//   const getGradeColor = (grade: string) => {
//     switch (grade) {
//       case "A+":
//         return "bg-green-100 text-green-800"
//       case "A":
//         return "bg-green-50 text-green-700"
//       case "B+":
//         return "bg-blue-50 text-blue-700"
//       case "B":
//         return "bg-blue-100 text-blue-800"
//       case "C+":
//         return "bg-yellow-50 text-yellow-700"
//       case "C":
//         return "bg-yellow-100 text-yellow-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   const getPerformanceColor = (percentage: number) => {
//     if (percentage >= 90) return "text-green-600"
//     if (percentage >= 80) return "text-blue-600"
//     if (percentage >= 70) return "text-yellow-600"
//     return "text-red-600"
//   }

//   const averagePercentage = filteredResults.length > 0
//     ? filteredResults.reduce((sum, result) => sum + result.percentage, 0) / filteredResults.length
//     : 0

//   const subjects = [...new Set(examResults.map((result) => result.subject))]
//   const examTypes = [...new Set(examResults.map((result) => result.exam_type))]

//   // Summary Cards Data
//   const summaryCards = [
//     {
//       title: "Total Exams",
//       value: filteredResults.length,
//       icon: <FileText className="h-4 w-4 text-muted-foreground" />,
//       description: "Exams completed",
//     },
//     {
//       title: "Average Score",
//       value: filteredResults.length > 0 ? `${averagePercentage.toFixed(1)}%` : "0%",
//       icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
//       description: "Overall performance",
//       valueClass: getPerformanceColor(averagePercentage),
//     },
//     {
//       title: "Best Grade",
//       value: filteredResults.length > 0 ?
//         filteredResults.reduce((prev, current) =>
//           (prev.grade > current.grade) ? prev : current).grade : 'N/A',
//       icon: <Award className="h-4 w-4 text-muted-foreground" />,
//       description: "Highest achievement",
//       valueClass: "text-green-600",
//     },
//   ]

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Exam Results</h1>
//         <p className="text-sm md:text-base text-muted-foreground">View all exam results and academic performance</p>
//       </div>

//       {/* Summary Stats - Scrollable on mobile */}
//       <div className="relative">
//         {/* Mobile scrollable cards */}
//         <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
//           <div className="flex space-x-4 w-max min-w-full">
//             {summaryCards.map((card, index) => (
//               <Card key={index} className="w-[280px] flex-shrink-0">
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
//                   {card.icon}
//                 </CardHeader>
//                 <CardContent>
//                   <div className={`text-2xl font-bold ${card.valueClass || ""}`}>
//                     {card.value}
//                   </div>
//                   <p className="text-xs text-muted-foreground">{card.description}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* Desktop grid cards */}
//         <div className="hidden md:grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//           {summaryCards.map((card, index) => (
//             <Card key={index}>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
//                 {card.icon}
//               </CardHeader>
//               <CardContent>
//                 <div className={`text-2xl font-bold ${card.valueClass || ""}`}>
//                   {card.value}
//                 </div>
//                 <p className="text-xs text-muted-foreground">{card.description}</p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {/* Filters */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg md:text-xl">Filter Results</CardTitle>
//           <CardDescription className="text-sm md:text-base">Filter exam results by type, subject, or search</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col md:flex-row gap-3">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <Input
//                 placeholder="Search by exam name or subject..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <Select
//                 value={selectedExamType}
//                 onValueChange={(value) => setSelectedExamType(value)}
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Exam Type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Types</SelectItem>
//                   {examTypes.map((type) => (
//                     <SelectItem key={type} value={type}>
//                       {type}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <Select
//                 value={selectedSubject}
//                 onValueChange={(value) => setSelectedSubject(value)}
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Subject" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Subjects</SelectItem>
//                   {subjects.map((subject) => (
//                     <SelectItem key={subject} value={subject}>
//                       {subject}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <Button variant="outline" className="w-full md:w-auto">
//               <Download className="mr-2 h-4 w-4" />
//               <span className="hidden sm:inline">Export</span>
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Results Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Exam Results</CardTitle>
//           <CardDescription>
//             Showing {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {filteredResults.length > 0 ? (
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Subject</TableHead>
//                     <TableHead>Exam</TableHead>
//                     {!isMobile && (
//                       <>
//                         <TableHead>Type</TableHead>
//                         <TableHead>Date</TableHead>
//                       </>
//                     )}
//                     <TableHead className="text-right">Marks</TableHead>
//                     <TableHead className="text-right">Grade</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredResults.map((result) => (
//                     <TableRow key={result.exam_id}>
//                       <TableCell className="font-medium">{result.subject}</TableCell>
//                       <TableCell>{result.exam_name}</TableCell>
//                       {!isMobile && (
//                         <>
//                           <TableCell>
//                             <Badge variant="outline">{result.exam_type}</Badge>
//                           </TableCell>
//                           <TableCell>
//                             {new Date(result.exam_date).toLocaleDateString('en-US', {
//                               year: 'numeric',
//                               month: 'short',
//                               day: 'numeric'
//                             })}
//                           </TableCell>
//                         </>
//                       )}
//                       <TableCell className="text-right">
//                         <span className={`font-semibold ${getPerformanceColor(result.percentage)}`}>
//                           {result.obtained_marks}/{result.max_marks}
//                         </span>
//                         <span className="block text-xs text-muted-foreground">
//                           {result.percentage}%
//                         </span>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <Badge className={`${getGradeColor(result.grade)}`}>
//                           {result.grade}
//                         </Badge>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//               <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
//               <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

export function ExamResults() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
        Exam Results
      </h1>
      <p className="text-sm md:text-base text-muted-foreground">
        View all exam results and academic performance
      </p>
      {/* Placeholder for Exam Results Component */}
      <div className="h-64 bg-gray-100 flex items-center justify-center rounded-md">
        <p className="text-gray-500">
          Exam Results Will be displayed here soon ...
        </p>
      </div>
    </div>
  );
}
