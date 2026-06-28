import type { Request, Response } from "express";
import { prisma } from "@/db/prisma";
import { asyncHandler } from "@/middleware/async-handler";
import { AcademicStream, Subject } from "@prisma-client";
import type {
  JambCatalogQueryInput,
  JambValidateInput,
} from "@/validators/schemas";

/**
 * Fetches the available JAMB courses, optionally filtered by Academic Stream or Faculty Area.
 */
export const getCatalog = asyncHandler<
  Request<Record<string, never>, unknown, unknown, JambCatalogQueryInput>
>(async (req, res: Response) => {
  const { stream, faculty } = req.query;

  const courses = await prisma.jambCourse.findMany({
    where: {
      streamCategory: stream
        ? AcademicStream[stream as keyof typeof AcademicStream]
        : undefined,
      facultyArea: faculty
        ? {
            contains: faculty,
            mode: "insensitive",
          }
        : undefined,
    },
    include: {
      mandatorySubjects: true,
    },
    orderBy: {
      courseName: "asc",
    },
  });

  res.json({
    courses,
    total: courses.length,
  });
});

/**
 * Validates a student's chosen subjects against a target JAMB course's requirements.
 * Persists results directly into an immutable log matching NFR-01 audit specs.
 */
export const validateCombination = asyncHandler<
  Request<Record<string, never>, unknown, JambValidateInput>
>(async (req, res: Response) => {
  const studentId = req.student!.id;
  const { jambCourseId, studentSubjects } = req.body;

  const course = await prisma.jambCourse.findUnique({
    where: { id: jambCourseId },
    include: { mandatorySubjects: true },
  });

  if (!course) {
    res.status(404).json({
      error: `JAMB course with id "${jambCourseId}" was not found`,
    });
    return;
  }

  // FIXED TS7006: Explicitly typed the structural closure row
  const required: Subject[] = course.mandatorySubjects.map(
    (subjectRow: { subject: Subject }): Subject => subjectRow.subject
  );

  const normalizedStudentSubjects = studentSubjects as Subject[];
  const studentSet = new Set<Subject>(normalizedStudentSubjects);

  const missing: Subject[] = required.filter(
    (subject: Subject) => !studentSet.has(subject)
  );

  const isCompliant = missing.length === 0;

  const validation = await prisma.jambValidation.create({
    data: {
      studentId,
      jambCourseId: course.id,
      recommendedStream: course.streamCategory,
      isCompliant,
      missingSubjects: missing,
      validationNotes: isCompliant
        ? `All ${required.length} mandatory subjects satisfied for ${course.courseName}.`
        : `Missing ${missing.length} of ${required.length} mandatory subjects for ${course.courseName}.`,
    },
  });

  res.json({
    course: course.courseName,
    stream: course.streamCategory,
    mandatorySubjects: required,
    studentSubjects: normalizedStudentSubjects,
    compliant: isCompliant,
    missingSubjects: missing,
    message: isCompliant
      ? `Your subject combination fully satisfies JAMB requirements for ${course.courseName}.`
      : `Missing required subjects for ${course.courseName}: ${missing.join(", ")}.`,
    validationId: validation.id,
  });
});

/**
 * Retrieves the historical validation log trail for the active logged-in student profile.
 */
export const getValidationHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const validations = await prisma.jambValidation.findMany({
      where: {
        studentId: req.student!.id,
      },
      include: {
        jambCourse: true,
      },
      orderBy: {
        validatedAt: "desc",
      },
      take: 10,
    });

    res.json({
      history: validations,
    });
  }
);