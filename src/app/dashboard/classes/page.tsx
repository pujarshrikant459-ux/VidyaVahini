
"use client";

import { useStudents } from "@/hooks/use-students";
import { teachers } from "@/lib/data";
import type { Student } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useLocalization } from "@/hooks/use-localization";

export default function ClassesPage() {
    const { students } = useStudents();
    const { t } = useLocalization();

    const classes = Array.from({ length: 10 }, (_, i) => {
        const grade = i + 1;
        let classNameSuffix = "th";
        if (grade === 1) classNameSuffix = "st";
        if (grade === 2) classNameSuffix = "nd";
        if (grade === 3) classNameSuffix = "rd";

        const className = `${grade}${classNameSuffix}`;

        const studentsInClass = students.filter(s => s.class.startsWith(grade.toString()));
        const teacher = teachers.find(t => t.classAssigned?.startsWith(grade.toString()));

        return {
            name: `${className} Grade`,
            studentCount: studentsInClass.length,
            teacher: teacher?.name || t('notAssigned'),
            students: studentsInClass,
        };
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('classes')}</CardTitle>
                <CardDescription>{t('manageClasses')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {classes.map((c, index) => (
                        <AccordionItem value={`class-${index}`} key={index}>
                            <AccordionTrigger>
                                <div className="flex justify-between w-full items-center pr-4">
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium text-lg">{c.name}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {c.studentCount} {t('studentsCount')} | {t('teacher')}: {c.teacher}
                                        </span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {c.students.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden w-[100px] sm:table-cell">{t('image')}</TableHead>
                                                <TableHead>{t('name')}</TableHead>
                                                <TableHead>{t('classSection')}</TableHead>
                                                <TableHead>{t('rollNumber')}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {c.students.map(student => (
                                                <TableRow key={student.id}>
                                                    <TableCell className="hidden sm:table-cell">
                                                        <Image
                                                            alt="Student avatar"
                                                            className="aspect-square rounded-full object-cover"
                                                            height="40"
                                                            src={student.photo}
                                                            width="40"
                                                            data-ai-hint="student portrait"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        <Link href={`/dashboard/students/${student.id}`} className="hover:underline">
                                                            {student.name}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{student.class}</Badge>
                                                    </TableCell>
                                                    <TableCell>{student.rollNumber}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-center text-muted-foreground p-4">{t('noStudentsEnrolled')}</p>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}
