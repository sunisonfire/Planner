import { Evaluation } from '../types';

export interface GradeCalculationResult {
  accumulatedGrade: number;
  gradedPercentage: number;
  remainingPercentage: number;
  currentWeightedAverage: number;
  totalConfiguredPercentage: number;
  requiredGrade: number | null;
  status: 'passed_already' | 'achievable' | 'impossible' | 'finished_passed' | 'finished_failed' | 'no_evaluations';
  statusMessage: string;
  badgeColor: string;
}

export function calculateSubjectGrades(
  evaluations: Evaluation[],
  minPassingGrade = 3.0,
  maxGrade = 5.0
): GradeCalculationResult {
  if (!evaluations || evaluations.length === 0) {
    return {
      accumulatedGrade: 0,
      gradedPercentage: 0,
      remainingPercentage: 100,
      currentWeightedAverage: 0,
      totalConfiguredPercentage: 0,
      requiredGrade: minPassingGrade,
      status: 'no_evaluations',
      statusMessage: 'Agrega evaluaciones con sus porcentajes y notas para calcular tu rendimiento.',
      badgeColor: 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400',
    };
  }

  let accumulatedGrade = 0;
  let gradedPercentage = 0;
  let totalConfiguredPercentage = 0;

  evaluations.forEach((evalItem) => {
    const weight = Number(evalItem.weight) || 0;
    totalConfiguredPercentage += weight;

    if (evalItem.isGraded && evalItem.grade !== undefined && !isNaN(evalItem.grade)) {
      const grade = Number(evalItem.grade);
      accumulatedGrade += grade * (weight / 100);
      gradedPercentage += weight;
    }
  });

  const remainingPercentage = Math.max(0, 100 - gradedPercentage);
  const currentWeightedAverage =
    gradedPercentage > 0 ? accumulatedGrade / (gradedPercentage / 100) : 0;

  // If 100% is already evaluated
  if (remainingPercentage <= 0 || gradedPercentage >= 100) {
    const finalGrade = Math.round(accumulatedGrade * 100) / 100;
    if (finalGrade >= minPassingGrade) {
      return {
        accumulatedGrade: Math.round(accumulatedGrade * 100) / 100,
        gradedPercentage: 100,
        remainingPercentage: 0,
        currentWeightedAverage: Math.round(currentWeightedAverage * 100) / 100,
        totalConfiguredPercentage,
        requiredGrade: null,
        status: 'finished_passed',
        statusMessage: `🎉 ¡Materia aprobada con nota final de ${finalGrade.toFixed(2)}!`,
        badgeColor: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300',
      };
    } else {
      return {
        accumulatedGrade: Math.round(accumulatedGrade * 100) / 100,
        gradedPercentage: 100,
        remainingPercentage: 0,
        currentWeightedAverage: Math.round(currentWeightedAverage * 100) / 100,
        totalConfiguredPercentage,
        requiredGrade: null,
        status: 'finished_failed',
        statusMessage: `❌ Materia reprobada con nota final de ${finalGrade.toFixed(2)}.`,
        badgeColor: 'text-rose-700 bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300',
      };
    }
  }

  // Calculate required grade in remaining percentage
  const neededDifference = minPassingGrade - accumulatedGrade;
  const requiredGradeRaw = neededDifference / (remainingPercentage / 100);
  const requiredGrade = Math.round(requiredGradeRaw * 100) / 100;

  if (requiredGrade <= 0) {
    return {
      accumulatedGrade: Math.round(accumulatedGrade * 100) / 100,
      gradedPercentage,
      remainingPercentage,
      currentWeightedAverage: Math.round(currentWeightedAverage * 100) / 100,
      totalConfiguredPercentage,
      requiredGrade: 0,
      status: 'passed_already',
      statusMessage: '🎉 ¡Ya tienes suficiente acumulado para aprobar la materia!',
      badgeColor: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300',
    };
  }

  if (requiredGrade > maxGrade) {
    return {
      accumulatedGrade: Math.round(accumulatedGrade * 100) / 100,
      gradedPercentage,
      remainingPercentage,
      currentWeightedAverage: Math.round(currentWeightedAverage * 100) / 100,
      totalConfiguredPercentage,
      requiredGrade,
      status: 'impossible',
      statusMessage: `😭 Necesitarías sacar ${requiredGrade.toFixed(2)} (más del máximo ${maxGrade}) en el ${remainingPercentage}% restante para aprobar con ${minPassingGrade}.`,
      badgeColor: 'text-rose-700 bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300',
    };
  }

  return {
    accumulatedGrade: Math.round(accumulatedGrade * 100) / 100,
    gradedPercentage,
    remainingPercentage,
    currentWeightedAverage: Math.round(currentWeightedAverage * 100) / 100,
    totalConfiguredPercentage,
    requiredGrade,
    status: 'achievable',
    statusMessage: `Para aprobar con ${minPassingGrade.toFixed(1)} necesitas sacar un promedio de ${requiredGrade.toFixed(2)} en el ${remainingPercentage}% restante.`,
    badgeColor: 'text-amber-700 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300',
  };
}
